<?php

namespace App\Notifications;

use Carbon\Carbon;
use App\Models\User;
use App\Models\Scheduler;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Markdown;
use App\Models\MeetingAttendance;
use App\Channels\PHPMailerChannel;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\PHPMailer;
use Illuminate\Support\Facades\URL;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

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

        $url = URL::temporarySignedRoute(
            'admin.schedules.confirm.signed',
            now()->addMinutes(60), // URL expires in 60 minutes
            [
                'scheduler' => $this->scheduler->id,
                'user' => $notifiable->id,
            ]
        );

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
            ->action('Confirm Attendance', $url)
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

    public function confirmViaSignedUrl(Scheduler $scheduler, User $user)
    {
        try {
            $alreadyConfirmed = MeetingAttendance::where('meeting_id', $scheduler->id)
                ->where('user_id', $user->id)
                ->exists();
    
            if ($alreadyConfirmed) {
                return 'You have already confirmed your attendance for this meeting.';
            }
    
            MeetingAttendance::create([
                'meeting_id' => $scheduler->id,
                'user_id' => $user->id,
            ]);
            return 'Your attendance has been successfully confirmed. You may now close this window.';
        } catch (\Throwable $th) {
            return 'An error occurred: ' . $th->getMessage();
        }
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
