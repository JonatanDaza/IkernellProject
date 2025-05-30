<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TutorialResource extends Model
{
    use HasFactory;

    protected $table = 'tutorial_resources';

    protected $fillable = [
        'title',
        'description',
        'category',
        'source',
        'link',
        'tags',
        'difficulty',
        'status',
    ];

    protected $casts = [
        'tags' => 'array',
    ];
}