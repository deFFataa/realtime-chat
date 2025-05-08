<?php

namespace Database\Factories;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Scheduler>
 */
class SchedulerFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $date = $this->faker->dateTimeBetween('now', '+30 days'); 
        $day = Carbon::instance($date)->startOfDay();
        
        $start = $day->copy()->addHours(rand(6, 15))->addMinutes(rand(0, 59));
        $end = $start->copy()->addHours(rand(1, 4))->addMinutes(rand(0, 59));
        
        return [
            'title' => $this->faker->word(),
            'description' => $this->faker->optional()->paragraph(),
            'date_of_meeting' => $day->toDateString(),
            'start_time' => $start->toTimeString(),
            'end_time' => $end->toTimeString(),
            'platform' => $this->faker->randomElement(['zoom', 'google meet', 'microsoft teams']),
            'meeting_link' => $this->faker->url(),
        ];
        
    }
}
