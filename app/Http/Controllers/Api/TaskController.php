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

        // Check task limit for non-premium users
        if (!$user->canCreateTask()) {
            return response()->json([
                'error' => 'Task limit reached',
                'message' => 'You have reached your task limit. Upgrade to premium for unlimited tasks.'
            ], 403);
        }

        $rules = [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'category' => ['nullable', 'string', 'in:work,personal,health,finance,education,shopping,travel,general'],
            'priority' => ['nullable', 'string', 'in:low,medium,high'],
            'tags' => ['nullable', 'array'],
            'tags.*' => ['string', 'max:50'],
            'status' => ['nullable', 'in:pending,in_progress,done'],
            'due_at' => ['nullable', 'date'],
        ];

        // Add premium fields validation
        if ($user->isPremium()) {
            $rules['reminder_at'] = ['nullable', 'date'];
            $rules['notes'] = ['nullable', 'string'];
        }

        $validated = $request->validate($rules);

        $task = $user->tasks()->create($validated);
        return response()->json($task, 201);
    }

    public function update(Request $request, Task $task)
    {
        abort_unless($task->user_id === $request->user()->id, 403);

        $user = $request->user();

        $rules = [
            'title' => ['sometimes', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'category' => ['nullable', 'string', 'in:work,personal,health,finance,education,shopping,travel,general'],
            'priority' => ['nullable', 'string', 'in:low,medium,high'],
            'tags' => ['nullable', 'array'],
            'tags.*' => ['string', 'max:50'],
            'status' => ['sometimes', 'in:pending,in_progress,done'],
            'due_at' => ['nullable', 'date'],
        ];

        // Add premium fields validation
        if ($user->isPremium()) {
            $rules['reminder_at'] = ['nullable', 'date'];
            $rules['notes'] = ['nullable', 'string'];
        }

        $validated = $request->validate($rules);

        $task->update($validated);
        return response()->json($task);
    }

    public function destroy(Request $request, Task $task)
    {
        abort_unless($task->user_id === $request->user()->id, 403);
        $task->delete();
        return response()->json(null, 204);
    }

    public function analytics(Request $request)
    {
        $user = $request->user();
        $tasks = $user->tasks();

        $analytics = [
            'total_tasks' => $tasks->count(),
            'completed_tasks' => $tasks->where('status', 'done')->count(),
            'pending_tasks' => $tasks->where('status', 'pending')->count(),
            'in_progress_tasks' => $tasks->where('status', 'in_progress')->count(),
            'overdue_tasks' => $tasks->where('due_at', '<', now())->where('status', '!=', 'done')->count(),
            'tasks_by_category' => $tasks->selectRaw('category, COUNT(*) as count')
                ->groupBy('category')
                ->get()
                ->pluck('count', 'category'),
            'tasks_by_priority' => $tasks->selectRaw('priority, COUNT(*) as count')
                ->groupBy('priority')
                ->get()
                ->pluck('count', 'priority'),
            'completion_rate' => $tasks->count() > 0
                ? round(($tasks->where('status', 'done')->count() / $tasks->count()) * 100, 2)
                : 0,
            'average_tasks_per_day' => $tasks->selectRaw('DATE(created_at) as date, COUNT(*) as count')
                ->groupBy('date')
                ->get()
                ->avg('count') ?? 0,
        ];

        return response()->json($analytics);
    }
}
