<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Ito ang tamang paraan para i-serve ang isang Single Page Application (SPA).
| Anumang URL na hindi para sa API ay ipapakita ang ating main 'app.blade.php' file.
| Si React Router na ang bahala sa kung anong page (Login, Dashboard, etc.) ang ipapakita.
|
*/

Route::get('/{any}', function () {
    return view('app'); // DAPAT 'app' ang pangalan ng blade file mo sa views.
})->where('any', '.*');

// Hindi na natin kailangan ang require __DIR__.'/auth.php' para sa SPA setup na ito.
