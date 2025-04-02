<?php

use App\Events\AddedMemberToGroupChat;
use App\Events\TotalPosts;
use App\Events\TotalUsers;
use App\Models\Conversation;
use App\Models\Post;
use App\Models\Room;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Events\GotMessage;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ConversationController;

use App\Http\Controllers\ChatController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {

        if (Auth::user()->role == 'admin') {
            abort(403);
        }

        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('admin/dashboard', function () {

        if (Auth::user()->role == 'user') {
            abort(403);
        }
        return Inertia::render('admin/dashboard', [
            'new_users' => User::whereBetween('created_at', [now()->subWeek(), now()])->where('role', 'user')->latest()->get(),
            'users_count' => User::where('role', 'user')->count(),
            'posts_count' => Post::count(),
            'active_users' => User::where('role', 'user')
                ->where('is_loggedin', true)
                ->count(),
            'all_users' => User::where('role', 'user')->get(),
            broadcast(new TotalUsers()),
            broadcast(new TotalPosts())
        ]);
    })->name('admin.dashboard');
});

Route::get('/room/{room}', function (Room $room) {

    return Inertia::render('room', [
        'room' => $room
    ]);

})->middleware(('auth'))->name('room');

// Route::get('/broadcast', function(){
//     broadcast(new AddedMemberToGroupChat(Conversation::find(8), auth()->user()->id))->toOthers();
// });

// Route::get('/chat/hello', [ChatController::class, 'show'])->name('chat.show');

require __DIR__ . '/settings.php';
require __DIR__ . '/post.php';
require __DIR__ . '/auth.php';
require __DIR__ . '/conversation.php';
require __DIR__ . '/chat.php';
