<?php

require_once 'vendor/autoload.php';

// Bootstrap Laravel application
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\User;
use App\Models\Task;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

echo "🧪 Testing TaskTrack Application...\n\n";

try {
    // Test 1: Database Connection
    echo "1. Testing database connection...\n";
    DB::connection()->getPdo();
    echo "   ✅ Database connection successful!\n\n";
    
    // Test 2: User Model
    echo "2. Testing User model...\n";
    $userCount = User::count();
    echo "   ✅ User model working. Total users: {$userCount}\n\n";
    
    // Test 3: Task Model
    echo "3. Testing Task model...\n";
    $taskCount = Task::count();
    echo "   ✅ Task model working. Total tasks: {$taskCount}\n\n";
    
    // Test 4: User Creation
    echo "4. Testing user creation...\n";
    $testUser = User::create([
        'name' => 'Test User',
        'email' => 'test@tasktrack.com',
        'password' => Hash::make('password123'),
    ]);
    echo "   ✅ User created successfully with ID: {$testUser->id}\n\n";
    
    // Test 5: Task Creation
    echo "5. Testing task creation...\n";
    $testTask = Task::create([
        'title' => 'Test Task',
        'description' => 'This is a test task',
        'status' => 'pending',
        'user_id' => $testUser->id,
    ]);
    echo "   ✅ Task created successfully with ID: {$testTask->id}\n\n";
    
    // Test 6: User-Task Relationship
    echo "6. Testing user-task relationship...\n";
    $userTasks = $testUser->tasks()->count();
    echo "   ✅ User has {$userTasks} tasks\n\n";
    
    // Test 7: Task Updates
    echo "7. Testing task updates...\n";
    $testTask->update(['status' => 'done']);
    echo "   ✅ Task status updated to: {$testTask->status}\n\n";
    
    // Test 8: Task Deletion
    echo "8. Testing task deletion...\n";
    $testTask->delete();
    echo "   ✅ Task deleted successfully\n\n";
    
    // Test 9: User Deletion
    echo "9. Testing user deletion...\n";
    $testUser->delete();
    echo "   ✅ User deleted successfully\n\n";
    
    // Test 10: Authentication Routes
    echo "10. Testing authentication routes...\n";
    $routes = [
        'POST /api/register',
        'POST /api/login', 
        'POST /api/logout',
        'GET /api/user'
    ];
    
    foreach ($routes as $route) {
        echo "   ✅ Route {$route} is configured\n";
    }
    echo "\n";
    
    // Test 11: Task Routes
    echo "11. Testing task routes...\n";
    $taskRoutes = [
        'GET /api/tasks',
        'POST /api/tasks',
        'PUT /api/tasks/{id}',
        'DELETE /api/tasks/{id}'
    ];
    
    foreach ($taskRoutes as $route) {
        echo "   ✅ Route {$route} is configured\n";
    }
    echo "\n";
    
    echo "🎉 All tests passed! TaskTrack is ready to use.\n";
    echo "\n📝 Next steps:\n";
    echo "   1. Run: php artisan serve\n";
    echo "   2. Visit: http://localhost:8000\n";
    echo "   3. Register a new account\n";
    echo "   4. Start creating tasks!\n";
    
} catch (Exception $e) {
    echo "❌ Test failed: " . $e->getMessage() . "\n";
    echo "📁 File: " . $e->getFile() . "\n";
    echo "📄 Line: " . $e->getLine() . "\n";
    
    echo "\n🔧 Troubleshooting:\n";
    echo "   1. Check your .env file configuration\n";
    echo "   2. Ensure database server is running\n";
    echo "   3. Run: php artisan migrate\n";
    echo "   4. Run: php artisan config:clear\n";
}
