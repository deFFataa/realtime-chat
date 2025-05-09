<?php

namespace App\Events;

use App\Models\Post;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class NewPost implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     */
    public function __construct(public Post $post)
    {
        //
    }

    public function broadcastWith()
    {
        $this->post->load(['user', 'comments.children', 'post_likes']);

        $topLevelComments = $this->post->comments->whereNull('parent_id');
        $flattened = app()->call([new \App\Http\Controllers\PostController, 'flattenComments'], [
            'comments' => $topLevelComments,
        ]);

        return [
            'id' => $this->post->id,
            'title' => $this->post->title,
            'body' => $this->post->body,
            'media_location' => $this->post->media_location,
            'created_at' => $this->post->created_at,
            'user' => [
                'id' => $this->post->user->id,
                'name' => $this->post->user->name,
            ],
            'comments' => $this->post->comments,
            'comments_count' => $flattened->count(),
            'post_likes' => $this->post->post_likes,
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
            new Channel('new-post'),
        ];
    }
}
