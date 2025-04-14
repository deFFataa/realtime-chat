<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MinutesOfMeeting extends Model
{
    /** @use HasFactory<\Database\Factories\MinutesOfMeetingFactory> */
    use HasFactory;

    protected $guarded = [];

    public function agenda()
    {
        return $this->belongsTo(Agenda::class);
    }

    public function board_resolution(){
        return $this->hasOne(BoardResolution::class);
    }
}
