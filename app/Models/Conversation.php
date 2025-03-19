<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Conversation extends Model
{
    /** @use HasFactory<\Database\Factories\ConversationFactory> */
    use HasFactory;

    protected $guarded = [];

    public function chat(){
        return $this->hasMany(Chat::class);
    }

    public function groupmember(){
        return $this->hasMany(GroupMember::class);
    }
}
