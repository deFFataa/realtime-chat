<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Scheduler;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\MeetingAttendance>
 */
class MeetingAttendanceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'meeting_id' => Scheduler::inRandomOrder()->first()?->id ?? Scheduler::factory(),
            'user_id' => User::inRandomOrder()->first()?->id ?? User::factory(),
        ];
    }
}
