<?php

use App\Http\Controllers\SchedulerController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->group(function () {
    Route::get('admin/meeting-scheduler', [SchedulerController::class, 'index'])->name('admin.schedules.index');
    Route::get('admin/meeting-scheduler/create', [SchedulerController::class, 'create'])->name('admin.schedules.create');
    Route::post('admin/meeting-scheduler/store', [SchedulerController::class, 'store'])->name('admin.schedules.store');
});
