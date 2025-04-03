<?php

use App\Http\Controllers\Admin\AdminUserAdminsController;
use App\Http\Controllers\Admin\AdminUserController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

Route::middleware('auth')->group(function () {
    //Users
    Route::get('admin/users', [AdminUserController::class,'index'])->name('admin.users.index');
    Route::get('admin/users/{user}/edit', [AdminUserController::class,'edit'])->name('admin.users.edit');

    //Admin Users
    Route::get('admin/admin-users', [AdminUserAdminsController::class,'index'])->name('admin.users.admin.index');
});