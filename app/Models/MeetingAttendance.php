<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MeetingAttendance extends Model
{
    /** @use HasFactory<\Database\Factories\MeetingAttendanceFactory> */
    use HasFactory;

    protected $guarded = [];

    public function user(){
        $this->hasMany(User::class);
    }

    public function scheduler(){
        $this->belongsTo(Scheduler::class);
    }

}
