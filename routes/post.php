<?php

use App\Http\Controllers\PostController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware('auth')->group(function () {
    Route::get('/home', [PostController::class,'index'])->name('discussion-board.index');
    Route::get('/post/create', [PostController::class,'create'])->name('discussion-board.create');
    Route::post('/home', [PostController::class,'store'])->name('discussion-board.store');
    Route::post('/home/media', [PostController::class,'store_files'])->name('discussion-board.store-with-media');
    Route::get('/post/{post}', [PostController::class,'show'])->name('discussion-board.show');
    Route::delete('/post/{post}', [PostController::class,'destroy'])->name('discussion-board.destroy');

    Route::post('/post/{post}/comment', [PostController::class,'comment'])->name('discussion-board.comment-post');
    Route::post('/post/{post}/like', [PostController::class,'like'])->name('discussion-board.like-post');
});