<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;

class UpdateBusinessHourRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() ?? false;
    }

    public function rules(): array
    {
        return [
            'day_of_week' => ['sometimes', 'integer', 'min:1', 'max:7'],
            'opens_at' => ['sometimes', 'date_format:H:i'],
            'closes_at' => ['sometimes', 'date_format:H:i'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }
}
