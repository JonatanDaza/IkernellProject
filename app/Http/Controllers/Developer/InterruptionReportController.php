<?php

namespace App\Http\Controllers\Developer;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\RedirectResponse;

class InterruptionReportController extends Controller
{
    public function create()
    {
        return Inertia::render('Developer/InterruptionReports/Create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validatedData = $request->validate([
            'interruption_type' => 'required|string|in:problema_tecnico,reunion,solicitud_externa,personal,otro',
            'date' => 'required|date',
            'estimated_duration' => 'required|string|max:50', // Ej: "30 minutos", "2 horas"
            'affected_project_phase' => 'required|string|in:planificacion,desarrollo,pruebas,despliegue,otro',
            'interruption_type_other' => 'nullable|string|max:255|required_if:interruption_type,otro',
            'affected_project_phase_other' => 'nullable|string|max:255|required_if:affected_project_phase,otro',
            'description' => 'nullable|string|max:2000',
        ]);

        // Aquí iría la lógica para guardar el registro de interrupción.
        // Ejemplo:
        // InterruptionReport::create([
        //     'user_id' => Auth::id(),
        //     'interruption_type' => $validatedData['interruption_type'] === 'otro' ? $validatedData['interruption_type_other'] : $validatedData['interruption_type'],
        //     // ... y los demás campos
        // ]);

        // Por ahora, solo redirigimos con un mensaje de éxito.
        return redirect()->route('developer.interruption-reports.create')->with('success', 'Registro de interrupción enviado exitosamente.');
    }
}