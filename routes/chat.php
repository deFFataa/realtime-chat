<?php

use App\Http\Controllers\ChatController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->group(function(){
    Route::get('/chat/all', [ChatController::class, 'all']);
    Route::post('/chat/all', [ChatController::class, 'storeGlobal'])->name('chat.store-global');


    Route::get('/chat', [ChatController::class, 'index']);
    Route::get('/chat/{id}', [ChatController::class, 'show'])->name('chat.show');
    Route::post('/chat', [ChatController::class, 'store'])->name('chat.store');
});