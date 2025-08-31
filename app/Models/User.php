<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'subscription_type',
        'subscription_expires_at',
        'task_limit',
        'can_set_reminders',
        'can_use_categories',
        'can_export_data',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
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
            'subscription_expires_at' => 'datetime',
            'can_set_reminders' => 'boolean',
            'can_use_categories' => 'boolean',
            'can_export_data' => 'boolean',
        ];
    }

    /**
     * Get the tasks for the user.
     */
    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class);
    }

    /**
     * Check if user has premium subscription
     */
    public function isPremium(): bool
    {
        return $this->subscription_type === 'premium' && 
               ($this->subscription_expires_at === null || $this->subscription_expires_at->isFuture());
    }

    /**
     * Check if user can create more tasks
     */
    public function canCreateTask(): bool
    {
        return $this->tasks()->count() < $this->task_limit;
    }

    /**
     * Get remaining task slots
     */
    public function getRemainingTaskSlots(): int
    {
        return max(0, $this->task_limit - $this->tasks()->count());
    }

    /**
     * Upgrade user to premium
     */
    public function upgradeToPremium(): void
    {
        $this->update([
            'subscription_type' => 'premium',
            'subscription_expires_at' => now()->addYear(),
            'task_limit' => 1000,
            'can_set_reminders' => true,
            'can_use_categories' => true,
            'can_export_data' => true,
        ]);
    }
}
