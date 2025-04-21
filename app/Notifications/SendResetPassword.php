<?php

namespace App\Notifications;


use Illuminate\Support\Carbon;
use App\Channels\PHPMailerChannel;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\PHPMailer;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Config;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Support\Facades\View;
use Illuminate\Mail\Markdown;

View::addNamespace('mail', resource_path('views/vendor/mail'));

class SendResetPassword extends Notification
{
    public $token;

    public function __construct($token)
    {
        $this->token = $token;
    }

    public function via($notifiable)
    {
        return [PHPMailerChannel::class];
    }

    public function toPHPMailer($notifiable)
    {
        $mailMessage = (new MailMessage)
            ->subject('Reset Password Notification')
            ->greeting('Hello!')
            ->line('You are receiving this email because we received a password reset request.')
            ->action('Reset Password', $this->resetPasswordUrl($notifiable))
            ->line('If you did not request a password reset, no further action is required.');

        // View::addNamespace('mail', resource_path('views/vendor/mail'));

        // Render the markdown to HTML
        $html = app(Markdown::class)->render(
            $mailMessage->markdown ?? 'mail::message',
            $mailMessage->data()
        );
        // Send with PHPMailer
        $mail = new PHPMailer(true);
        try {
            $mail->isSMTP();
            $mail->Host = env('MAIL_HOST', 'smtp.example.com');
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


    protected function resetPasswordUrl($notifiable)
    {
        return URL::temporarySignedRoute(
            'password.reset',
            Carbon::now()->addMinutes(Config::get('auth.passwords.' . Config::get('auth.defaults.passwords') . '.expire', 60)),
            ['token' => $this->token, 'email' => $notifiable->email]
        );
    }

}
