<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Service;
use App\Services\AppointmentService;
use Carbon\CarbonImmutable;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ServiceCatalogController extends Controller
{
    public function __invoke(Request $request, AppointmentService $appointments): Response
    {
        $date = CarbonImmutable::parse($request->string('date')->toString() ?: now()->toDateString());
        $services = Service::query()
            ->where('is_active', true)
            ->latest()
            ->get();

        $selectedService = $services->firstWhere('id', (int) $request->integer('service_id'))
            ?? $services->first();

        return Inertia::render('client/services', [
            'services' => $services,
            'selectedServiceId' => $selectedService?->id,
            'date' => $date->toDateString(),
            'slots' => $selectedService ? $appointments->availability($selectedService, $date, 30) : [],
        ]);
    }
}
