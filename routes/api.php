<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\TaskController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// LAHAT NG ROUTES DITO AY PROTECTED. KAILANGAN NAKA-LOGIN ANG USER.
Route::middleware(['auth:sanctum', 'throttle:60,1'])->group(function () {

    // Route para malaman kung sino ang naka-login.
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Mga route para sa pag-manage ng tasks.
    // NOTE: Pwede nating paikliin ito gamit ang apiResource.
    // Route::apiResource('tasks', TaskController::class);
    Route::get('/tasks', [TaskController::class, 'index']);
    Route::post('/tasks', [TaskController::class, 'store']);
    Route::put('/tasks/{task}', [TaskController::class, 'update']);
    Route::delete('/tasks/{task}', [TaskController::class, 'destroy']);

    // Analytics route (premium only)
    Route::get('/analytics', [TaskController::class, 'analytics'])->middleware('subscription');
});


// DITO NATIN IDADAGDAG ANG MGA ROUTE PARA SA LOGIN, REGISTER, at LOGOUT.
// Awtomatiko nitong idadagdag ang mga kailangang API endpoints tulad ng:
// POST /login
// POST /register
// POST /logout
require __DIR__.'/auth.php';
