<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'start_date',
        'end_date',
        'leader_id',
        'status', // Add status
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'status' => 'string', // Cast status
    ];

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