<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\TaskTrack as TaskTrackModel;
use Illuminate\Support\Str;

class TaskTrack extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        TaskTrackModel::factory()->count(5)->create();
    }
}
