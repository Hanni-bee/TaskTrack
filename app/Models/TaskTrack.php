<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TaskTrack extends Model
{
    use HasFactory;

    protected $table = 'task_tracks';

    protected $fillable = [
        'title',
        'description',
        'status',
        'due_at',
        'user_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
