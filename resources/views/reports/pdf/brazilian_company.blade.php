<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Reporte Empresa Brasileña</title>
    <style>
        body {
            font-family: Arial, Helvetica, sans-serif;
            margin: 30px;
            color: #222;
            background: #fff;
        }

        h2, h3 {
            color: #1a237e;
            margin-bottom: 10px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 25px;
            font-size: 14px;
        }

        th, td {
            border: 1px solid #bdbdbd;
            padding: 8px 10px;
            text-align: left;
        }

        th {
            background-color: #e3f2fd;
            color: #0d47a1;
            font-weight: bold;
        }

        tr:nth-child(even) {
            background-color: #f5f5f5;
        }

        strong {
            color: #1565c0;
        }
    </style>
</head>
<body>
    <h2>Reporte Empresa Brasileña</h2>
    <p><strong>Proyecto:</strong> {{ $project->name }} (ID: {{ $project->id }})</p>
    <p><strong>Estado:</strong> {{ $project->status }}</p>
    <p><strong>Hitos Clave:</strong> {{ implode('; ', $project->milestones ?? []) }}</p>

    <h3>Actividades</h3>
    <table>
        <thead>
            <tr>
                <th>ID Actividad</th>
                <th>Descripción</th>
                <th>Estado</th>
                <th>Desarrollador</th>
            </tr>
        </thead>
        <tbody>
        @forelse($project->actividadesProyectos as $activity)
            <tr>
                <td>{{ $activity->id }}</td>
                <td>{{ $activity->description }}</td>
                <td>{{ $activity->status }}</td>
                <td>{{ $activity->user->name ?? 'No asignado' }}</td>
            </tr>
        @empty
            <tr><td colspan="4">Sin actividades registradas</td></tr>
        @endforelse
        </tbody>
    </table>

    <h3>Interrupciones</h3>
    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>Tipo</th>
                <th>Fecha</th>
                <th>Duración</th>
                <th>Fase Afectada</th>
                <th>Reportó</th>
            </tr>
        </thead>
        <tbody>
        @forelse($project->interruptionReports as $interruption)
            <tr>
                <td>{{ $interruption->id }}</td>
                <td>{{ $interruption->interruption_type }}</td>
                <td>{{ $interruption->date }}</td>
                <td>{{ $interruption->estimated_duration }}</td>
                <td>{{ $interruption->affected_project_phase }}</td>
                <td>{{ $interruption->user->name ?? 'No disponible' }}</td>
            </tr>
        @empty
            <tr><td colspan="6">Sin interrupciones registradas</td></tr>
        @endforelse
        </tbody>
    </table>
</body>
</html>