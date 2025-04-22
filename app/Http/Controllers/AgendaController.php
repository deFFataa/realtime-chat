<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Agenda;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Requests\StoreAgendaRequest;
use App\Http\Requests\UpdateAgendaRequest;

class AgendaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('admin/agenda/index', [
            'agendas' => Agenda::latest()->get(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('admin/agenda/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'min:1'],
            'user_id' => ['required'],
            'agenda_file_loc' => ['required', 'file', 'mimes:pdf,docx', 'max:5120'],
        ]);

        try {
            if ($request->file('agenda_file_loc')->isValid()) {
                $file = $request->file('agenda_file_loc');

                // Create a filename from the title
                $slug = Str::slug($validated['title'], '_');
                $extension = $file->getClientOriginalExtension();
                $fileName = $slug . '.' . $extension;

                // Store it using the custom name
                $file->storeAs('agendas', $fileName, 'public');

                // Save only the file name to the DB
                $validated['agenda_file_loc'] = $fileName;
            }

            Agenda::create($validated);

        } catch (\Throwable $th) {
            return redirect()->back()->with('error', 'Agenda creation failed. Please try again.');
        }

        return redirect()->back()->with('success', 'Agenda successfully uploaded.');
    }
    //

    /**
     * Display the specified resource.
     */
    public function show(Agenda $agenda)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Agenda $agenda)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateAgendaRequest $request, Agenda $agenda)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Agenda $agenda)
    {
        //
    }
}
