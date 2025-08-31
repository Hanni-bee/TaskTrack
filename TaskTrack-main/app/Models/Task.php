<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Task extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'title',
        'description',
        'category',
        'priority',
        'tags',
        'status',
        'due_at',
        'user_id',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'due_at' => 'datetime',
        'tags' => 'array',
    ];

    /**
     * Get the user that owns the task.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the category color.
     */
    public function getCategoryColor(): string
    {
        return match($this->category) {
            'work' => 'blue',
            'personal' => 'green',
            'health' => 'red',
            'finance' => 'yellow',
            'education' => 'purple',
            'shopping' => 'pink',
            'travel' => 'indigo',
            default => 'gray'
        };
    }

    /**
     * Get the priority color.
     */
    public function getPriorityColor(): string
    {
        return match($this->priority) {
            'high' => 'red',
            'medium' => 'yellow',
            'low' => 'green',
            default => 'gray'
        };
    }

    /**
     * Get the priority label.
     */
    public function getPriorityLabel(): string
    {
        return ucfirst($this->priority);
    }

    /**
     * Get the category label.
     */
    public function getCategoryLabel(): string
    {
        return ucfirst($this->category);
    }
}
