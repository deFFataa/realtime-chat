<?php

namespace App\Notifications;

use Illuminate\Auth\Notifications\VerifyEmail as BaseVerifyEmail;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Config;
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

class CustomVerifyEmail extends BaseVerifyEmail
{
    public function sendEmailVerification($notifiable)
    {
        $verificationUrl = $this->verificationUrl($notifiable);

        $mail = new PHPMailer(true);

        try {
            //Server settings
            $mail->isSMTP();
            $mail->Host       = env('MAIL_HOST', 'smtp.example.com');
            $mail->SMTPAuth   = true;
            $mail->Username   = env('MAIL_USERNAME');
            $mail->Password   = env('MAIL_PASSWORD');
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
            $mail->Port       = env('MAIL_PORT', 465);

            //Recipients
            $mail->setFrom(env('MAIL_FROM_ADDRESS'), env('MAIL_FROM_NAME'));
            $mail->addAddress($notifiable->email);

            //Content
            $mail->isHTML(true);
            $mail->Subject = 'Verify Email Address';
            $mail->Body    = 'Click to verify your email: <a href="' . $verificationUrl . '">Verify Email</a>';

            $mail->send();
        } catch (Exception $e) {
            logger()->error("PHPMailer Error: {$mail->ErrorInfo}");
        }
    }

    protected function verificationUrl($notifiable)
    {
        return URL::temporarySignedRoute(
            'verification.verify',
            Carbon::now()->addMinutes(Config::get('auth.verification.expire', 60)),
            ['id' => $notifiable->getKey(), 'hash' => sha1($notifiable->getEmailForVerification())]
        );
    }
}
