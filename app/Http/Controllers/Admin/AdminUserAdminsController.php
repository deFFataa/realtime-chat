<?php

namespace App\Http\Controllers\Admin;

use App\Models\User;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class AdminUserAdminsController extends Controller
{

    public function __construct()
    {
        if (Auth::user()->role !== 'super-admin') {
            abort(403);
        }
    }

    public function index()
    {
        return Inertia::render("admin/users/admins/index", [
            'admin_users' => User::where('role', 'admin')->orderBy('name', 'asc')->get(['id', 'name', 'email', 'is_loggedin'])
        ]);
    }

    public function edit(User $user)
    {
        $user = User::with('address')->findOrFail($user->id);

        return Inertia::render('admin/users/admins/edit', [
            'user' => $user
        ]);
    }

    public function update_personal_information(Request $request, User $user)
    {
        $cred = $request->validate([
            'title' => ['required', 'string', 'min:1', 'max:255'],
            'name' => ['required', 'string', 'min:1', 'max:255'],
            'first_name' => ['required', 'string', 'min:1', 'max:255'],
            'middle_name' => ['required', 'string', 'min:1', 'max:255'],
            'last_name' => ['required', 'string', 'min:1', 'max:255'],
            'extension_name' => ['nullable', 'string', 'min:1', 'max:255'],
            'date_of_birth' => ['required', 'date'],
            'civil_status' => ['required'],
            'sex' => ['required'],
            'citizenship' => ['required', 'string', 'min:1', 'max:255'],
            'mobile' => ['required'],
        ]);
        try {
            $user->update($cred);
        } catch (\Throwable $th) {
            echo $th;
        }

        return redirect()->back();
    }

    public function update_address_information(Request $request, User $user)
    {
        $cred = $request->validate([
            'region' => ['required', 'string', 'min:1', 'max:255'],
            'province' => ['required', 'string', 'min:1', 'max:255'],
            'town_city' => ['required', 'string', 'min:1', 'max:255'],
            'barangay' => ['required', 'string', 'min:1', 'max:255'],
            'state_street_subdivision' => ['nullable', 'string', 'min:1', 'max:255'],
            'zip_code' => ['required', 'string', 'min:1', 'max:255'],
        ]);
        $user->address()->update($cred);

        return redirect()->back();
    }
}
