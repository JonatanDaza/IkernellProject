<?php

namespace App\Http\Controllers\Developer;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\ReporteProyecto;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\RedirectResponse;

class ErrorReportController extends Controller
{
    public function create()
    {
        $projects = Project::orderBy('name')->get(['id', 'name']);
        return Inertia::render('Developer/ErrorReports/Create', [
            'projects' => $projects,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validatedData = $request->validate([
            'project_id' => 'required|exists:projects,id',
            'error_type' => 'required|string|in:funcional,rendimiento,seguridad,otro',
            'description' => 'required|string|max:5000',
            'project_phase' => 'required|string|in:desarrollo,pruebas,produccion,otro',
            'severity' => 'required|string|in:critica,alta,media,baja',
            'error_type_other' => 'nullable|string|max:255|required_if:error_type,otro',
            'project_phase_other' => 'nullable|string|max:255|required_if:project_phase,otro',
        ]);

        // Aquí iría la lógica para guardar el reporte de error en la base de datos.
        // Ejemplo:
        ReporteProyecto::create([
            'user_id' => Auth::id(),
            'project_id' => $validatedData['project_id'],
            'error_type' => $validatedData['error_type'] === 'otro' ? $validatedData['error_type_other'] : $validatedData['error_type'],
            'description' => $validatedData['description'],
            'project_phase' => $validatedData['project_phase'] === 'otro' ? $validatedData['project_phase_other'] : $validatedData['project_phase'],
            'severity' => $validatedData['severity'],
        ]);

        // Por ahora, solo redirigimos con un mensaje de éxito.
        return redirect()->route('developer.error-reports.create')->with('success', 'Reporte de error enviado exitosamente.');
    }
}