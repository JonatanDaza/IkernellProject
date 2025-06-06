<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">    <title>Reporte de Interrupciones - {{ $project->name }}</title>
    <style>
    body {
        font-family: DejaVu Sans, Arial, Helvetica, sans-serif;
        font-size: 12px;
        color: #222;
        margin: 0;
        padding: 0;
        background: #fff;
    }
    .container {
        width: 95%;
        margin: 0 auto;
        padding: 10px 0;
    }
    h1 {
        text-align: center;
        font-size: 20px;
        margin-bottom: 25px;
    }
    table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 15px;
    }
    th, td {
        border: 1px solid #888;
        padding: 7px 5px;
        text-align: left;
        vertical-align: top;
    }
    th {
        background: #f2f2f2;
        font-weight: bold;
    }
    tr:nth-child(even) td {
        background: #fafafa;
    }
    .no-data {
        text-align: center;
        color: #888;
        font-style: italic;
        margin-top: 30px;
    }
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
