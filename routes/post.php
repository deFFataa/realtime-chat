<?php

use App\Http\Controllers\PostController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware('auth')->group(function () {
    Route::get('/discussion-board', [PostController::class,'index'])->name('discussion-board.index');
    Route::get('/discussion-board/create', [PostController::class,'create'])->name('discussion-board.index');
    Route::post('/discussion-board', [PostController::class,'store'])->name('discussion-board.store');
});