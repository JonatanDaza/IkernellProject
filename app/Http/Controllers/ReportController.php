<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\InterruptionReport;
use App\Models\ActividadProyecto; // O tu modelo de Actividades
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response; // Para la descarga de CSV/TXT
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf; // Esta línea es correcta si el paquete está configurado

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

        $project = Project::findOrFail($projectId);
        // Asumiendo que tienes project_id en InterruptionReport y la relación 'user'
        $interruptions = InterruptionReport::where('project_id', $projectId) 
            ->with('user') // Para obtener el nombre del desarrollador que reportó
            ->orderBy('date', 'desc')
            ->get();

        $pdf = PDF::loadView('reports.pdf.interruptions', [
            'project' => $project,
            'interruptions' => $interruptions,
        ]);
        // Nota: Asegúrate de que $project->name_slug exista o usa $project->name si es más apropiado.
        return $pdf->download("reporte_interrupciones_{$project->name_slug}_{$projectId}.pdf"); 
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

        $project = Project::findOrFail($projectId);
        $activities = ActividadProyecto::where('project_id', $projectId)
            ->with('user') 
            ->orderBy('status') 
            ->orderBy('created_at')
            ->get();

        $pdf = Pdf::loadView('reports.pdf.activities', [
            'project' => $project,
            'activities' => $activities,
        ]);
        // Nota: Asegúrate de que $project->name_slug exista o usa $project->name si es más apropiado.
        return $pdf->download("reporte_actividades_{$project->name_slug}_{$projectId}.pdf");
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
     * Genera el archivo plano (CSV) para la empresa brasileña.
     */
    public function generateBrazilianCompanyReport(Request $request)
    {
        $request->validate(['project_id' => 'required|exists:projects,id']);
        $projectId = $request->project_id;
        $project = Project::with(['actividadesProyectos.user', 'interruptionReports.user'])->findOrFail($projectId);

        $fileName = "reporte_brasil_proyecto_{$project->id}_" . date('YmdHis') . ".csv";
        $headers = [
            "Content-type"          => "text/csv",
            "Content-Disposition" => "attachment; filename=$fileName",
            "Pragma"              => "no-cache",
            "Cache-Control"       => "must-revalidate, post-check=0, pre-check=0",
            "Expires"             => "0"
        ];

        $columns = [
            'ID Proyecto', 'Nombre Proyecto', 'Estado Proyecto', 'Hitos Clave',
            'ID Actividad', 'Descripción Actividad', 'Estado Actividad', 'Desarrollador Actividad',
            'ID Interrupción', 'Tipo Interrupción', 'Fecha Interrupción', 'Duración Interrupción', 'Fase Afectada Interrupción', 'Reportó Interrupción'
        ];

        $callback = function() use ($project, $columns) {
            $file = fopen('php://output', 'w');
            fputcsv($file, $columns);

            $projectDataRow = [$project->id, $project->name, $project->status, implode('; ', $project->milestones ?? [])];

            if ($project->actividadesProyectos->isEmpty() && $project->interruptionReports->isEmpty()) {
                fputcsv($file, array_pad($projectDataRow, count($columns), 'N/A'));
            } else {
                foreach ($project->actividadesProyectos as $activity) {
                    fputcsv($file, array_merge($projectDataRow, [$activity->id, $activity->description, $activity->status, $activity->user->name ?? 'No asignado'], array_fill(0, 6, 'N/A')));
                }
                foreach ($project->interruptionReports as $interruption) {
                    fputcsv($file, array_merge($projectDataRow, array_fill(0, 4, 'N/A'), [$interruption->id, $interruption->interruption_type, $interruption->date, $interruption->estimated_duration, $interruption->affected_project_phase, $interruption->user->name ?? 'No disponible']));
                }
            }
            fclose($file);
        };

        return Response::stream($callback, 200, $headers);
    }
}
