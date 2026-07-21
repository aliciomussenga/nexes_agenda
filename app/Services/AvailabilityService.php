<?php

namespace App\Services;

use App\Models\Appointment;
use App\Models\BusinessHour;
use App\Models\Service;
use Carbon\CarbonImmutable;
use Illuminate\Support\Collection;

class AvailabilityService
{
    /**
     * @return array<int, array{start_time:string,end_time:string,available:bool}>
     */
    public function slotsFor(Service $service, CarbonImmutable $date, int $slotMinutes = 30): array
    {
        $businessHour = BusinessHour::query()
            ->where('owner_id', $service->owner_id)
            ->where('day_of_week', $date->dayOfWeekIso)
            ->where('is_active', true)
            ->first();

        if (! $businessHour) {
            return [];
        }

        $start = $date->setTimeFromTimeString((string) $businessHour->opens_at);
        $end = $date->setTimeFromTimeString((string) $businessHour->closes_at);

        $appointments = Appointment::query()
            ->where('owner_id', $service->owner_id)
            ->whereIn('status', [Appointment::STATUS_PENDING, Appointment::STATUS_CONFIRMED])
            ->whereBetween('start_time', [$start, $end])
            ->orderBy('start_time')
            ->get(['start_time', 'end_time']);

        $slots = [];
        for ($cursor = $start; $cursor->addMinutes($service->duration_minutes) <= $end; $cursor = $cursor->addMinutes($slotMinutes)) {
            $slotEnd = $cursor->addMinutes($service->duration_minutes);
            $slots[] = [
                'start_time' => $cursor->toIso8601String(),
                'end_time' => $slotEnd->toIso8601String(),
                'available' => ! $this->overlaps($cursor, $slotEnd, $appointments),
            ];
        }

        return $slots;
    }

    /**
     * @param Collection<int, Appointment> $appointments
     */
    private function overlaps(CarbonImmutable $start, CarbonImmutable $end, Collection $appointments): bool
    {
        foreach ($appointments as $appointment) {
            if ($start < CarbonImmutable::parse($appointment->end_time) && $end > CarbonImmutable::parse($appointment->start_time)) {
                return true;
            }
        }

        return false;
    }
}
