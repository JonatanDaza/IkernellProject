<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProgramResource extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'type',
        'version',
        'description',
        'link',
        'tags',
        'status',
        'category',
    ];

    protected $casts = [
        'tags' => 'array', // Para que Laravel maneje el campo JSON como array
    ];
}
