<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\StoreBusinessHourRequest;
use App\Http\Requests\Api\UpdateBusinessHourRequest;
use App\Http\Resources\BusinessHourResource;
use App\Models\BusinessHour;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class BusinessHourController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        $this->authorize('viewAny', BusinessHour::class);

        return BusinessHourResource::collection(BusinessHour::query()->latest()->get());
    }

    public function store(StoreBusinessHourRequest $request): BusinessHourResource
    {
        $hour = BusinessHour::query()->create([
            ...$request->validated(),
            'owner_id' => $request->user()->id,
        ]);

        return new BusinessHourResource($hour);
    }

    public function update(UpdateBusinessHourRequest $request, BusinessHour $businessHour): BusinessHourResource
    {
        $this->authorize('update', $businessHour);

        $businessHour->fill($request->validated())->save();

        return new BusinessHourResource($businessHour->refresh());
    }

    public function destroy(BusinessHour $businessHour): void
    {
        $this->authorize('delete', $businessHour);
        $businessHour->delete();
    }
}
