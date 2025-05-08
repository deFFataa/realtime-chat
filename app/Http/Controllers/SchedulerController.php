<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use App\Models\Scheduler;
use Illuminate\Http\Request;
use App\Models\MeetingAttendance;
use App\Notifications\SendEmailAttendance;
use App\Http\Requests\StoreSchedulerRequest;
use Illuminate\Support\Facades\Notification;
use App\Http\Requests\UpdateSchedulerRequest;

class SchedulerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $attendance = MeetingAttendance::with('user')->get()->groupBy('meeting_id');

        // dd($attendance);

        return Inertia::render('admin/scheduler/index', [
            'meeting_schedule' => Scheduler::latest()->get(),
            'attendance' => ['item' => $attendance],
            'users_count' => User::where('role', 'user')->count()
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('admin/scheduler/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'min:1'],
            'description' => ['required', 'string', 'min:1'],
            'date_of_meeting' => ['required', 'date'],
            'start_time' => ['required'],
            'end_time' => ['required'],
            'platform' => ['required'],
            'meeting_link' => ['required', 'url'],
        ]);

        // dd($validated);

        try {
            // Create the meeting
            $meeting = Scheduler::create($validated);

            // Get users with 'user' role
            $users = User::where('role', 'user')->get();

            // Send the attendance notification to all users
            Notification::send($users, new SendEmailAttendance($meeting));


        } catch (\Throwable $th) {
            return back()->with('error', $th->getMessage());
        }

        return redirect()->back()->with('success', 'Meeting created and notifications sent.');
    }


    /**
     * Display the specified resource.
     */
    public function show(Scheduler $scheduler)
    {
        return Inertia::render('admin/scheduler/show', [
            'scheduler' => $scheduler
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Scheduler $scheduler)
    {
        return Inertia::render('admin/scheduler/edit', [
            'scheduler' => $scheduler
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Scheduler $scheduler)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'min:1'],
            'description' => ['required', 'string', 'min:1'],
            'date_of_meeting' => ['required', 'date'],
            'start_time' => ['required'],
            'end_time' => ['required'],
        ]);

        // dd($validated);

        try {
            $scheduler->update($validated);
        } catch (\Throwable $th) {
            return back()->with('error', $th->getMessage());
        }

        return redirect()->back();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Scheduler $scheduler)
    {
        try {
            $scheduler->delete();
        } catch (\Throwable $th) {
            return back()->with('error', $th->getMessage());
        }

        return redirect()->back();
    }

    public function showConfirmation(Scheduler $scheduler, User $user)
    {
        return Inertia::render('admin/scheduler/showConfirmation', [
            'scheduler' => $scheduler,
            'user' => $user
        ]);
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

}
