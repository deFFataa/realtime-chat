<?php

use App\Http\Controllers\MinutesOfMeetingController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->group(function () {
    Route::get('admin/minutes-of-the-meeting', [MinutesOfMeetingController::class, 'index'])->name('admin.mom.index');
    Route::get('admin/minutes-of-the-meeting/create', [MinutesOfMeetingController::class, 'create'])->name('admin.mom.create');
    Route::post('admin/minutes-of-the-meeting', [MinutesOfMeetingController::class, 'store'])->name('admin.mom.store');
    Route::get('admin/minutes-of-the-meeting/{minutesOfMeeting}/edit', [MinutesOfMeetingController::class, 'edit'])->name('admin.mom.edit');
    Route::put('admin/minutes-of-the-meeting/{minutesOfMeeting}', [MinutesOfMeetingController::class, 'update'])->name('admin.mom.update');
    Route::delete('admin/minutes-of-the-meeting/{minutesOfMeeting}', [MinutesOfMeetingController::class, 'destroy'])->name('admin.mom.destroy');
});
