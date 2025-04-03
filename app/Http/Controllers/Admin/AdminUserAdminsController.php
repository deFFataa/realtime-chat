<?php

namespace App\Http\Controllers\Admin;

use App\Models\User;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class AdminUserAdminsController extends Controller
{
    public function index()
    {
        return Inertia::render("admin/users/admins/index", [
            'admin_users' => User::where('role', 'admin')->orderBy('name', 'asc')->get(['id', 'name', 'email', 'is_loggedin'])
        ]);
    }
}
