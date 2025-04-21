<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Notifications\SendEmailAttendance;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Scheduler extends Model
{
    /** @use HasFactory<\Database\Factories\SchedulerFactory> */
    use HasFactory;

    protected $guarded = [];

    public function meeting_attendance(){
        $this->hasMany(MeetingAttendance::class);
    }

}
