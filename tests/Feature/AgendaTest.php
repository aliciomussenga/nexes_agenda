<?php

namespace Tests\Feature;

use App\Models\Appointment;
use App\Models\BusinessHour;
use App\Models\Service;
use App\Models\User;
use App\Services\AppointmentService;
use App\Services\AvailabilityService;
use Carbon\CarbonImmutable;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AgendaTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_create_service_and_client_cannot(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $client = User::factory()->create(['role' => 'client']);

        $this->actingAs($admin)->postJson('/api/admin/services', [
            'name' => 'Corte de cabelo',
            'duration_minutes' => 30,
            'price_cents' => 2500,
        ])->assertCreated();

        $this->actingAs($client)->postJson('/api/admin/services', [
            'name' => 'Barba',
            'duration_minutes' => 20,
            'price_cents' => 1500,
        ])->assertForbidden();
    }

    public function test_availability_service_returns_free_slots(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $service = Service::query()->create([
            'owner_id' => $admin->id,
            'name' => 'Consulta',
            'duration_minutes' => 30,
            'price_cents' => 5000,
            'is_active' => true,
        ]);

        BusinessHour::query()->create([
            'owner_id' => $admin->id,
            'day_of_week' => 2,
            'opens_at' => '08:00',
            'closes_at' => '09:00',
            'is_active' => true,
        ]);

        Appointment::query()->create([
            'user_id' => User::factory()->create()->id,
            'service_id' => $service->id,
            'owner_id' => $admin->id,
            'start_time' => CarbonImmutable::parse('2026-07-21 08:30:00'),
            'end_time' => CarbonImmutable::parse('2026-07-21 09:00:00'),
            'status' => Appointment::STATUS_CONFIRMED,
        ]);

        $slots = app(AvailabilityService::class)->slotsFor(
            $service,
            CarbonImmutable::parse('2026-07-21'),
            30,
        );

        $this->assertCount(2, $slots);
        $this->assertTrue($slots[0]['available']);
        $this->assertFalse($slots[1]['available']);
    }

    public function test_appointment_service_rejects_overlapping_booking(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $client = User::factory()->create(['role' => 'client']);

        $service = Service::query()->create([
            'owner_id' => $admin->id,
            'name' => 'Consulta',
            'duration_minutes' => 30,
            'price_cents' => 5000,
            'is_active' => true,
        ]);

        Appointment::query()->create([
            'user_id' => $client->id,
            'service_id' => $service->id,
            'owner_id' => $admin->id,
            'start_time' => CarbonImmutable::parse('2026-07-21 14:00:00'),
            'end_time' => CarbonImmutable::parse('2026-07-21 14:30:00'),
            'status' => Appointment::STATUS_CONFIRMED,
        ]);

        $this->expectException(\RuntimeException::class);
        $this->expectExceptionMessage('Horário indisponível.');

        app(AppointmentService::class)->create(
            $client->id,
            $service->id,
            CarbonImmutable::parse('2026-07-21 14:15:00'),
        );
    }
}
