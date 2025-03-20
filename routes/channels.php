<?php

use App\Models\User;
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('room.{roomId}', function (User $user, $roomId) {
    return [
        'id' => $user->id,
        'name' => $user->name,
    ];
});

Broadcast::channel('chat.{user1}.{user2}', function ($user, $user1, $user2) {
    // Ensure the authenticated user is either user1 or user2
    return $user->id == $user1 || $user->id == $user2;
});

Broadcast::channel('global-chat', function(){

});

// Broadcast::chanlle('channel');

Broadcast::channel('app', function(User $user){
    return true;
});

Broadcast::channel('total-users', function () {
    //
});