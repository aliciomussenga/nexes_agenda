<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\StoreAppointmentRequest;
use App\Models\Appointment;
use App\Models\Service;
use App\Services\AppointmentService;
use Carbon\CarbonImmutable;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReservationController extends Controller
{
    public function index(Request $request): Response
    {
        $date = CarbonImmutable::parse($request->string('date')->toString() ?: now()->toDateString());
        $services = Service::query()
            ->where('is_active', true)
            ->latest()
            ->get();

        $selectedService = $services->firstWhere('id', (int) $request->integer('service_id'))
            ?? $services->first();

        return Inertia::render('client/reservations', [
            'services' => $services,
            'selectedServiceId' => $selectedService?->id,
            'date' => $date->toDateString(),
            'slots' => $selectedService
                ? app(AppointmentService::class)->availability($selectedService, $date, 30)
                : [],
            'myAppointments' => Appointment::query()
                ->with('service')
                ->where('user_id', $request->user()->id)
                ->latest()
                ->limit(10)
                ->get(),
        ]);
    }

    public function store(StoreAppointmentRequest $request, AppointmentService $appointments): RedirectResponse
    {
        $appointments->create(
            $request->user()->id,
            (int) $request->validated('service_id'),
            CarbonImmutable::parse($request->validated('start_time')),
        );

        return to_route('reservations.index')->with('success', 'Reserva criada com sucesso.');
    }
}
