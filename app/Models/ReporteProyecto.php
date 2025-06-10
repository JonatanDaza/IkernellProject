<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory; 

class ReporteProyecto extends Model
{
    protected $table = 'reporte_proyectos';

    protected $fillable = [
        'user_id',
        'project_id',
        'error_type',
        'description',
        'project_phase',
        'severity',
    ];
        /**
     * Get the user who reported the interruption.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }
}
