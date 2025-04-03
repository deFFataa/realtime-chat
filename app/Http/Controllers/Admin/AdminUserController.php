<?php

namespace App\Http\Controllers\Admin;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminUserController extends Controller
{
    public function index(){
        return Inertia::render("admin/users/users/index", [
            "users" => User::orderBy('name', 'asc')->get(['id', 'name', 'email', 'is_loggedin'])
        ]);
    }

    public function edit(Request $request, User $user){
        return Inertia::render('admin/users/users/edit', [
            'user'=> $user
        ]);
    }

}
