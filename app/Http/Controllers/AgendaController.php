<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Agenda;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
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

                $slug = Str::slug($validated['title'], '_');
                $extension = $file->getClientOriginalExtension();
                $baseFileName = $slug;
                $fileName = $baseFileName . '.' . $extension;

                $i = 1;
                while (Storage::disk('public')->exists("agendas/{$fileName}")) {
                    $fileName = $baseFileName . "($i)." . $extension;
                    $i++;
                }

                $file->storeAs('agendas', $fileName, 'public');
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
        return Inertia::render('admin/agenda/edit', [
            'agenda' => $agenda,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Agenda $agenda)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'min:1'],
            'user_id' => ['required'],
            'agenda_file_loc' => ['nullable', 'file', 'mimes:pdf,docx', 'max:5120'],
        ]);

        try {
            if ($request->hasFile('agenda_file_loc') && $request->file('agenda_file_loc')->isValid()) {
                $file = $request->file('agenda_file_loc');

                $slug = Str::slug($validated['title'], '_');
                $extension = $file->getClientOriginalExtension();
                $fileName = $slug . '.' . $extension;

                // Always delete old file if it exists
                if ($agenda->agenda_file_loc && Storage::disk('public')->exists("agendas/{$agenda->agenda_file_loc}")) {
                    Storage::disk('public')->delete("agendas/{$agenda->agenda_file_loc}");
                }

                // If the new filename exists and it's NOT the same as the old file, delete it too
                if (
                    $fileName !== $agenda->agenda_file_loc &&
                    Storage::disk('public')->exists("agendas/{$fileName}")
                ) {
                    Storage::disk('public')->delete("agendas/{$fileName}");
                }

                // Store the new file with the desired name
                $file->storeAs('agendas', $fileName, 'public');
                $validated['agenda_file_loc'] = $fileName;
            } else {
                // No new file uploaded — just rename existing one if needed
                if ($agenda->agenda_file_loc && Storage::disk('public')->exists("agendas/{$agenda->agenda_file_loc}")) {
                    $extension = pathinfo($agenda->agenda_file_loc, PATHINFO_EXTENSION);
                    $newFileName = Str::slug($validated['title'], '_') . '.' . $extension;

                    $i = 1;
                    $baseFileName = Str::slug($validated['title'], '_');
                    while (
                        $newFileName !== $agenda->agenda_file_loc &&
                        Storage::disk('public')->exists("agendas/{$newFileName}")
                    ) {
                        $newFileName = $baseFileName . "($i)." . $extension;
                        $i++;
                    }

                    // Rename the file
                    Storage::disk('public')->move(
                        "agendas/{$agenda->agenda_file_loc}",
                        "agendas/{$newFileName}"
                    );

                    $validated['agenda_file_loc'] = $newFileName;
                } else {
                    // Keep current file name if no file exists or can't rename
                    $validated['agenda_file_loc'] = $agenda->agenda_file_loc;
                }
            }


            $agenda->update($validated);

        } catch (\Throwable $th) {
            return redirect()->back()->with('error', 'Agenda update failed. Please try again.');
        }

        return redirect()->back()->with('success', 'Agenda successfully updated.');
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Agenda $agenda)
    {
        try {
            if ($agenda->agenda_file_loc && Storage::disk('public')->exists("agendas/{$agenda->agenda_file_loc}")) {
                Storage::disk('public')->delete("agendas/{$agenda->agenda_file_loc}");
            }

            $agenda->delete();

        } catch (\Throwable $th) {
            return redirect()->back()->with('error', 'Agenda deletion failed. Please try again.');
        }
        return redirect()->back()->with('success', 'Agenda successfully deleted.');
    }
}
