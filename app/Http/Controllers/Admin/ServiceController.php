<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\StoreServiceRequest;
use App\Http\Requests\Api\UpdateServiceRequest;
use App\Models\Service;
use Illuminate\Http\RedirectResponse;

class ServiceController extends Controller
{
    public function store(StoreServiceRequest $request): RedirectResponse
    {
        Service::query()->create([
            ...$request->validated(),
            'owner_id' => $request->user()->id,
        ]);

        return back();
    }

    public function update(UpdateServiceRequest $request, Service $service): RedirectResponse
    {
        $this->authorize('update', $service);
        $service->fill($request->validated())->save();

        return back();
    }

    public function destroy(Service $service): RedirectResponse
    {
        $this->authorize('delete', $service);
        $service->delete();

        return back();
    }
}
