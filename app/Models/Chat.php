<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Chat extends Model
{
    /** @use HasFactory<\Database\Factories\ChatFactory> */
    use HasFactory;

    protected $fillable = ['user_id', 'message', 'from', 'to', 'created_at', 'updated_at'];

    public function user(){
        return $this->belongsTo(User::class);
    }
}
