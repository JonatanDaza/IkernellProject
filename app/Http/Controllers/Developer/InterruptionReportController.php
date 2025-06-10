<?php

namespace App\Http\Controllers\Developer;

use App\Http\Controllers\Controller;
use App\Models\InterruptionReport;
use App\Models\Project;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\RedirectResponse;

class InterruptionReportController extends Controller
{
    public function create()
    {
        $projects = Project::orderBy('name')->get(['id', 'name']);
        return Inertia::render('Developer/InterruptionReports/Create', [
            'projects' => $projects,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validatedData = $request->validate([
            'project_id' => 'required|exists:projects,id',
            'interruption_type' => 'required|string|in:problema_tecnico,reunion,solicitud_externa,personal,otro',
            'date' => 'required|date',
            'estimated_duration' => 'required|string|max:50',
            'affected_project_phase' => 'required|string|in:planificacion,desarrollo,pruebas,despliegue,otro',
            'interruption_type_other' => 'nullable|string|max:255|required_if:interruption_type,otro',
            'affected_project_phase_other' => 'nullable|string|max:255|required_if:affected_project_phase,otro',
            'description' => 'nullable|string|max:2000',
        ]);

        InterruptionReport::create([
            'project_id' => $validatedData['project_id'],
            'user_id' => Auth::id(),
            'interruption_type' => $validatedData['interruption_type'] === 'otro'
                ? $validatedData['interruption_type_other']
                : $validatedData['interruption_type'],
            'date' => $validatedData['date'],
            'estimated_duration' => $validatedData['estimated_duration'],
            'affected_project_phase' => $validatedData['affected_project_phase'] === 'otro'
                ? $validatedData['affected_project_phase_other']
                : $validatedData['affected_project_phase'],
            'description' => $validatedData['description'] ?? null,
        ]);

        return redirect()->route('developer.interruption-reports.create')->with('success', 'Registro de interrupción enviado exitosamente.');
    }
}