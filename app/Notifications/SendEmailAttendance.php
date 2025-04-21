<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Markdown;
use App\Channels\PHPMailerChannel;
use PHPMailer\PHPMailer\PHPMailer;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use PHPMailer\PHPMailer\Exception;
use Carbon\Carbon;

class SendEmailAttendance extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    protected $scheduler;

    public function __construct($scheduler)
    {
        $this->scheduler = $scheduler;
    }


    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via($notifiable)
    {
        return [PHPMailerChannel::class];
    }

    public function toPHPMailer($notifiable)
    {
        $mailMessage = (new MailMessage)
            ->subject('Meeting Notification')
            ->greeting('Hello!')
            ->line('You are invited to a meeting.')
            ->line('What: ' . $this->scheduler->title)
            ->line($this->scheduler->description)
            ->line('When: ' . Carbon::parse($this->scheduler->date_of_meeting)->format('F j, Y') . ' | ' .
                strtolower(Carbon::createFromFormat('H:i', $this->scheduler->start_time)->format('g:i a')) . ' - ' .
                strtolower(Carbon::createFromFormat('H:i', $this->scheduler->end_time)->format('g:i a')))
            ->line('Please click the button below to confirm your attendance.')
            ->action('Confirm Attendance', $this->attendanceUrl($notifiable))
            ->line('If you did not request this, no further action is required.');


        // Render the markdown to HTML
        $html = app(Markdown::class)->render(
            $mailMessage->markdown ?? 'mail::message',
            $mailMessage->data()
        );
        // Send with PHPMailer
        $mail = new PHPMailer(true);
        try {
            $mail->isSMTP();
            $mail->Host = env('MAIL_HOST');
            $mail->SMTPAuth = true;
            $mail->Username = env('MAIL_USERNAME');
            $mail->Password = env('MAIL_PASSWORD');
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
            $mail->Port = env('MAIL_PORT', 587);

            $mail->setFrom(env('MAIL_FROM_ADDRESS'), env('MAIL_FROM_NAME'));
            $mail->addAddress($notifiable->email);
            $mail->isHTML(true);
            $mail->Subject = $mailMessage->subject;
            $mail->Body = $html;

            $mail->send();
        } catch (Exception $e) {
            logger()->error("PHPMailer Error: {$mail->ErrorInfo}");
        }

        return null;
    }

    protected function attendanceUrl($notifiable)
    {
        return url('/attendance/' . $this->scheduler->id . '/confirm/' . $notifiable->id);
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
