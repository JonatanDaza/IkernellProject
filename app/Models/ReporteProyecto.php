<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ReporteProyecto extends Model
{
    protected $table = 'reporte_proyectos';

    protected $fillable = [
        'user_id',
        'error_type',
        'description',
        'project_phase',
        'severity',
    ];
}