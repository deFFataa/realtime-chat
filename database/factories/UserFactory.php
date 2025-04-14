<?php

namespace Database\Factories;

use Carbon\Carbon;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => $this->faker->randomElement(['Mr.', 'Ms.', 'Mrs.', 'Dr.', 'Engr.']),
            'first_name' => $this->faker->firstName,
            'middle_name' => $this->faker->firstName,
            'last_name' => $this->faker->lastName,
            'extension_name' => $this->faker->optional()->randomElement(['Jr.', 'Sr.', 'II', 'III']),
            'name' => function (array $attributes) {
                return trim("{$attributes['first_name']} {$attributes['middle_name']} {$attributes['last_name']}");
            },
            'avatar' => null,
            'date_of_birth' => $this->faker->date(),
            'civil_status' => $this->faker->randomElement(['single', 'married', 'widowed', 'separated', 'divorced']),
            'sex' => $this->faker->randomElement(['male', 'female']),
            'citizenship' => 'Filipino',
            'mobile' => $this->faker->phoneNumber,
            'email' => $this->faker->unique()->safeEmail(),
            'email_verified_at' => $this->faker->boolean(70) ? now() : null,
            'password' => bcrypt('password'),
            'role' => 'user',
            'is_loggedin' => $this->faker->boolean(),
            'position' => 'Member',
            'remember_token' => Str::random(10),
            'created_at' => Carbon::now()->subDays(rand(0, 90)),
            'updated_at' => Carbon::now(),
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn(array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}
