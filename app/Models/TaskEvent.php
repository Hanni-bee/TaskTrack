<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TaskEvent extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'task_id',
        'event_type',
        'event_data',
        'occurred_at',
    ];

    protected $casts = [
        'event_data' => 'array',
        'occurred_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function task(): BelongsTo
    {
        return $this->belongsTo(Task::class);
    }

    // Helper method to log task events
    public static function logEvent(int $userId, int $taskId, string $eventType, array $eventData = []): void
    {
        self::create([
            'user_id' => $userId,
            'task_id' => $taskId,
            'event_type' => $eventType,
            'event_data' => $eventData,
            'occurred_at' => now(),
        ]);
    }
}
