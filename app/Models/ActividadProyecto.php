<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class ActividadProyecto extends Model
{
    use HasFactory;

    protected $table = 'actividad_proyectos'; // Asegúrate que el nombre de la tabla sea correcto

    protected $fillable = [
        'project_id',
        'user_id', // Desarrollador asignado
        'name', // O 'title' o como llames al nombre/título de la actividad
        'description',
        'stage',
        'status', // ej: 'pending', 'in_progress', 'completed'
        'due_date',
        // Nuevos campos
        'started_at',
        'completed_at',
        'time_spent_seconds',
        'developer_notes',
        // 'progress_percentage',
    ];

    protected $casts = [
        'due_date' => 'datetime',
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
        'time_spent_seconds' => 'integer',
        // 'progress_percentage' => 'integer',
    ];

    public function project()
    {
        return $this->belongsTo(Project::class); // Asegúrate que el modelo Project exista
    }

    public function user() // Desarrollador asignado
    {
        return $this->belongsTo(User::class);
    }

    // Helper para formatear el tiempo
    public function getFormattedTimeSpentAttribute(): string
    {
        if (is_null($this->time_spent_seconds) || $this->time_spent_seconds === 0) {
            return 'N/A';
        }
        return Carbon::now()->subSeconds($this->time_spent_seconds)->diffForHumans(null, true);
    }
}
