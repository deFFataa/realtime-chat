<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class UserAddress extends Model
{
    /** @use HasFactory<\Database\Factories\UserAddressFactory> */
    use HasFactory, Notifiable;
    protected $table = 'address';

    protected $guarded = [];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
