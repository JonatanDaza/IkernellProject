<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    // ... (index, show, edit, destroy methods remain largely the same)

    /**
     * Store a newly created user in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'lastname' => ['nullable', 'string', 'max:255'],
            'role' => ['nullable', Rule::in(['interested', 'admin', 'coordinator', 'leader', 'developer'])], // Validation for enum
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'fecha_registro' => ['nullable', 'date'],
            'tipo_usuario' => ['nullable', 'string', 'max:255'], // Consider removing if 'role' replaces this
        ]);

        User::create([
            'name' => $request->name,
            'lastname' => $request->lastname,
            'role' => $request->role ?? 'interested', // Use null coalescing to default if not provided
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'fecha_registro' => $request->fecha_registro,
            'tipo_usuario' => $request->tipo_usuario,
        ]);

        return redirect()->route('users.index')->with('success', 'User created successfully.');
    }

    /**
     * Update the specified user in storage.
     */
    public function update(Request $request, User $user)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'lastname' => ['nullable', 'string', 'max:255'],
            'role' => ['nullable', Rule::in(['interested', 'admin', 'coordinator', 'leader', 'developer'])], // Validation for enum
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'password' => ['nullable', 'string', 'min:8', 'confirmed'],
            'fecha_registro' => ['nullable', 'date'],
            'tipo_usuario' => ['nullable', 'string', 'max:255'], // Consider removing if 'role' replaces this
        ]);

        $user->update([
            'name' => $request->name,
            'lastname' => $request->lastname,
            'role' => $request->role ?? 'interested', // Use null coalescing to default if not provided
            'email' => $request->email,
            'password' => $request->password ? Hash::make($request->password) : $user->password,
            'fecha_registro' => $request->fecha_registro,
            'tipo_usuario' => $request->tipo_usuario,
        ]);

        return redirect()->route('users.index')->with('success', 'User updated successfully.');
    }

    // ...
}