<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Task events for detailed analytics
        if (!Schema::hasTable('task_events')) {
            Schema::create('task_events', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->constrained()->onDelete('cascade');
                $table->foreignId('task_id')->constrained()->onDelete('cascade');
                $table->enum('event_type', ['created', 'updated', 'completed', 'deleted', 'status_changed']);
                $table->json('event_data')->nullable(); // Store additional context
                $table->timestamp('occurred_at');
                $table->timestamps();

                $table->index(['user_id', 'occurred_at']);
                $table->index(['task_id', 'event_type']);
            });
        }

        // Daily productivity summaries
        if (!Schema::hasTable('daily_summaries')) {
            Schema::create('daily_summaries', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->constrained()->onDelete('cascade');
                $table->date('date');
                $table->integer('tasks_created')->default(0);
                $table->integer('tasks_completed')->default(0);
                $table->integer('tasks_overdue')->default(0);
                $table->integer('total_time_tracked')->default(0); // in minutes
                $table->json('category_breakdown')->nullable();
                $table->json('priority_breakdown')->nullable();
                $table->timestamps();

                $table->unique(['user_id', 'date']);
            });
        }

        // User productivity streaks
        if (!Schema::hasTable('productivity_streaks')) {
            Schema::create('productivity_streaks', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->constrained()->onDelete('cascade');
                $table->integer('current_streak')->default(0);
                $table->integer('longest_streak')->default(0);
                $table->date('streak_start_date')->nullable();
                $table->date('last_activity_date')->nullable();
                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('productivity_streaks');
        Schema::dropIfExists('daily_summaries');
        Schema::dropIfExists('task_events');
    }
};
