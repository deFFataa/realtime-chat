<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Http\Requests\StoreCommentRequest;
use App\Http\Requests\UpdateCommentRequest;
use App\Models\CommentLike;
use Illuminate\Http\Request;

class CommentController extends Controller
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
    public function store(StoreCommentRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Comment $comment)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Comment $comment)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCommentRequest $request, Comment $comment)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Comment $comment)
    {
        try {
            $comment->delete();
        } catch (\Exception $e) {
            echo $e->getMessage();
            return;
        }

        return redirect()->back();
    }

    public function reply(Request $request, Comment $comment)
    {
        $request->validate([
            'user_id' => ['required'],
            'post_id' => ['required'],
            'comment' => ['required', 'min:1']
        ]);

        try {
            $comment->create([
                'user_id' => $request->user_id,
                'parent_id' => $request->post_id,
                'comment' => $request->comment
            ]);
        } catch (\Throwable $th) {
            echo 'Error:' . $th;
            return;
        }

        return redirect()->back();

    }

    public function like(Request $request, Comment $comment)
    {
        $validated = $request->validate([
            'user_id' => ['required'],
            'comment_id' => ['required'],
        ]);

        // dd($validated);

        if (CommentLike::where('user_id', $validated['user_id'])->where('comment_id', $validated['comment_id'])->exists()) {
            CommentLike::where('user_id', $validated['user_id'])->where('comment_id', $validated['comment_id'])->delete();
            return redirect()->back();
        }

        try {
            CommentLike::create($validated);
        } catch (\Throwable $th) {
            echo 'Error:' . $th;
            exit;
            // return;
        }

        return redirect()->back();
    }
}
