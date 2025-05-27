<?php

namespace App\Http\Controllers;

use App\Models\Trabajador;
use App\Models\User; // To select a user when creating a new worker
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class TrabajadorController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $trabajadores = Trabajador::with('user')->get();
        return view('trabajadores.index', compact('trabajadores'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $users = User::all(); // Get all users to associate a trabajador
        return view('trabajadores.create', compact('users'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'id' => ['required', 'exists:users,id', Rule::unique('trabajadores', 'id')], // Ensure user exists and is not already a worker
            'identificacion' => ['required', 'string', 'max:255', 'unique:trabajadores'],
            'fecha_nacimiento' => ['nullable', 'date'],
            'direccion' => ['nullable', 'string', 'max:255'],
            'profesion' => ['nullable', 'string', 'max:255'],
            'tipo_trabajador' => ['nullable', 'string', 'max:255'],
            'foto_perfil' => ['nullable', 'string', 'max:255'],
        ]);

        Trabajador::create($request->all());

        return redirect()->route('trabajadores.index')->with('success', 'Trabajador created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Trabajador $trabajador)
    {
        return view('trabajadores.show', compact('trabajador'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Trabajador $trabajador)
    {
        $users = User::all();
        return view('trabajadores.edit', compact('trabajador', 'users'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Trabajador $trabajador)
    {
        $request->validate([
            'id' => ['required', 'exists:users,id', Rule::unique('trabajadores', 'id')->ignore($trabajador->id_trabajador, 'id_trabajador')],
            'identificacion' => ['required', 'string', 'max:255', Rule::unique('trabajadores')->ignore($trabajador->id_trabajador, 'id_trabajador')],
            'fecha_nacimiento' => ['nullable', 'date'],
            'direccion' => ['nullable', 'string', 'max:255'],
            'profesion' => ['nullable', 'string', 'max:255'],
            'tipo_trabajador' => ['nullable', 'string', 'max:255'],
            'foto_perfil' => ['nullable', 'string', 'max:255'],
        ]);

        $trabajador->update($request->all());

        return redirect()->route('trabajadores.index')->with('success', 'Trabajador updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Trabajador $trabajador)
    {
        $trabajador->delete();
        return redirect()->route('trabajadores.index')->with('success', 'Trabajador deleted successfully.');
    }
}