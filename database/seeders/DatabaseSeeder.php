<?php

namespace Database\Seeders;

use App\Models\MeetingAttendance;
use App\Models\Post;
use App\Models\Scheduler;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\UserAddress;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory(1)->create([
            "name" => "Isaac Luis Lauan Balabbo",
            "first_name" => "Isaac Luis",
            "middle_name" => "Lauan",
            "last_name" => "Balabbo",
            "email" => "isaac@gmail.com",
            "password" => bcrypt("Winsyple19"),
            "role" => "super-admin",
        ]);
        User::factory(1)->create([
            "name" => "Ishigami Senkku",
            "first_name" => "Ishigami",
            "middle_name" => "Inri",
            "last_name" => "Senku",
            "email" => "senku@gmail.com",
            "password" => bcrypt("Winsyple19"),
            "role" => "admin",
        ])->each(function ($user) {
            UserAddress::factory()->create(['user_id' => $user->id]);
        });
        User::factory(5)->create()->each(function ($user) {
            UserAddress::factory()->create(['user_id' => $user->id]);
            Post::factory(5)->create(['user_id' => $user->id]);
        });

        Scheduler::factory(5)->create();
        $schedulers = Scheduler::all();
        $users = User::all();
        
        foreach ($schedulers as $scheduler) {
            // Pick 3–5 random users per meeting
            $schedulerUsers = $users->random(rand(3, 5));
            foreach ($schedulerUsers as $user) {
                MeetingAttendance::factory()->create([
                    'meeting_id' => $scheduler->id,
                    'user_id' => $user->id,
                ]);
            }
        }

        // Post::factory(30)->create();
    }
}
