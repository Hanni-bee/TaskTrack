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
        Schema::table('users', function (Blueprint $table) {
            $table->enum('subscription_type', ['basic', 'premium'])->default('basic')->after('email_verified_at');
            $table->timestamp('subscription_expires_at')->nullable()->after('subscription_type');
            $table->integer('task_limit')->default(10)->after('subscription_expires_at');
            $table->boolean('can_set_reminders')->default(false)->after('task_limit');
            $table->boolean('can_use_categories')->default(false)->after('can_set_reminders');
            $table->boolean('can_export_data')->default(false)->after('can_use_categories');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'subscription_type',
                'subscription_expires_at',
                'task_limit',
                'can_set_reminders',
                'can_use_categories',
                'can_export_data'
            ]);
        });
    }
};
