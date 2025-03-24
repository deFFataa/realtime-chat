<?php

use App\Http\Controllers\ConversationController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->group(function () {
    Route::post('/conversation', [ConversationController::class, 'store'])->name('conversation.store');
    Route::get('/chat/group/{id}', [ConversationController::class,'show'])->name('conversation.show');
    Route::post('/chat/group/', [ConversationController::class, 'send_message'])->name('conversation.send_message');

});