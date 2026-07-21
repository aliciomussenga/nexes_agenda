<?php

namespace App\Policies;

use App\Models\Appointment;
use App\Models\User;

class AppointmentPolicy
{
    public function before(User $user, string $ability): ?bool
    {
        return $user->isAdmin() ? true : null;
    }

    public function view(User $user, Appointment $appointment): bool
    {
        return $user->id === $appointment->user_id || $user->id === $appointment->owner_id;
    }

    public function cancel(User $user, Appointment $appointment): bool
    {
        return $user->id === $appointment->user_id || $user->id === $appointment->owner_id;
    }
}
