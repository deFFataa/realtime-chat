<?php

use App\Models\Chat;
use App\Models\Conversation;
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

Broadcast::channel('display-created-group-chat-{id}', function (User $user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('added-member-to-group-chat-{id}', function (User $user, $id) {
    return (int) $user->id === (int) $id;
});


Broadcast::channel('app', function(User $user){
    return true;
});

Broadcast::channel('total-users', function (User $user) {
    return true;
});

Broadcast::channel('total-posts', function (User $user) {
    return true;
});

Broadcast::channel('active-users', function (User $user) {
    return true;
});

Broadcast::channel('new-user', function (User $user) {
    return true;
});


Broadcast::channel('group-chat.{id}', function (User $user) {
    return true;
});