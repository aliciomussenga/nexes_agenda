<?php

namespace App\Services;

use App\Models\Appointment;
use App\Models\Service;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class AppointmentService
{
    public function __construct(private readonly AvailabilityService $availabilityService)
    {
    }

    public function create(int $userId, int $serviceId, CarbonImmutable $startTime): Appointment
    {
        return DB::transaction(function () use ($userId, $serviceId, $startTime): Appointment {
            $service = Service::query()->findOrFail($serviceId);
            $endTime = $startTime->addMinutes($service->duration_minutes);

            $conflict = Appointment::query()
                ->where('owner_id', $service->owner_id)
                ->whereIn('status', [Appointment::STATUS_PENDING, Appointment::STATUS_CONFIRMED])
                ->where(function ($query) use ($startTime, $endTime): void {
                    $query->where('start_time', '<', $endTime)
                        ->where('end_time', '>', $startTime);
                })
                ->lockForUpdate()
                ->exists();

            if ($conflict) {
                throw new RuntimeException('Horário indisponível.');
            }

            return Appointment::query()->create([
                'user_id' => $userId,
                'service_id' => $service->id,
                'owner_id' => $service->owner_id,
                'start_time' => $startTime,
                'end_time' => $endTime,
                'status' => Appointment::STATUS_PENDING,
            ]);
        });
    }

    public function availability(Service $service, CarbonImmutable $date, int $slotMinutes = 30): array
    {
        return $this->availabilityService->slotsFor($service, $date, $slotMinutes);
    }
}
