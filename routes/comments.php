<?php

use App\Http\Controllers\CommentController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->group(function () {
    Route::delete('comments/{comment}', [CommentController::class, 'destroy'])->name('comments.destroy');

    Route::post('comments/{comment}/reply', [CommentController::class, 'reply'])->name('comments.reply');
    Route::post('comments/{comment}/like-reply', [CommentController::class, 'like'])->name('comments.like-reply');
});