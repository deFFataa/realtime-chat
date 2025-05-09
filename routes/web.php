<?php

use App\Events\Rating;
use App\Http\Controllers\PdfMergeController;
use App\Models\Post;
use App\Models\User;
use Inertia\Inertia;
use App\Models\Agenda;
use App\Models\Feedback;
use App\Models\Scheduler;
use App\Events\TotalPosts;
use App\Events\TotalUsers;
use App\Models\MinutesOfMeeting;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\FeedbackController;
use App\Http\Controllers\SchedulerController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {

        if (Auth::user()->role !== 'user') {
            abort(403);
        }

        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('admin/dashboard', function () {

        if (Auth::user()->role === 'user') {
            abort(403);
        }

        $test = Scheduler::where('date_of_meeting', '>', now())
            ->orderBy('date_of_meeting', 'asc')
            ->first(['date_of_meeting', 'start_time', 'end_time']);

        // dd(Post::count());

        return Inertia::render('admin/dashboard/index', [
            'new_users' => User::whereBetween('created_at', [now()->subWeek(), now()])->where('role', 'user')->latest()->get(),
            'users_count' => User::where('role', 'user')->count(),
            'post_count' => Post::count(),
            'active_users' => User::where('role', 'user')
                ->where('is_loggedin', true)
                ->count(),
            'all_users' => User::where('role', 'user')->get(['name', 'created_at']),
            'schedule' => Scheduler::all(),
            'upcoming_meeting' => $test,
            'agenda' => Agenda::count(),
            'minutesOfMeeting' => MinutesOfMeeting::count(),

            
            'feedbacks' => Feedback::with('user')->whereDate('created_at', today())->latest()->get(),
            'rating_today' => Feedback::whereDate('created_at', today())->average('rating'),
            'overall_rating' => Feedback::average('rating'),
        ]);
    })->name('admin.dashboard');
});

Route::get('attendance/{scheduler}/confirm/{user}', [SchedulerController::class, 'confirmViaSignedUrl'])
    ->name('admin.schedules.confirm.signed')
    ->middleware('signed');

Route::post('feedback/{user_id}', [FeedbackController::class, 'store'])
    ->name('feedback.store');

Route::get('/pdf-merge', [PdfMergeController::class, 'index'])->name('pdf.merge');
Route::post('/merge', [PdfMergeController::class, 'merge'])->name('pdf.merge');


require __DIR__ . '/settings.php';
require __DIR__ . '/post.php';
require __DIR__ . '/auth.php';
require __DIR__ . '/conversation.php';
require __DIR__ . '/chat.php';
require __DIR__ . '/admin_users.php';
require __DIR__ . '/scheduler.php';
require __DIR__ . '/agenda.php';
require __DIR__ . '/minutes_of_meeting.php';
require __DIR__ . '/feedback.php';
require __DIR__ . '/comments.php';




Route::get('/broadcast', function () {
    broadcast(new Rating(User::find(1)));
});
