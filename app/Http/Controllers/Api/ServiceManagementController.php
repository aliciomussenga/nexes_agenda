<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\StoreServiceRequest;
use App\Http\Requests\Api\UpdateServiceRequest;
use App\Http\Resources\ServiceResource;
use App\Models\Service;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ServiceManagementController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        $this->authorize('viewAny', Service::class);

        return ServiceResource::collection(Service::query()->latest()->get());
    }

    public function store(StoreServiceRequest $request): ServiceResource
    {
        $service = Service::query()->create([
            ...$request->validated(),
            'owner_id' => $request->user()->id,
        ]);

        return new ServiceResource($service);
    }

    public function update(UpdateServiceRequest $request, Service $service): ServiceResource
    {
        $this->authorize('update', $service);

        $service->fill($request->validated())->save();

        return new ServiceResource($service->refresh());
    }

    public function destroy(Service $service): void
    {
        $this->authorize('delete', $service);
        $service->delete();
    }
}
