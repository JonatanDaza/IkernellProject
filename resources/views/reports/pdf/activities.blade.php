<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Reporte de Actividades - {{ $project->name }}</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; margin: 0; font-size: 12px; }
        .container { padding: 20px; }
        h1 { text-align: center; margin-bottom: 20px; font-size: 18px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; font-size: 10px; text-transform: uppercase;}
        td { font-size: 10px; }
        .page-break { page-break-after: always; }
        .no-data { text-align: center; padding: 20px; font-style: italic; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Reporte de Actividades: {{ $project->name }}</h1>

        @if($activities->count() > 0)
            <table>
                <thead>
                    <tr>
                        <th>Descripción</th>
                        <th>Estado</th>
                        <th>Desarrollador Asignado</th>
                        <th>Etapa</th>
                        <th>Fecha Límite</th>
                        <th>Iniciada</th>
                        <th>Completada</th>
                        <th>Tiempo Dedicado</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($activities as $activity)
                        <tr>
                            <td>{{ $activity->description ?? ($activity->nombre ?? 'N/A') }}</td>
                            <td>{{ $activity->status_display ?? $activity->status ?? 'N/A' }}</td>
                            <td>{{ $activity->user->name ?? 'No asignado' }}</td>
                            <td>{{ $activity->stage ?? 'N/A' }}</td>
                            <td>{{ $activity->due_date ? \Carbon\Carbon::parse($activity->due_date)->format('d/m/Y') : '-' }}</td>
                            <td>{{ $activity->started_at_formatted ?? ($activity->started_at ? \Carbon\Carbon::parse($activity->started_at)->format('d/m/Y H:i') : '-') }}</td>
                            <td>{{ $activity->completed_at_formatted ?? ($activity->completed_at ? \Carbon\Carbon::parse($activity->completed_at)->format('d/m/Y H:i') : '-') }}</td>
                            <td>{{ $activity->time_spent_formatted ?? '-' }}</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        @else
            <p class="no-data">No hay actividades registradas para este proyecto.</p>
        @endif
    </div>
</body>
</html>
