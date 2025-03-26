<?php

namespace App\Events;

use App\Models\Conversation;
use Illuminate\Broadcasting\Channel;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;

class AddedMemberToGroupChat implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(public Conversation $conversation, public int $userId) {}

    public function broadcastWith()
    {
        return [
            "user_id" => $this->userId,
            "conversation_id" => $this->conversation->id,
            "conversation" => [
                "id" => $this->conversation->id,
                "conversation_name" => $this->conversation->conversation_name
            ],
            "conversation_name" => $this->conversation->conversation_name,
        ];
    }

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('added-member-to-group-chat-' . $this->userId),
        ];
    }
}
