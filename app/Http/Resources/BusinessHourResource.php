<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BusinessHourResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'owner_id' => $this->owner_id,
            'day_of_week' => $this->day_of_week,
            'opens_at' => $this->opens_at,
            'closes_at' => $this->closes_at,
            'is_active' => $this->is_active,
        ];
    }
}
