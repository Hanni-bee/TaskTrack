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
        if ($this->isPremium()) {
            return true; // Premium users have unlimited tasks
        }
        return $this->tasks()->count() < $this->task_limit;
    }

    /**
     * Check if user can set reminders
     */
    public function canSetReminders(): bool
    {
        return $this->isPremium() && $this->can_set_reminders;
    }

    /**
     * Check if user can use categories
     */
    public function canUseCategories(): bool
    {
        return $this->isPremium() && $this->can_use_categories;
    }

    /**
     * Check if user can export data
     */
    public function canExportData(): bool
    {
        return $this->isPremium() && $this->can_export_data;
    }
}
