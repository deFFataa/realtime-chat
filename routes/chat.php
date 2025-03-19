<?php

use App\Http\Controllers\ChatController;
use Illuminate\Support\Facades\Route;

Route::controller(ChatController::class)->group(function(){
    Route::get('/chat','index');
    Route::get('/chat/{id}','show')->name('chat.show');
    Route::post('/chat', 'store')->name('chat.store');
})->middleware('auth');

