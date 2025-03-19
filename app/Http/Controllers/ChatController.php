<?php

namespace App\Http\Controllers;

use App\Events\GotMessage;
use App\Models\Chat;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Http\Requests\StoreChatRequest;
use App\Http\Requests\UpdateChatRequest;

class ChatController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render("chat/index", [
            'users' => User::all()->except(auth()->id())
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $cred = $request->validate([
            'message' => 'required',
            'to' => 'required',
        ]);

        $cred['user_id'] = auth()->id();
        $cred['from'] = auth()->id();


        $chat = Chat::create($cred);

        // return redirect()->back();

        broadcast(new GotMessage($chat));

        // return redirect()->back()->with([
        //     'chat' => $chat
        // ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Chat $chat, $id)
    {
        return Inertia::render("chat/show", [
            "user" => User::find($id),
            "messages" => Chat::where(function ($query) use ($id) {
                $query->where('from', auth()->id())
                    ->where('to', $id);
            })
                ->orWhere(function ($query) use ($id) {
                    $query->where('from', $id)
                        ->where('to', auth()->id());
                })
                ->get(),

        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Chat $chat)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateChatRequest $request, Chat $chat)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Chat $chat)
    {
        //
    }
}
