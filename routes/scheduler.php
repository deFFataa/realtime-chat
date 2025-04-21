<?php

use App\Http\Controllers\SchedulerController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->group(function () {
    Route::get('admin/meeting-scheduler', [SchedulerController::class, 'index'])->name('admin.schedules.index');
    Route::get('admin/meeting-scheduler/create', [SchedulerController::class, 'create'])->name('admin.schedules.create');
    Route::post('admin/meeting-scheduler/store', [SchedulerController::class, 'store'])->name('admin.schedules.store');
    Route::get('admin/meeting-scheduler/{scheduler}/edit', [SchedulerController::class, 'edit'])->name('admin.schedules.edit');
    Route::post('admin/meeting-scheduler/{scheduler}/update', [SchedulerController::class, 'update'])->name('admin.schedules.update');
    Route::delete('admin/meeting-scheduler/{scheduler}', [SchedulerController::class, 'destroy'])->name('admin.schedules.destroy');

    Route::get('attendance/{scheduler}/confirm/{user}', [SchedulerController::class, 'showConfirmation'])->name('admin.schedules.showConfirm');
    Route::post('attendance/{scheduler}/confirm/{user}', [SchedulerController::class, 'confirm'])->name('admin.schedules.confirm');
});
