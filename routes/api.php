<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\TaskController;
use App\Http\Controllers\Api\SubscriptionController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// LAHAT NG ROUTES DITO AY PROTECTED. KAILANGAN NAKA-LOGIN ANG USER.
Route::middleware(['auth:sanctum'])->group(function () {

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

    // Subscription management routes
    Route::get('/subscription', [SubscriptionController::class, 'show']);
    Route::post('/subscription/upgrade', [SubscriptionController::class, 'upgrade']);
    Route::get('/subscription/export', [SubscriptionController::class, 'exportData']);

    // Analytics routes
    Route::get('/analytics/dashboard', [App\Http\Controllers\Api\AnalyticsController::class, 'dashboard']);
});


// DITO NATIN IDADAGDAG ANG MGA ROUTE PARA SA LOGIN, REGISTER, at LOGOUT.
// Awtomatiko nitong idadagdag ang mga kailangang API endpoints tulad ng:
// POST /login
// POST /register
// POST /logout
require __DIR__.'/auth.php';
