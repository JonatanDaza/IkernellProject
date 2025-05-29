<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Trabajador extends Model
{
    use HasFactory;

    protected $primaryKey = 'id_trabajador'; // Specify the primary key
    public $incrementing = true; // Indicates if the primary key is auto-incrementing

    protected $fillable = [
        'user_id', // Assuming this is the foreign key to the users table
        'identificacion',
        'fecha_nacimiento',
        'direccion',
        'profesion',
        'tipo_trabajador',
        'foto_perfil',
    ];

    protected $casts = [
        'fecha_nacimiento' => 'date',
    ];

    // Define relationships
    public function user()
    {
        // Changed "Usuario" to "User" to match Laravel's default User model
        return $this->belongsTo(User::class, 'user_id'); // Ensure 'user_id' is the correct foreign key
    }

    public function desarrollador()
    {
        return $this->hasOne(Desarrollador::class, 'id_trabajador');
    }

    public function coordinadorProyecto()
    {
        return $this->hasOne(CoordinadorProyecto::class, 'id_trabajador');
    }

    public function liderProyecto()
    {
        return $this->hasOne(LiderProyecto::class, 'id_trabajador');
    }
}