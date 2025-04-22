<?php

use App\Http\Controllers\AgendaController;
use App\Http\Controllers\SchedulerController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->group(function () {
    Route::get('admin/agenda', [AgendaController::class, 'index'])->name('admin.agenda.index');
    Route::get('admin/agenda/create', [AgendaController::class, 'create'])->name('admin.agenda.create');
    Route::post('admin/agenda', [AgendaController::class, 'store'])->name('admin.agenda.store');
});
