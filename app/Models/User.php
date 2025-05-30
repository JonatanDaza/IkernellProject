<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'lastname',
        'role',
        'email',
        'password',
        'fecha_registro',
        'date_of_birth',
        'identification_number',
        'address',
        'profession',
        'worker_type',
        'profile_photo_path',
        'specialty', // Make specialty fillable
        'is_active', // Add is_active to fillable
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'fecha_registro' => 'date',
            'date_of_birth' => 'date',
            'identification_number' => 'string',
            'address' => 'string',
            'profession' => 'string',
            'specialty' => 'string', // Cast specialty as string
            'worker_type' => 'string',
            'profile_photo_path' => 'string',
            'is_active' => 'boolean', // Ensure is_active is cast to boolean
    ];
    }
    public function trabajador()
    {
        return $this->hasOne(Trabajador::class, 'id');
    }

    public function mensajesInteresado()
    {
        return $this->hasMany(MensajeInteresado::class, 'id_user');
    }

    /**
     * The projects that belong to the user.
     */
    public function projects()
    {
        return $this->belongsToMany(Project::class)->withPivot('is_active_in_project');
    }
}
