<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\BusinessHourController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\ServiceController;
use App\Http\Controllers\Client\ServiceCatalogController;
use App\Http\Controllers\Client\ReservationController;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');
    Route::get('servicos', ServiceCatalogController::class)->name('services.catalog');
    Route::get('reservas', [ReservationController::class, 'index'])->name('reservations.index');
    Route::post('reservas', [ReservationController::class, 'store'])->name('reservations.store');
    Route::post('admin/services', [ServiceController::class, 'store'])->name('admin.services.store');
    Route::put('admin/services/{service}', [ServiceController::class, 'update'])->name('admin.services.update');
    Route::delete('admin/services/{service}', [ServiceController::class, 'destroy'])->name('admin.services.destroy');
    Route::post('admin/business-hours', [BusinessHourController::class, 'store'])->name('admin.business-hours.store');
    Route::put('admin/business-hours/{businessHour}', [BusinessHourController::class, 'update'])->name('admin.business-hours.update');
    Route::delete('admin/business-hours/{businessHour}', [BusinessHourController::class, 'destroy'])->name('admin.business-hours.destroy');
});

require __DIR__.'/settings.php';
