<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BusinessHour;
use App\Models\Service;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $this->authorize('viewAny', Service::class);

        $search = trim((string) $request->string('search'));
        $status = $request->string('status')->toString() ?: 'all';
        $day = $request->integer('day_of_week');

        $servicesQuery = Service::query()->latest();
        if ($search !== '') {
            $servicesQuery->where('name', 'ilike', '%'.$search.'%');
        }
        if ($status === 'active') {
            $servicesQuery->where('is_active', true);
        } elseif ($status === 'inactive') {
            $servicesQuery->where('is_active', false);
        }

        $businessHoursQuery = BusinessHour::query()->latest();
        if ($day) {
            $businessHoursQuery->where('day_of_week', $day);
        }
        if ($status === 'active') {
            $businessHoursQuery->where('is_active', true);
        } elseif ($status === 'inactive') {
            $businessHoursQuery->where('is_active', false);
        }

        return Inertia::render('admin/dashboard', [
            'stats' => [
                'services' => Service::query()->count(),
                'businessHours' => BusinessHour::query()->count(),
            ],
            'filters' => [
                'search' => $search,
                'status' => $status,
                'day_of_week' => $day ?: '',
            ],
            'services' => $servicesQuery->get(),
            'businessHours' => $businessHoursQuery->get(),
        ]);
    }
}
