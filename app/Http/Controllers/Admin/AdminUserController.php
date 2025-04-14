<?php

namespace App\Http\Controllers\Admin;
use App\Models\User;
use Inertia\Inertia;
use App\Models\UserAddress;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class AdminUserController extends Controller
{

    public function __construct()
    {
        if (Auth::user()->role == 'user') {
            abort(403);
        }
    }

    public function index()
    {
        return Inertia::render("admin/users/users/index", [
            "users" => User::where('role', 'user')
                ->orderBy('name', 'asc')
                ->get(['id', 'name', 'email', 'is_loggedin', 'date_of_birth', 'position'])
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/users/users/create');
    }

    public function store(Request $request)
    {
        $cred = $request->validate([
            #Personal Info
            'title' => ['required', 'string', 'min:1'],
            'first_name' => ['required', 'string', 'min:1'],
            'middle_name' => ['required', 'string', 'min:1'],
            'last_name' => ['required', 'string', 'min:1'],
            'extension_name' => ['nullable', 'string', 'min:1'],
            'civil_status' => ['required', 'string', 'min:1'],
            'date_of_birth' => ['required'],
            'sex' => ['required'],
            'citizenship' => ['required'],
            'mobile' => ['required'],

            #Address
            'email' => ['required', 'email', 'string', 'min:1', 'max:255'],

            #Address
            'country' => ['required', 'string'],
            'region' => ['required'],
            'province' => ['required'],
            'town_city' => ['required'],
            'barangay' => ['required'],
            'state_street_subdivision' => ['nullable'],
            'zip_code' => ['required'],
        ]);

        if (!empty($cred['extension_name'])) {
            $cred['name'] = $cred['title'] . ' ' . $cred['first_name'] . ' ' . $cred['middle_name'] . ' ' . $cred['last_name'] . ' ' . $cred['extension_name'];
        } else {
            $cred['name'] = $cred['title'] . ' ' . $cred['first_name'] . ' ' . $cred['middle_name'] . ' ' . $cred['last_name'];
        }

        try {
            $user = User::create([
                'title' => $cred['title'],
                'first_name' => $cred['first_name'],
                'middle_name'=> $cred['middle_name'],
                'last_name' => $cred['last_name'],
                'extension_name' => $cred['extension_name'],
                'name'=> $cred['name'],
                'civil_status' => $cred['civil_status'],
                'date_of_birth' => $cred['date_of_birth'],
                'sex' => $cred['sex'],
                'citizenship' => $cred['citizenship'],
                'mobile' => $cred['mobile'],
                'email' => $cred['email'],
                'password' => Hash::make('ECollab_2025'),
            ]);

            DB::table('address')->insert([
                'user_id' => $user->id,
                'country' => $cred['country'],
                'region' => $cred['region'],
                'province' => $cred['province'],
                'town_city' => $cred['town_city'],
                'barangay' => $cred['barangay'],
                'state_street_subdivision' => $cred['state_street_subdivision'],
                'zip_code' => $cred['zip_code'],
            ]);

        } catch (\Throwable $th) {
            dd($th->getMessage()); 
        }

        return redirect('admin/users/create');
    }

    public function edit(User $user)
    {
        $user = User::with('address')->findOrFail($user->id);
        return Inertia::render('admin/users/users/edit', [
            'user' => $user
        ]);
    }

    public function destroy(User $user)
    {
        $user->delete();
        return redirect()->back();
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

    public function update_account_information(Request $request, User $user)
    {
        $cred = $request->validate([
            'email' => ['required', 'email', 'string', 'min:1', 'max:255'],
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

    public function reset_password(Request $request, User $user){
        $user->password = Hash::make('ECollab_2025');

        $user->save();

        return redirect()->back();
    }

}
