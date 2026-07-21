<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['owner_id', 'day_of_week', 'opens_at', 'closes_at', 'is_active'])]
class BusinessHour extends Model
{
    protected function casts(): array
    {
        return [
            'opens_at' => 'string',
            'closes_at' => 'string',
            'is_active' => 'boolean',
        ];
    }

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }
}
