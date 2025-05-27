<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CoordinadorProyecto extends Model
{
    use HasFactory;

    // Define the table associated with the model, if it's not the plural snake_case of the class name
    // protected $table = 'coordinador_proyectos'; // Example

    // Define fillable attributes if you plan to use mass assignment
    // protected $fillable = ['id_trabajador', 'other_coordinator_specific_field'];

    public function trabajador()
    {
        return $this->belongsTo(Trabajador::class, 'id_trabajador');
    }
}