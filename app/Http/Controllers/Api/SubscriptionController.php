<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class SubscriptionController extends Controller
{
    public function show(Request $request)
    {
        $user = $request->user();
        
        return response()->json([
            'subscription_type' => $user->subscription_type,
            'subscription_expires_at' => $user->subscription_expires_at,
            'task_limit' => $user->task_limit,
            'current_tasks' => $user->tasks()->count(),
            'remaining_tasks' => $user->getRemainingTaskSlots(),
            'can_set_reminders' => $user->can_set_reminders,
            'can_use_categories' => $user->can_use_categories,
            'can_export_data' => $user->can_export_data,
            'is_premium' => $user->isPremium(),
        ]);
    }

    public function upgrade(Request $request)
    {
        $user = $request->user();
        
        if ($user->isPremium()) {
            return response()->json([
                'message' => 'You already have a Premium subscription.'
            ], 400);
        }

        // In a real app, you'd integrate with a payment processor here
        // For demo purposes, we'll just upgrade the user
        $user->upgradeToPremium();

        return response()->json([
            'message' => 'Successfully upgraded to Premium!',
            'subscription' => [
                'subscription_type' => $user->subscription_type,
                'subscription_expires_at' => $user->subscription_expires_at,
                'task_limit' => $user->task_limit,
                'can_set_reminders' => $user->can_set_reminders,
                'can_use_categories' => $user->can_use_categories,
                'can_export_data' => $user->can_export_data,
            ]
        ]);
    }

    public function exportData(Request $request)
    {
        $user = $request->user();
        
        if (!$user->can_export_data) {
            return response()->json([
                'message' => 'Data export is a Premium feature. Upgrade to use this feature.'
            ], 403);
        }

        $tasks = $user->tasks()->get()->map(function ($task) {
            return [
                'id' => $task->id,
                'title' => $task->title,
                'description' => $task->description,
                'status' => $task->status,
                'priority' => $task->priority,
                'category' => $task->category,
                'due_at' => $task->due_at?->toISOString(),
                'reminder_at' => $task->reminder_at?->toISOString(),
                'notes' => $task->notes,
                'created_at' => $task->created_at->toISOString(),
                'updated_at' => $task->updated_at->toISOString(),
            ];
        });

        return response()->json([
            'user' => [
                'name' => $user->name,
                'email' => $user->email,
                'subscription_type' => $user->subscription_type,
            ],
            'tasks' => $tasks,
            'exported_at' => now()->toISOString(),
        ]);
    }
}
