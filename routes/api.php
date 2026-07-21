<?php

use App\Http\Controllers\Api\AppointmentController;
use App\Http\Controllers\Api\ServiceController;
use Illuminate\Support\Facades\Route;

Route::get('services', [ServiceController::class, 'index']);
Route::get('services/{service}/availability', [AppointmentController::class, 'availability']);

Route::middleware('auth:sanctum')->group(function (): void {
    Route::post('appointments', [AppointmentController::class, 'store']);
});
