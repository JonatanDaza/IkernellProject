<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;

    public const STAGE_PENDIENTE = 'Pendiente';
    public const STAGE_INICIO = 'Inicio';
    public const STAGE_PLANEACION = 'Planeacion';
    public const STAGE_EJECUCION = 'Ejecucion';
    public const STAGE_SEGUIMIENTO = 'Seguimiento';
    public const STAGE_CIERRE = 'Cierre';

    
    protected $fillable = [
        'name',
        'description',
        'start_date',
        'end_date',
        'leader_id',
        'status', // Add status
        'stage', // Add stage here

    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'status' => 'string', // Cast status
    ];

    public static function getStages(): array
    {
        return [
            self::STAGE_PENDIENTE, self::STAGE_INICIO, self::STAGE_PLANEACION,
            self::STAGE_EJECUCION, self::STAGE_SEGUIMIENTO, self::STAGE_CIERRE,
        ];
    }

    /**
     * The users that belong to the project.
     */
    public function users()
    {
        return $this->belongsToMany(User::class)->withPivot('is_active_in_project');
    }

    public function leader()
    {
        return $this->belongsTo(User::class, 'leader_id');
    }
}