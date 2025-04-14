<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BoardResolution extends Model
{
    /** @use HasFactory<\Database\Factories\BoardResolutionFactory> */
    use HasFactory;

    protected $guarded = [];

    public function minutes_of_meeting(){
        return $this->belongsTo(MinutesOfMeeting::class);
    }
}
