<?php

namespace App\Http\Controllers;

use App\Events\AddedMemberToGroupChat;
use App\Events\DisplayCreatedGroupChat;
use App\Events\GroupChat;
use App\Models\Chat;
use App\Models\Conversation;
use App\Http\Requests\UpdateConversationRequest;
use App\Models\GroupMember;
use App\Models\User;
use DB;
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

    }

    public function send_message(Request $request)
    {
        $cred = $request->validate([
            'message' => ['required', 'string'],
            'conversation_id' => ['required']
        ]);

        $cred['user_id'] = auth()->user()->id;

        // dd($cred);

        $chat = Chat::create($cred);

        broadcast(new GroupChat($chat));
    }


    /**
     * Display the specified resource.
     */
    public function show($id, Request $request)
    {
        $userId = auth()->id();

        $isMember = GroupMember::where('user_id', $userId)
            ->where('conversation_id', $id)
            ->exists();

        if (!$isMember) {
            abort(404);
        }

        if ($request->wantsJson()) {
            return response()->json([
                "messages" => Chat::with('user')->where('conversation_id', $id)->latest()->paginate(10)
            ]);
        }

        return Inertia::render("conversation/show", [
            "conversation" => Conversation::find($id),
            'users' => User::whereNotIn('id', GroupMember::where('conversation_id', $id)->pluck('user_id'))->where('id', '!=', $userId)->get(),
            'groups' => GroupMember::with(['user', 'conversation'])->where('user_id', $userId)->get(),
            'group_members' => GroupMember::with('user')->where('conversation_id', $id)->get(),
            'conversation_name' => Conversation::find($id)->conversation_name,
            "messages" => Chat::with('user')->where('conversation_id', $id)->latest()->paginate(10)
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

    public function add_members(Request $request)
    {
        $cred = $request->validate([
            'users' => ['required', 'array'],
            'conversation_id' => ['required', 'exists:conversations,id']
        ]);
    
        // Store new users in the group
        foreach ($cred['users'] as $user) {
            GroupMember::create([
                'user_id' => $user['id'],
                'conversation_id' => $cred['conversation_id'],
            ]);
        }
    
        // Retrieve the conversation instance
        $conversation = Conversation::findOrFail($cred['conversation_id']);
    
        // Get only the newly added members (not the sender)
        $newMemberIds = collect($cred['users'])->pluck('id');
    
        // Broadcast only to the new members
        foreach ($newMemberIds as $memberId) {
            if ($memberId != auth()->id()) { // Ensure the sender doesn't receive it
                broadcast(new AddedMemberToGroupChat($conversation, $memberId));
            }
        }
    
        return redirect()->back();
    }
    
    

    public function leave_group_chat($id, $conversationId)
    {
        DB::delete('DELETE FROM group_members WHERE user_id = ? AND conversation_id = ?', [$id, $conversationId]);

        return redirect('/chat');

    }

    public function remove_member_from_group_chat($id, $conversationId)
    {
        DB::delete('DELETE FROM group_members WHERE user_id = ? AND conversation_id = ?', [$id, $conversationId]);

        return redirect()->back();

    }

}
