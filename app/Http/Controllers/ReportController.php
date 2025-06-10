<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\InterruptionReport;
use App\Models\ReporteProyecto; // O tu modelo de Actividades
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response; // Para la descarga de CSV/TXT
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf as PDF; // Esta línea es correcta si el paquete está configurado

class ReportController extends Controller
{
    /**
     * Muestra el formulario para seleccionar un proyecto y generar el reporte de interrupciones.
     */
    public function interruptionReportForm()
    {
        $projects = Project::orderBy('name')->get(['id', 'name']);
        return Inertia::render('Reports/InterruptionReportForm', [
            'projects' => $projects,
        ]);
    }

    /**
     * Genera y muestra el reporte de interrupciones para un proyecto específico.
     */
    public function generateInterruptionReport(Request $request)
    {
        $request->validate(['project_id' => 'required|exists:projects,id']);
        $projectId = $request->project_id;

        // Carga el proyecto y sus interrupciones con el usuario que reportó
        $project = Project::with(['interruptionReports.user'])->findOrFail($projectId);

        $interruptions = $project->interruptionReports;

        $pdf = PDF::loadView('reports.pdf.interruptions', [
            'project' => $project,
            'interruptions' => $interruptions,
        ]);

        $fileName = "reporte_interrupciones_{$project->name}_{$projectId}.pdf";
        return $pdf->download($fileName);
    }

    /**
     * Muestra el formulario para seleccionar un proyecto y generar el reporte de actividades.
     */
    public function activityReportForm()
    {
        $projects = Project::orderBy('name')->get(['id', 'name']);
        return Inertia::render('Reports/ActivityReportForm', [
            'projects' => $projects,
        ]);
    }

    /**
     * Genera y muestra el reporte de actividades para un proyecto específico.
     */
    public function generateActivityReport(Request $request)
    {
        $request->validate(['project_id' => 'required|exists:projects,id']);
        $projectId = $request->project_id;

        // Carga el proyecto y sus actividades con el usuario asignado
        $project = Project::with(['reporteProyectos.user'])->findOrFail($projectId);

        $activities = $project->reporteProyectos;

        $pdf = PDF::loadView('reports.pdf.activities', [
            'project' => $project,
            'activities' => $activities,
        ]);
        $fileName = 'reporte_actividades_' . $project->name . '_' . $projectId . '.pdf';
        return $pdf->download($fileName);
    }

    /**
     * Muestra el formulario para seleccionar un proyecto y generar el reporte para la empresa brasileña.
     */
    public function brazilianCompanyReportForm()
    {
        $projects = Project::orderBy('name')->get(['id', 'name']);
        return Inertia::render('Reports/BrazilianCompanyReportForm', [
            'projects' => $projects,
        ]);
    }

    /**
     * Genera el reporte en PDF para la empresa brasileña.
     */
    public function generateBrazilianCompanyReport(Request $request)
    {
        $request->validate(['project_id' => 'required|exists:projects,id']);
        $projectId = $request->project_id;
        $project = Project::with(['reporteProyectos.user', 'interruptionReports.user'])->findOrFail($projectId);

        $pdf = PDF::loadView('reports.pdf.brazilian_company', [
            'project' => $project,
        ]);

        $fileName = "reporte_brasil_proyecto_{$project->id}_" . date('YmdHis') . ".pdf";
        return $pdf->download($fileName);
    }
}
