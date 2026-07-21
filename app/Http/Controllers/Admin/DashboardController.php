<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BusinessHour;
use App\Models\Service;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(): Response
    {
        $this->authorize('viewAny', Service::class);

        return Inertia::render('admin/dashboard', [
            'services' => Service::query()->latest()->get(),
            'businessHours' => BusinessHour::query()->latest()->get(),
        ]);
    }
}
