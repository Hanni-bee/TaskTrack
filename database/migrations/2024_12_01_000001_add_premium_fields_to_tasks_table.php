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
        Schema::table('tasks', function (Blueprint $table) {
            if (!Schema::hasColumn('tasks', 'category')) {
                $table->string('category')->nullable()->after('due_at');
            }
            if (!Schema::hasColumn('tasks', 'priority')) {
                $table->enum('priority', ['low', 'medium', 'high'])->default('medium')->after('category');
            }
            if (!Schema::hasColumn('tasks', 'reminder_at')) {
                $table->timestamp('reminder_at')->nullable()->after('priority');
            }
            if (!Schema::hasColumn('tasks', 'notes')) {
                $table->text('notes')->nullable()->after('reminder_at');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            $table->dropColumn(['category', 'priority', 'reminder_at', 'notes']);
        });
    }
};
