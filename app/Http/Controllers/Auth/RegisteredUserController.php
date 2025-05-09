<?php

namespace App\Http\Controllers\Auth;

use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;
use App\Events\NewUser;
use App\Events\TotalUsers;
use Illuminate\Http\Request;
use App\Events\TotalActiveUsers;
use Illuminate\Validation\Rules;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\RedirectResponse;
use Illuminate\Auth\Events\Registered;

class RegisteredUserController extends Controller
{
    /**
     * Show the registration page.
     */
    public function create(): Response
    {
        return Inertia::render('auth/register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'first_name' => 'required|string|max:255',
            'middle_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'extension_name' => 'nullable|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = User::create([
            'first_name'=> $request->first_name,
            'middle_name'=> $request->middle_name,
            'last_name'=> $request->last_name,
            'extension_name'=> $request->extension_name,
            'name' => $request->first_name . ' ' . $request->middle_name . ' ' . $request->last_name . ' ' . $request->extension_name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'is_loggedin' => true,
        ]);

        DB::table('address')->insert([
            'user_id' => $user->id,
            'country' => 'Philippines',
        ]);

        broadcast(new TotalUsers());
        broadcast(new TotalActiveUsers());
        broadcast(new NewUser($user));

        event(new Registered($user));

        Auth::login($user);

        return redirect('/home');
    }
}
