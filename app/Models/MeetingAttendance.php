<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MeetingAttendance extends Model
{
    /** @use HasFactory<\Database\Factories\MeetingAttendanceFactory> */
    use HasFactory;

    protected $guarded = [];

    public function user()
    {
        return $this->belongsTo(User::class);
    }


    public function scheduler()
    {
        return $this->belongsTo(Scheduler::class);
    }

}
