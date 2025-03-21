<?php

namespace App\Events;

use App\Models\Chat;
use App\Models\User;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class GotMessage implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     */
    public function __construct(public Chat $chat)
    {
        //
    }

    public function broadcastWith()
    {
        return [
            "id" => $this->chat->id,
            "message" => $this->chat->message,
            "name" => $this->chat->user->name,
            'user_id' => $this->chat->user_id,
            'user_created' => $this->chat->user->created_at,
            'created_at' => $this->chat->created_at,
            'updated_at' => $this->chat->updated_at
        ];
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): PrivateChannel
    {
        $user1 = $this->chat->user_id;
        $user2 = $this->chat->to;

        $channelName = $user1 < $user2 ? "chat.{$user1}.{$user2}" : "chat.{$user2}.{$user1}";

        return new PrivateChannel($channelName);
    }
}
