<?php

namespace App\Channels;

use Illuminate\Notifications\Notification;

class PHPMailerChannel
{
    public function send($notifiable, Notification $notification)
    {
        if (method_exists($notification, 'toPHPMailer')) {
            $notification->toPHPMailer($notifiable);
        }
    }
}
