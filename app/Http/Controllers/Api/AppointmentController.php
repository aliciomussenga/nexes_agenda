<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\StoreAppointmentRequest;
use App\Http\Requests\Api\AvailabilityRequest;
use App\Http\Resources\AppointmentResource;
use App\Models\Service;
use App\Services\AppointmentService;
use Carbon\CarbonImmutable;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class AppointmentController extends Controller
{
    public function __construct(private readonly AppointmentService $appointments)
    {
    }

    public function store(StoreAppointmentRequest $request): AppointmentResource|JsonResponse
    {
        try {
            $appointment = $this->appointments->create(
                $request->user()->id,
                (int) $request->validated('service_id'),
                CarbonImmutable::parse($request->validated('start_time')),
            );

            return new AppointmentResource($appointment);
        } catch (\RuntimeException $exception) {
            return response()->json([
                'message' => $exception->getMessage(),
            ], 422);
        }
    }

    public function availability(Service $service, AvailabilityRequest $request): JsonResponse
    {
        $slots = $this->appointments->availability(
            $service,
            CarbonImmutable::parse($request->validated('date')),
            (int) ($request->validated('slot_minutes') ?? 30),
        );

        return response()->json([
            'service_id' => $service->id,
            'date' => $request->validated('date'),
            'slots' => $slots,
        ]);
    }
}
