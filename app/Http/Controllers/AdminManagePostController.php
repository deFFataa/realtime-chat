<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Str;

class AdminManagePostController extends Controller
{
    public function __construct()
    {
        if (Auth::user()->role === 'user') {
            abort(403);
        }
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('admin/post/index', [
            'posts' => Post::latest()->with('user:id,name')->get()->map(function ($post) {
                return [
                    'id' => $post->id,
                    'title' => $post->title,
                    'body' => $post->body,
                    'user_id' => $post->user_id,
                    'user_name' => $post->user->name,
                    'media_location' => $post->media_location,
                    'created_at' => $post->created_at
                ];
            }),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('admin/post/create');
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
            Post::create($validated);

        } catch (\Throwable $th) {
            echo 'Error:' . $th;
            return;
        }

        return to_route('admin.discussion-board.index');

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

        return to_route('admin.discussion-board.index');

    }

    /**
     * Display the specified resource.
     */
    public function show(Post $post)
    {
        //
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
    public function update(Request $request, Post $post)
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

        return redirect()->back();
    }
}
