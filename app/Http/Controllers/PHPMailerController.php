<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;


class PHPMailerController extends Controller
{
    public function store(Request $request)
    {
        $mail = new PHPMailer(true);

        try {
            $mail->SMTPDebug = 0;
            $mail->isSMTP();
            $mail->Host = env('MAIL_HOST');
            $mail->SMTPAuth = true;
            $mail->Username = env('MAIL_USERNAME');
            $mail->Password = env('MAIL_PASSWORD');
            $mail->SMTPSecure = env('MAIL_ENCRYPTION');
            $mail->Port = env('MAIL_PORT');

            $mail->setFrom(env('MAIL_USERNAME'), env('MAIL_FROM_NAME'));

            $mail->addAddress($request->email);

            $mail->isHTML(true);
            $mail->Subject = $request->subject;
            $mail->Body = $request->message;

            if(! $mail->send()){
                return back()->with('error', 'Email could not be sent. Mailer Error: '. $mail->ErrorInfo);
            } else {
                return back()->with('success', 'Email has been sent');
            }
        } catch (Exception $e){
            return back()->with('error', 'Email could not be sent. Mailer Error: '. $mail->ErrorInfo);
        }
    }
}
