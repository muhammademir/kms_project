<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
class AuthController extends Controller
{
    public function create()
{
    return Inertia::render('Auth/Login');
}

public function store(Request $request)
{
    $request->validate(['username' => 'required', 'password' => 'required']);

    if (Auth::attempt($request->only('username', 'password'))) {
        $request->session()->regenerate();
        return redirect()->route('dashboard');
    }

    return back()->withErrors(['username' => 'Username atau password salah.']);
}

public function destroy()
{
    Auth::logout();
    return redirect()->route('login');
}
}
