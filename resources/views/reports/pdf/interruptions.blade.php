<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Reporte de Interrupciones - {{ $project->name }}</title>
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
        <h1>Reporte de Interrupciones: {{ $project->name }}</h1>

        @if($interruptions->count() > 0)
            <table>
                <thead>
                    <tr>
                        <th>Fecha</th>
                        <th>Tipo</th>
                        <th>Duración</th>
                        <th>Fase Afectada</th>
                        <th>Reportado por</th>
                        <th>Descripción</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($interruptions as $interruption)
                        <tr>
                            <td>{{ \Carbon\Carbon::parse($interruption->date)->format('d/m/Y') }}</td>
                            <td>{{ $interruption->interruption_type === 'otro' && $interruption->interruption_type_other ? $interruption->interruption_type_other : str_replace('_', ' ', $interruption->interruption_type) }}</td>
                            <td>{{ $interruption->estimated_duration }}</td>
                            <td>{{ $interruption->affected_project_phase === 'otro' && $interruption->affected_project_phase_other ? $interruption->affected_project_phase_other : str_replace('_', ' ', $interruption->affected_project_phase) }}</td>
                            <td>{{ $interruption->user->name ?? 'N/A' }}</td>
                            <td>{{ $interruption->description ?? '-' }}</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        @else
            <p class="no-data">No hay interrupciones registradas para este proyecto.</p>
        @endif
    </div>
</body>
</html>
