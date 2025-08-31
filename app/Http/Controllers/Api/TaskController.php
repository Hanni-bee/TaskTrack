<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function index(Request $request)
    {
        $tasks = $request->user()->tasks()->latest()->get();
        return response()->json($tasks);
    }

    public function store(Request $request)
    {
        $user = $request->user();
        
        // Check task limit
        if (!$user->canCreateTask()) {
            return response()->json([
                'message' => 'Task limit reached. Upgrade to Premium for unlimited tasks.',
                'current_tasks' => $user->tasks()->count(),
                'task_limit' => $user->task_limit,
                'subscription_type' => $user->subscription_type
            ], 403);
        }

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'status' => ['nullable', 'in:pending,in_progress,done'],
            'due_at' => ['nullable', 'date'],
            'category' => ['nullable', 'string', 'max:100'],
            'priority' => ['nullable', 'in:low,medium,high'],
            'reminder_at' => ['nullable', 'date'],
            'notes' => ['nullable', 'string'],
        ]);

        // Check premium features
        if (isset($validated['category']) && !$user->can_use_categories) {
            return response()->json([
                'message' => 'Categories are a Premium feature. Upgrade to use this feature.'
            ], 403);
        }

        if (isset($validated['reminder_at']) && !$user->can_set_reminders) {
            return response()->json([
                'message' => 'Reminders are a Premium feature. Upgrade to use this feature.'
            ], 403);
        }

        $task = $user->tasks()->create($validated);
        return response()->json($task, 201);
    }

    public function update(Request $request, Task $task)
    {
        abort_unless($task->user_id === $request->user()->id, 403);

        $user = $request->user();
        
        $validated = $request->validate([
            'title' => ['sometimes', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'status' => ['sometimes', 'in:pending,in_progress,done'],
            'due_at' => ['nullable', 'date'],
            'category' => ['nullable', 'string', 'max:100'],
            'priority' => ['nullable', 'in:low,medium,high'],
            'reminder_at' => ['nullable', 'date'],
            'notes' => ['nullable', 'string'],
        ]);

        // Check premium features for updates
        if (isset($validated['category']) && !$user->can_use_categories) {
            return response()->json([
                'message' => 'Categories are a Premium feature. Upgrade to use this feature.'
            ], 403);
        }

        if (isset($validated['reminder_at']) && !$user->can_set_reminders) {
            return response()->json([
                'message' => 'Reminders are a Premium feature. Upgrade to use this feature.'
            ], 403);
        }

        $task->update($validated);
        return response()->json($task);
    }

    public function destroy(Request $request, Task $task)
    {
        abort_unless($task->user_id === $request->user()->id, 403);
        $task->delete();
        return response()->json(null, 204);
    }
}
