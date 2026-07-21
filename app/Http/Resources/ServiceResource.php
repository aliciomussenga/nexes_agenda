<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ServiceResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'owner_id' => $this->owner_id,
            'name' => $this->name,
            'duration_minutes' => $this->duration_minutes,
            'price_cents' => $this->price_cents,
            'is_active' => $this->is_active,
            'created_at' => $this->created_at,
        ];
    }
}
