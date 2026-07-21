<?php

namespace App\Policies;

use App\Models\BusinessHour;
use App\Models\User;

class BusinessHourPolicy
{
    public function before(User $user, string $ability): ?bool
    {
        return $user->isAdmin() ? true : null;
    }

    public function viewAny(User $user): bool
    {
        return $user->isAdmin();
    }

    public function create(User $user): bool
    {
        return $user->isAdmin();
    }

    public function update(User $user, BusinessHour $businessHour): bool
    {
        return $user->id === $businessHour->owner_id;
    }

    public function delete(User $user, BusinessHour $businessHour): bool
    {
        return $user->id === $businessHour->owner_id;
    }
}
