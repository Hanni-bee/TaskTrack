<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class ViteManifestServiceProvider extends ServiceProvider
{
    public function register()
    {
        // No binding for Vite in dev mode to avoid manifest loading error
    }
}
