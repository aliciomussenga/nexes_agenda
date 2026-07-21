<?php

namespace App\Policies;

use App\Models\Service;
use App\Models\User;

class ServicePolicy
{
    public function before(User $user, string $ability): ?bool
    {
        return $user->isAdmin() ? true : null;
    }

    public function viewAny(User $user): bool
    {
        return $user->isAdmin();
    }

    public function view(User $user, Service $service): bool
    {
        return $user->id === $service->owner_id;
    }

    public function create(User $user): bool
    {
        return $user->isAdmin();
    }

    public function update(User $user, Service $service): bool
    {
        return $user->id === $service->owner_id;
    }

    public function delete(User $user, Service $service): bool
    {
        return $user->id === $service->owner_id;
    }
}
