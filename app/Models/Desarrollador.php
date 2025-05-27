<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Desarrollador extends Model
{
    use HasFactory;

    protected $primaryKey = 'id_desarrollador';
    public $incrementing = true;

    protected $fillable = [
        'id_trabajador',
        'especialidad_desarrollo',
    ];

    public function trabajador()
    {
        return $this->belongsTo(Trabajador::class, 'id_trabajador');
    }

    public function asignacionesProyecto()
    {
        return $this->hasMany(AsignacionProyecto::class, 'id_desarrollador');
    }

    public function actividadesProyecto()
    {
        return $this->hasMany(ActividadProyecto::class, 'id_desarrollador');
    }

    public function erroresProyecto()
    {
        return $this->hasMany(ErrorProyecto::class, 'id_desarrollador');
    }

    public function interrupcionesProyecto()
    {
        return $this->hasMany(InterrupcionProyecto::class, 'id_desarrollador');
    }

    public function reportesDesempeno()
    {
        return $this->hasMany(ReporteDesempeno::class, 'id_desarrollador');
    }
}