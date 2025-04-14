<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Scheduler extends Model
{
    /** @use HasFactory<\Database\Factories\SchedulerFactory> */
    use HasFactory;

    protected $guarded = [];

    public function meeting_attendance(){
        $this->hasMany(MeetingAttendance::class);
    }

}
