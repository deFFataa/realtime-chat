<?php

use App\Models\User;
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('room.{roomId}', function (User $user, $roomId) {
    return [
        'id' => $user->id,
        'name' => $user->name,
    ];
});

Broadcast::channel('channel_for_everyone', function () {
    //
});

// Broadcast::chanlle('channel');

Broadcast::channel('app', function(User $user){
    return true;
});

Broadcast::channel('total-users', function () {
    //
});