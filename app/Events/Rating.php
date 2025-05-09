<?php

namespace App\Events;

use App\Models\Feedback;
use App\Models\User;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class Rating implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     */
    public function __construct(public Feedback $feedback, public $rating_today, public $overall_rating)
    {
        //
    }

    public function broadcastWith() {
        return [
            'feedbacks' => [
                'id' => $this->feedback->id,
                'user' => [
                    'name' => $this->feedback->user->name
                ],
                'rating' => $this->feedback->rating,
                'comment' => $this->feedback->comment,
                'created_at' => $this->feedback->created_at
            ],
            'rating_today' => $this->rating_today,
            'overall_rating' => $this->overall_rating
        ];
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new Channel('rating'),
        ];
    }
}
