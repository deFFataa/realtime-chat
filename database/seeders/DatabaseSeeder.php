<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(15)->create();
        User::factory(1)->create([
            "name"=> "Isaac Luis Lauan Balabbo",
            "first_name" =>"Isaac Luis",
            "middle_name" =>"Lauan",
            "last_name"=> "Balabbo",
            "email"=> "balabboisaac@gmail.com",
            "password"=> bcrypt("Winsyple19"),
            "role" => "admin",
        ]);
    }
}
