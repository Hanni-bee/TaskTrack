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
            if (!Schema::hasColumn('tasks', 'title')) {
                $table->string('title')->after('id');
            }
            if (!Schema::hasColumn('tasks', 'description')) {
                $table->text('description')->nullable()->after('title');
            }
            if (!Schema::hasColumn('tasks', 'status')) {
                $table->enum('status', ['pending', 'in_progress', 'done'])->default('pending')->after('description');
            }
            if (!Schema::hasColumn('tasks', 'due_at')) {
                $table->timestamp('due_at')->nullable()->after('status');
            }
            if (!Schema::hasColumn('tasks', 'user_id')) {
                $table->foreignId('user_id')->constrained()->onDelete('cascade')->after('due_at');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            $columns = [];
            if (Schema::hasColumn('tasks', 'title')) {
                $columns[] = 'title';
            }
            if (Schema::hasColumn('tasks', 'description')) {
                $columns[] = 'description';
            }
            if (Schema::hasColumn('tasks', 'status')) {
                $columns[] = 'status';
            }
            if (Schema::hasColumn('tasks', 'due_at')) {
                $columns[] = 'due_at';
            }
            if (Schema::hasColumn('tasks', 'user_id')) {
                $columns[] = 'user_id';
            }
            if (!empty($columns)) {
                $table->dropColumn($columns);
            }
        });
    }
};
