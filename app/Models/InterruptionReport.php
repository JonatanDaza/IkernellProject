<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory; // Opcional, si usas factories

class InterruptionReport extends Model
{
    use HasFactory; // Opcional, si usas factories para testing o seeding

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'project_id', // Puede ser nullable si una interrupción no siempre está ligada a un proyecto
        'interruption_type',
        'interruption_type_other',
        'date',
        'estimated_duration',
        'affected_project_phase',
        'affected_project_phase_other',
        'description',
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
