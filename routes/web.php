<?php

use App\Models\Post;
use App\Models\User;
use Inertia\Inertia;
use App\Models\Scheduler;
use App\Events\TotalPosts;
use App\Events\TotalUsers;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SchedulerController;
use Illuminate\Support\Facades\URL;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {

        if (Auth::user()->role !== 'user') {
            abort(403);
        }

        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('admin/dashboard', function () {

        if (Auth::user()->role === 'user') {
            abort(403);
        }
        return Inertia::render('admin/dashboard/index', [
            'new_users' => User::whereBetween('created_at', [now()->subWeek(), now()])->where('role', 'user')->latest()->get(),
            'users_count' => User::where('role', 'user')->count(),
            'posts_count' => Post::count(),
            'active_users' => User::where('role', 'user')
                ->where('is_loggedin', true)
                ->count(),
            'all_users' => User::where('role', 'user')->get(['name', 'created_at']),
            'schedule' => Scheduler::all(),
            broadcast(new TotalUsers()),
            broadcast(new TotalPosts())
        ]);
    })->name('admin.dashboard');
});

Route::get('attendance/{scheduler}/confirm/{user}', [SchedulerController::class, 'confirmViaSignedUrl'])
    ->name('admin.schedules.confirm.signed')
    ->middleware('signed'); // <-- this is important


require __DIR__ . '/settings.php';
require __DIR__ . '/post.php';
require __DIR__ . '/auth.php';
require __DIR__ . '/conversation.php';
require __DIR__ . '/chat.php';
require __DIR__ . '/admin_users.php';
require __DIR__ . '/scheduler.php';
require __DIR__ . '/agenda.php';
