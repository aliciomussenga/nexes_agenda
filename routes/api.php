<?php

use App\Http\Controllers\Api\AppointmentController;
use App\Http\Controllers\Api\BusinessHourController;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\ServiceManagementController;
use Illuminate\Support\Facades\Route;

Route::get('services', [ServiceController::class, 'index']);
Route::get('services/{service}/availability', [AppointmentController::class, 'availability']);

Route::middleware('auth:sanctum')->group(function (): void {
    Route::apiResource('admin/services', ServiceManagementController::class)->parameters([
        'services' => 'service',
    ]);
    Route::apiResource('admin/business-hours', BusinessHourController::class)->parameters([
        'business-hours' => 'businessHour',
    ]);
    Route::post('appointments', [AppointmentController::class, 'store']);
});
