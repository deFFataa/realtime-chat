<?php

namespace App\Http\Controllers;

use App\Events\NewPost;
use App\Events\TotalPosts;
use App\Models\Comment;
use App\Models\Post;
use App\Models\PostLike;
use App\Models\Scheduler;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\UpdatePostRequest;
use Str;

class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // if (Auth::user()->role == 'admin') {
        //     abort(403);
        // }

        $user = Auth::user();

        $posts = Post::with(['user', 'comments.children', 'post_likes'])
            ->where('user_id', $user->id)
            ->latest()
            ->get();

        foreach ($posts as $post) {
            $topLevelComments = $post->comments->whereNull('parent_id');
            $flattened = $this->flattenComments($topLevelComments);
            $post->comments_count = $flattened->count();
        }

        $totalPosts = $posts->count();
        $totalLikes = PostLike::whereIn('post_id', $posts->pluck('id'))->count();

        return Inertia::render("post/index", [
            'posts' => Post::with(['user', 'comments.children', 'post_likes'])->latest()->get(),
            'total_posts' => $totalPosts,
            'total_likes' => $totalLikes,
            'upcoming_meetings' => Scheduler::where('date_of_meeting', '>', now())
                ->take(3)
                ->orderBy('date_of_meeting', 'asc')
                ->get(),
        ]);
    }
    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        if (Auth::user()->role == 'admin') {
            abort(403);
        }
        return Inertia::render("post/create");
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => ['required'],
            'title' => ['nullable', 'min:1', 'string'],
            'body' => ['required', 'min:1']
        ]);

        try {
            $post = Post::create($validated);

            broadcast(new TotalPosts());
            broadcast(new NewPost($post));

        } catch (\Throwable $th) {
            echo 'Error:' . $th;
            exit;
        }

        return redirect('/home');

    }

    public function store_files(Request $request)
    {
        // dd($request->all());

        $validated = $request->validate([
            'user_id' => ['required'],
            'title' => ['required', 'min:1', 'string'],
            'body' => ['required', 'min:1'],
            'media_location' => ['required', 'mimes:jpeg,jpg,png,pdf,doc,docx'],

        ]);

        $imageExt = ['jpeg', 'jpg', 'png'];
        $fileExt = ['pdf', 'doc', 'docx'];

        if ($request->file('media_location')->isValid()) {
            $file = $request->file('media_location');

            $slug = Str::slug($validated['title'], '_');
            $extension = $file->getClientOriginalExtension();
            $baseFileName = $slug;
            $fileName = $baseFileName . '_' . time() . '.' . $extension;

            if (in_array($extension, $fileExt)) {
                $file->move(public_path('file_media'), $fileName);
            } else if (in_array($extension, $imageExt)) {
                $file->move(public_path('image_media'), $fileName);
            } else {
                return abort(404);
            }

            $validated['media_location'] = $fileName;
        }

        try {
            Post::create($validated);

        } catch (\Throwable $th) {
            echo 'Error:' . $th;
            return;
        }
        broadcast(new TotalPosts());

        return redirect('/home');

    }

    /**
     * Display the specified resource.
     */
    public function show(Post $post)
    {
        $post->load(['user', 'post_likes']);

        $topLevelComments = Comment::with(['user', 'children'])
            ->withCount('comment_likes')
            ->where('post_id', $post->id)
            ->whereNull('parent_id')
            ->get();

        $allComments = $this->flattenComments($topLevelComments);
        $commentsCount = $allComments->count();



        // dd($topLevelComments->toArray());

        return Inertia::render("post/show", [
            'post' => $post,
            'comments' => $topLevelComments,
            'comments_count' => $commentsCount,
            'upcoming_meetings' => Scheduler::where('date_of_meeting', '>', now())
                ->take(3)
                ->orderBy('date_of_meeting', 'asc')
                ->get(),
        ]);
    }

    public function flattenComments($comments)
    {
        $flattened = collect();

        foreach ($comments as $comment) {
            $flattened->push($comment);

            if ($comment->children && $comment->children->isNotEmpty()) {
                $flattened = $flattened->merge($this->flattenComments($comment->children));
            }
        }

        return $flattened;
    }


    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Post $post)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePostRequest $request, Post $post)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Post $post)
    {
        if ($post->media_location) {
            $filePath = public_path('file_media/' . $post->media_location);
            $imagePath = public_path('image_media/' . $post->media_location);

            if (file_exists($filePath)) {
                unlink($filePath);
            } elseif (file_exists($imagePath)) {
                unlink($imagePath);
            }
        }

        $post->delete();

        broadcast(new TotalPosts());

        return redirect('/home');
    }

    public function comment(Request $request, Post $post)
    {
        $validated = $request->validate([
            'user_id' => ['required'],
            'post_id' => ['required'],
            'comment' => ['required', 'min:1']
        ]);

        // dd($validated);

        try {
            Comment::create($validated);
        } catch (\Throwable $th) {
            echo 'Error:' . $th;
            return;
        }

        return redirect()->back();
    }

    public function like(Request $request, Post $post)
    {
        $validated = $request->validate([
            'user_id' => ['required'],
            'post_id' => ['required'],
        ]);

        if (PostLike::where('user_id', $validated['user_id'])->where('post_id', $validated['post_id'])->exists()) {
            PostLike::where('user_id', $validated['user_id'])->where('post_id', $validated['post_id'])->delete();
            return redirect()->back();
        }

        try {
            PostLike::create($validated);
        } catch (\Throwable $th) {
            echo 'Error:' . $th;
            return;
        }

        return redirect()->back();
    }
}
