<?php

namespace App\Providers;

use App\Models\Appointment;
use App\Models\BusinessHour;
use App\Models\Service;
use App\Policies\AppointmentPolicy;
use App\Policies\BusinessHourPolicy;
use App\Policies\ServicePolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    protected $policies = [
        Service::class => ServicePolicy::class,
        Appointment::class => AppointmentPolicy::class,
        BusinessHour::class => BusinessHourPolicy::class,
    ];
}
