<?php

namespace App\Jobs;

use App\Events\GotMessage;
use App\Models\Chat;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class SendMessage implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(public Chat $chat)
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        GotMessage::dispatch([
            'id' => $this->chat->id,
            'user_id' => $this->chat->user_id,
            'message' => $this->chat->message,
            'time' => $this->chat->created_at,
        ]);
    }
}
