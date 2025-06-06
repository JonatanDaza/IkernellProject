<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">    <title>Reporte de Actividades - {{ $project->name }}</title>
    <style>
        body {
            font-family: DejaVu Sans, Arial, Helvetica, sans-serif;
            font-size: 12px;
            color: #222;
            background: #fff;
            margin: 0;
            padding: 0;
        }

        .container {
            width: 95%;
            margin: 0 auto;
            padding: 20px 0;
        }

        h1 {
            text-align: center;
            font-size: 22px;
            margin-bottom: 25px;
            color: #2c3e50;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
            font-size: 12px;
        }

        th, td {
            border: 1px solid #bbb;
            padding: 7px 5px;
            text-align: left;
            vertical-align: top;
        }

        th {
            background: #f2f2f2;
            font-weight: bold;
            color: #222;
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
                            <td>{{ $activity->status_display ?? ($activity->status ?? 'N/A') }}</td>
                            <td>{{ $activity->user && $activity->user->name ? $activity->user->name : 'No asignado' }}</td>
                            <td>{{ $activity->stage ?? 'N/A' }}</td>
                            <td>{{ $activity->due_date ? date('d/m/Y', strtotime($activity->due_date)) : '-' }}</td>
                            <td>{{ $activity->started_at ? date('d/m/Y H:i', strtotime($activity->started_at)) : '-' }}</td>
                            <td>{{ $activity->completed_at ? date('d/m/Y H:i', strtotime($activity->completed_at)) : '-' }}</td>
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
