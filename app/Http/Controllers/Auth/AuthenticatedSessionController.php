<?php

namespace App\Http\Controllers\Auth;

use App\Events\NewUser;
use App\Events\TotalActiveUsers;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\Feedback;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Show the login page.
     */
    public function create(Request $request): Response
    {
        return Inertia::render('auth/login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();
        // Update the 'is_loggedin' column to true
        $request->session()->regenerate();

        Auth::user()->update(['is_loggedin' => true]);
        broadcast(new TotalActiveUsers());

        if (Auth::user()->role !== 'user') {
            return redirect()->intended(route('admin.dashboard', absolute: false));
        }

        return redirect()->intended('home');
    }


    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $userId = Auth::id();
    
        Auth::user()->update(['is_loggedin' => false]);
        broadcast(new TotalActiveUsers());
        Auth::guard('web')->logout();
    
        $request->session()->invalidate();
        $request->session()->regenerateToken();
    
        $hasRatedToday = Feedback::where('user_id', $userId)->whereDate('created_at', today())->exists();
    
        if (!$hasRatedToday) {
            return redirect('/login')->with('user_id', $userId);
        }
    
        return redirect('/login');
    }
}
