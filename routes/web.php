<?php

use App\Events\TotalUsers;
use App\Models\Room;
use App\Models\User;
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
        return Inertia::render('dashboard', [
            'users_count' => User::count(),
            broadcast(new TotalUsers())
        ]);
    })->name('dashboard');
});

Route::get('/room/{room}', function(Room $room){

    return Inertia::render('room', [
        'room' => $room
    ]);

})->middleware(('auth'))->name('room');

// Route::get('/chat/hello', [ChatController::class, 'show'])->name('chat.show');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/conversation.php';

require __DIR__.'/chat.php';
