<?php

namespace App\Http\Controllers;

use App\Events\GlobalChat;
use App\Events\GotMessage;
use App\Models\Chat;
use App\Models\GroupMember;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Http\Requests\StoreChatRequest;
use App\Http\Requests\UpdateChatRequest;

class ChatController extends Controller
{
    public function all(Request $request)
    {
        // broadcast(new GlobalChat());

        if($request->wantsJson()){
            return response()->json(['messages' => Chat::with('user')->where('intended', 'all')->latest()->paginate(10)]);
        }

        return Inertia::render("chat/all", [
            "messages" => Chat::with('user')->where('intended', 'all')->latest()->paginate(10),
            'users' => User::all()->except(auth()->id()),
            'groups' => GroupMember::with(['user', 'conversation'])->where('user_id', auth()->id())->get()
        ]);
    }

    public function storeGlobal(Request $request){
        $cred = $request->validate([
            'message' => ['required', 'max:100'],
            'intended' => 'required',
        ]);

        $cred['user_id'] = auth()->id();

        $chat = Chat::create($cred);

        broadcast(new GlobalChat($chat));
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render("chat/index", [
            'users' => User::all()->except(auth()->id()),
            'groups' => GroupMember::with(['user', 'conversation'])->where('user_id', auth()->id())->get()
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
            'message' => ['required', 'max:100'],
            'to' => 'required',
        ]);
    
        $cred['user_id'] = auth()->id();
    
        $chat = Chat::create($cred);
    
        broadcast(new GotMessage($chat));
    }
    

    /**
     * Display the specified resource.
     */
    public function show(Chat $chat, $id, Request $request)
    {

        if($request->wantsJson()){
            return response()->json([
                'messages' => Chat::where(function ($query) use ($id) {
                    $query->where('user_id', auth()->id())
                        ->where('to', $id);
                })
                ->orWhere(function ($query) use ($id) {
                    $query->where('user_id', auth()->id())
                        ->where('to', $id);
                })
                ->with('user')
                ->latest()
                ->paginate(10)
            ]);
        }

        return Inertia::render("chat/show", [
            "user" => User::find($id),
            'users' => User::all()->except(auth()->id()),
            'groups' => GroupMember::with(['user', 'conversation'])->where('user_id', auth()->id())->get(),
            "messages" => Chat::where(function ($query) use ($id) {
                $query->where('user_id', auth()->id())
                    ->where('to', $id);
            })
                ->orWhere(function ($query) use ($id) {
                    $query->where('user_id', $id)
                        ->where('to', auth()->id());
                })
                ->with('user')
                ->latest()
                ->paginate(10),

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
