<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\Agenda;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Models\MinutesOfMeeting;
use Illuminate\Support\Facades\Storage;
use App\Http\Requests\StoreMinutesOfMeetingRequest;
use App\Http\Requests\UpdateMinutesOfMeetingRequest;

class MinutesOfMeetingController extends Controller
{
    /**
     * Display a listing of the resource.
     */

     public function __construct(){
        if(Auth::user()->role === 'user'){
            abort(403);
        }
    }

    public function index()
    {
        return Inertia::render('admin/minutes_of_meeting/index', [
            'minutes_of_meeting' => MinutesOfMeeting::with('agenda')->latest()->get()->map(function ($mom) {
                return [
                    'id' => $mom->id,
                    'title' => $mom->title,
                    'agenda_id' => $mom->agenda?->id,
                    'agenda_title' => $mom->agenda?->title,
                    'mom_file_loc' => $mom->mom_file_loc,
                ];
            })
        ]);
        
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('admin/minutes_of_meeting/create', [
            'agendas' => Agenda::get(['id', 'title']),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'min:1'],
            'agenda_id' => ['required'],
            'mom_file_loc' => ['required', 'file', 'mimes:pdf,docx', 'max:5120'],
        ]);

        // dd(MinutesOfMeeting::class);

        try {
            if ($request->file('mom_file_loc')->isValid()) {
                $file = $request->file('mom_file_loc');

                $slug = Str::slug($validated['title'], '_');
                $extension = $file->getClientOriginalExtension();
                $baseFileName = $slug;
                $fileName = $baseFileName . '.' . $extension;

                $i = 1;
                while (Storage::disk('public')->exists("minutes_of_the_meeting/{$fileName}")) {
                    $fileName = $baseFileName . "($i)." . $extension;
                    $i++;
                }

                $file->storeAs('minutes_of_the_meeting', $fileName, 'public');
                $validated['mom_file_loc'] = $fileName;
            }

            MinutesOfMeeting::create($validated);

        } catch (\Throwable $th) {
            return redirect()->back()->with('error', 'Agenda creation failed. Please try again.');
        }

        return redirect()->back()->with('success', 'Agenda successfully uploaded.');
    }

    /**
     * Display the specified resource.
     */
    public function show(MinutesOfMeeting $minutesOfMeeting)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(MinutesOfMeeting $minutesOfMeeting)
    {
        return Inertia::render('admin/minutes_of_meeting/edit', [
            'minutes_of_meeting' => $minutesOfMeeting,
            'agendas' => Agenda::get(['id', 'title']),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, MinutesOfMeeting $minutesOfMeeting)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'min:1'],
            'agenda_id' => ['required'],
            'mom_file_loc' => ['nullable', 'file', 'mimes:pdf,docx', 'max:5120'],
        ]);

        try {
            if ($request->hasFile('mom_file_loc') && $request->file('mom_file_loc')->isValid()) {
                $file = $request->file('mom_file_loc');

                $slug = Str::slug($validated['title'], '_');
                $extension = $file->getClientOriginalExtension();
                $fileName = $slug . '.' . $extension;

                if ($minutesOfMeeting->mom_file_loc && Storage::disk('public')->exists("minutes_of_the_meeting/{$minutesOfMeeting->mom_file_loc}")) {
                    Storage::disk('public')->delete("minutes_of_the_meeting/{$minutesOfMeeting->mom_file_loc}");
                }

                if (
                    $fileName !== $minutesOfMeeting->mom_file_loc &&
                    Storage::disk('public')->exists("minutes_of_the_meeting/{$fileName}")
                ) {
                    Storage::disk('public')->delete("minutes_of_the_meeting/{$fileName}");
                }

                // Store the new file with the desired name
                $file->storeAs('minutes_of_the_meeting', $fileName, 'public');
                $validated['mom_file_loc'] = $fileName;
            } else {
                // No new file uploaded — just rename existing one if needed
                if ($minutesOfMeeting->mom_file_loc && Storage::disk('public')->exists("minutes_of_the_meeting/{$minutesOfMeeting->mom_file_loc}")) {
                    $extension = pathinfo($minutesOfMeeting->mom_file_loc, PATHINFO_EXTENSION);
                    $newFileName = Str::slug($validated['title'], '_') . '.' . $extension;

                    $i = 1;
                    $baseFileName = Str::slug($validated['title'], '_');
                    while (
                        $newFileName !== $minutesOfMeeting->mom_file_loc &&
                        Storage::disk('public')->exists("minutes_of_the_meeting/{$newFileName}")
                    ) {
                        $newFileName = $baseFileName . "($i)." . $extension;
                        $i++;
                    }

                    Storage::disk('public')->move(
                        "minutes_of_the_meeting/{$minutesOfMeeting->mom_file_loc}",
                        "minutes_of_the_meeting/{$newFileName}"
                    );

                    $validated['mom_file_loc'] = $newFileName;
                } else {
                    $validated['mom_file_loc'] = $minutesOfMeeting->mom_file_loc;
                }
            }


            $minutesOfMeeting->update($validated);

        } catch (\Throwable $th) {
            return redirect()->back();
        }

        return redirect()->back();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(MinutesOfMeeting $minutesOfMeeting)
    {
        try {
            if ($minutesOfMeeting->mom_file_loc && Storage::disk('public')->exists("minutes_of_the_meeting/{$minutesOfMeeting->mom_file_loc}")) {
                Storage::disk('public')->delete("minutes_of_the_meeting/{$minutesOfMeeting->mom_file_loc}");
            }

            $minutesOfMeeting->delete();

        } catch (\Throwable $th) {
            return redirect()->back();
        }
        return redirect()->back();
    }
}
