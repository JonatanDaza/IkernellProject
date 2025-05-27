<?php

namespace App\Http\Controllers;

use App\Models\Desarrollador;
use App\Models\Trabajador; // Import the Trabajador model to select associated workers
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class DesarrolladorController extends Controller
{
    /**
     * Display a listing of the developer.
     */
    public function index()
    {
        // Eager load the 'trabajador' relationship to avoid N+1 query problem
        $desarrolladores = Desarrollador::with('trabajador')->get();
        return view('Developer.Develop', compact('desarrolladores'));
    }

    /**
     * Show the form for creating a new developer.
     */
    public function create()
    {
        // Get all trabajadores who are not already assigned as a Desarrollador, Coordinador, or Lider
        // This prevents a single Trabajador from holding multiple specialized roles
        $trabajadores = Trabajador::whereDoesntHave('desarrollador')
                                ->whereDoesntHave('coordinadorProyecto')
                                ->whereDoesntHave('liderProyecto')
                                ->get();

        return view('Developer.Create', compact('trabajadores'));
    }

    /**
     * Store a newly created developer in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'id_trabajador' => [
                'required',
                'exists:trabajadores,id_trabajador',
                Rule::unique('desarrolladores', 'id_trabajador'), // Ensure a trabajador is only a developer once
                // Add more rules to prevent a trabajador from being other specialized roles
                Rule::unique('coordinador_proyectos', 'id_trabajador'),
                Rule::unique('lider_proyectos', 'id_trabajador'),
            ],
            'especialidad_desarrollo' => ['nullable', 'string', 'max:255'],
        ]);

        Desarrollador::create($request->all());

        return redirect()->route('Developer.Develop')->with('success', 'Desarrollador created successfully.');
    }

    /**
     * Display the specified developer.
     */
    public function show(Desarrollador $desarrollador)
    {
        // Eager load the 'trabajador' relationship for the show view
        $desarrollador->load('trabajador');
        return view('Developer.Show', compact('desarrollador'));
    }

    /**
     * Show the form for editing the specified developer.
     */
    public function edit(Desarrollador $desarrollador)
    {
        // When editing, the current trabajador for this developer should always be available.
        // Other trabajadores available for assignment should be those not already assigned to another specialized role,
        // excluding the current trabajador associated with this developer.
        $trabajadores = Trabajador::whereDoesntHave('desarrollador')
                                ->whereDoesntHave('coordinadorProyecto')
                                ->whereDoesntHave('liderProyecto')
                                ->orWhere('id_trabajador', $desarrollador->id_trabajador) // Include the current associated trabajador
                                ->get();

        return view('Developer.Edit', compact('desarrollador', 'trabajadores'));
    }

    /**
     * Update the specified developer in storage.
     */
    public function update(Request $request, Desarrollador $desarrollador)
    {
        $request->validate([
            'id_trabajador' => [
                'required',
                'exists:trabajadores,id_trabajador',
                Rule::unique('desarrolladores', 'id_trabajador')->ignore($desarrollador->id_desarrollador, 'id_desarrollador'),
                // Ensure the updated trabajador is not already assigned to other specialized roles,
                // ignoring the current developer's association.
                Rule::unique('coordinador_proyectos', 'id_trabajador')->ignore($desarrollador->id_trabajador, 'id_trabajador'),
                Rule::unique('lider_proyectos', 'id_trabajador')->ignore($desarrollador->id_trabajador, 'id_trabajador'),
            ],
            'especialidad_desarrollo' => ['nullable', 'string', 'max:255'],
        ]);

        $desarrollador->update($request->all());

        return redirect()->route('Developer.Develop')->with('success', 'Desarrollador updated successfully.');
    }

    /**
     * Remove the specified developer from storage.
     */
    public function destroy(Desarrollador $desarrollador)
    {
        $desarrollador->delete();
        return redirect()->route('Developer.Develop')->with('success', 'Desarrollador deleted successfully.');
    }
}