<?php

use App\Http\Controllers\Admin\AdminUserAdminsController;
use App\Http\Controllers\Admin\AdminUserController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->group(function () {
    //Users
    Route::get('admin/users', [AdminUserController::class,'index'])->name('admin.users.index');
    Route::get('admin/users/create', [AdminUserController::class,'create'])->name('admin.users.create');
    Route::post('admin/users', [AdminUserController::class,'store'])->name('admin.users.store');
    Route::get('admin/users/{user}/edit', [AdminUserController::class,'edit'])->name('admin.users.edit');
    Route::post('admin/save-personal-information/{user}', [AdminUserController::class,'update_personal_information'])->name('admin.users.update-personal-information');
    Route::post('admin/save-account-information/{user}', [AdminUserController::class,'update_account_information'])->name('admin.users.update-account-information');
    Route::post('save-address-information/{user}', [AdminUserController::class,'update_address_information'])->name('admin.users.update-address-information');
    Route::delete('admin/users/{user}', [AdminUserController::class,'destroy'])->name('admin.users.destroy');

    //Admin Users
    Route::get('admin/admin-users', [AdminUserAdminsController::class,'index'])->name('admin.users.admin.index');

});