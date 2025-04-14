<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Scheduler;
use Illuminate\Http\Request;
use App\Http\Requests\StoreSchedulerRequest;
use App\Http\Requests\UpdateSchedulerRequest;

class SchedulerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('admin/scheduler/index', [
            'meeting_schedule' => Scheduler::latest()->get()
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
        ]);

        try {
            Scheduler::create($validated);
        } catch (\Throwable $th) {
            return back()->with('error', $th->getMessage());
        }

        return redirect()->back();

    }

    /**
     * Display the specified resource.
     */
    public function show(Scheduler $scheduler)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Scheduler $scheduler)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSchedulerRequest $request, Scheduler $scheduler)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Scheduler $scheduler)
    {
        //
    }
}
