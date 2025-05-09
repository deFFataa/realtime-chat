<?php

namespace App\Http\Controllers;

use App\Events\Rating;
use App\Models\Feedback;
use App\Http\Requests\StoreFeedbackRequest;
use App\Http\Requests\UpdateFeedbackRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class FeedbackController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        if (Auth::user()->role === 'user') {
            abort(403);
        }

        $feedbacks = Feedback::with('user')->latest()->get()->map(function ($feedback) {
            return [
                'id' => $feedback->id,
                'name' => $feedback->user->name,
                'rating' => $feedback->rating,
                'comment' => $feedback->comment,
                'created_at' => $feedback->created_at
            ];
        });
        $rating_today = Feedback::whereDate('created_at', today())->average('rating');
        $overall_rating = Feedback::average('rating');


        return Inertia::render('admin/feedback/index', [
            'feedbacks' => $feedbacks,
            'rating_today' => $rating_today,
            'overall_rating' => $overall_rating,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'rating' => ['required'],
            'comment' => ['nullable'],
            'user_id' => ['required', 'exists:users,id'],
        ]);

        try {
            $newFeedback = Feedback::create($validated);

            $newFeedback->load('user'); // Make sure the user relationship is loaded

            $rating_today = Feedback::whereDate('created_at', today())->average('rating');
            $overall_rating = Feedback::average('rating');

            broadcast(new Rating($newFeedback, $rating_today, $overall_rating));
        } catch (\Throwable $th) {
            echo $th->getMessage();
        }

        return redirect()->back()->with('popup-thankyou', 'Thank you for your feedback!');
    }


    /**
     * Display the specified resource.
     */
    public function show(Feedback $feedback)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Feedback $feedback)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateFeedbackRequest $request, Feedback $feedback)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Feedback $feedback)
    {
        //
    }
}
