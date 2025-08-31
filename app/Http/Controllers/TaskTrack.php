<?php

namespace App\Http\Controllers;

use App\Models\TaskTrack as TaskTrackModel;
use Illuminate\Http\Request;

class TaskTrack extends Controller
{
    public function index()
    {
        $tasks = TaskTrackModel::orderByDesc('created_at')->get();
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

        $task = TaskTrackModel::create($validated);

        return response()->json($task, 201);
    }
}
