<?php

namespace App\Http\Controllers;

use App\Events\DisplayCreatedGroupChat;
use App\Models\Chat;
use App\Models\Conversation;
use App\Http\Requests\StoreConversationRequest;
use App\Http\Requests\UpdateConversationRequest;
use App\Models\GroupMember;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ConversationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
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
        $cred = $request->validate([
            'conversation_name' => ['required', 'string'],
        ]);
    
        $cred['user_id'] = Auth::id();
    
        $conversation = Conversation::create($cred);
    
        GroupMember::create([
            'user_id' => $cred['user_id'],
            'conversation_id' => $conversation->id,
        ]);
    
        broadcast(new DisplayCreatedGroupChat($conversation, auth()->id()));
    
    }

    public function send_message(Request $request){
        $cred = $request->validate([
            'message' => ['required', 'string'],
            'conversation_id' => ['required']
        ]);

        $cred['user_id'] = auth()->user()->id;

        dd($cred);
    }
    

    /**
     * Display the specified resource.
     */
    public function show($id, Request $request)
    {

        // dd(Conversation::findOrFail($id));


        if($request->wantsJson()){
            return response()->json([
                'messages' => Chat::where('conversation_id', $id)->paginate(10)
            ]);
        }

        return Inertia::render("conversation/show", [
            "user" => Conversation::find($id),
            'users' => User::all()->except(auth()->id()),
            'groups' => GroupMember::with(['user', 'conversation'])->where('user_id', auth()->id())->get(),
            'conversation_name' => Conversation::find($id)->conversation_name,
            "messages" => Chat::where('conversation_id', $id)->paginate(10)
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Conversation $conversation)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateConversationRequest $request, Conversation $conversation)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Conversation $conversation)
    {
        //
    }
}   
