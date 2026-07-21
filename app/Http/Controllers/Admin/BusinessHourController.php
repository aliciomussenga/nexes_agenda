<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\StoreBusinessHourRequest;
use App\Http\Requests\Api\UpdateBusinessHourRequest;
use App\Models\BusinessHour;
use Illuminate\Http\RedirectResponse;

class BusinessHourController extends Controller
{
    public function store(StoreBusinessHourRequest $request): RedirectResponse
    {
        BusinessHour::query()->create([
            ...$request->validated(),
            'owner_id' => $request->user()->id,
        ]);

        return back();
    }

    public function update(UpdateBusinessHourRequest $request, BusinessHour $businessHour): RedirectResponse
    {
        $this->authorize('update', $businessHour);
        $businessHour->fill($request->validated())->save();

        return back();
    }

    public function destroy(BusinessHour $businessHour): RedirectResponse
    {
        $this->authorize('delete', $businessHour);
        $businessHour->delete();

        return back();
    }
}
