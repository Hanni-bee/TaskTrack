<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TaskTrack;
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
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'status' => ['nullable', 'in:pending,in_progress,done'],
            'due_at' => ['nullable', 'date'],
        ]);

        $task = $request->user()->tasks()->create($validated);
        return response()->json($task, 201);
    }

    public function update(Request $request, TaskTrack $task)
    {
        abort_unless($task->user_id === $request->user()->id, 403);

        $validated = $request->validate([
            'title' => ['sometimes', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'status' => ['sometimes', 'in:pending,in_progress,done'],
            'due_at' => ['nullable', 'date'],
        ]);

        $task->update($validated);
        return response()->json($task);
    }

    public function destroy(Request $request, TaskTrack $task)
    {
        abort_unless($task->user_id === $request->user()->id, 403);
        $task->delete();
        return response()->json(null, 204);
    }
}
