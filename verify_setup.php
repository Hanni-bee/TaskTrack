<?php

echo "🔍 TaskTrack Setup Verification\n";
echo "==============================\n\n";

// Check if .env exists
if (!file_exists('.env')) {
    echo "❌ .env file not found!\n";
    echo "   Run: cp .env.example .env\n";
    echo "   Then configure your database credentials\n\n";
    exit(1);
}

// Check if vendor directory exists
if (!is_dir('vendor')) {
    echo "❌ Vendor directory not found!\n";
    echo "   Run: composer install\n\n";
    exit(1);
}

// Check if node_modules exists
if (!is_dir('node_modules')) {
    echo "❌ Node modules not found!\n";
    echo "   Run: npm install\n\n";
    exit(1);
}

// Check if build directory exists
if (!is_dir('public/build')) {
    echo "❌ Build directory not found!\n";
    echo "   Run: npm run build\n\n";
    exit(1);
}

// Check if storage is writable
if (!is_writable('storage')) {
    echo "❌ Storage directory not writable!\n";
    echo "   Run: chmod -R 775 storage\n\n";
    exit(1);
}

// Check if bootstrap/cache is writable
if (!is_writable('bootstrap/cache')) {
    echo "❌ Bootstrap cache not writable!\n";
    echo "   Run: chmod -R 775 bootstrap/cache\n\n";
    exit(1);
}

echo "✅ Basic file structure check passed!\n\n";

// Test database connection
try {
    require_once 'vendor/autoload.php';
    
    // Load environment
    $dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
    $dotenv->load();
    
    // Test database connection
    $pdo = new PDO(
        "mysql:host=" . $_ENV['DB_HOST'] . ";port=" . $_ENV['DB_PORT'] . ";dbname=" . $_ENV['DB_DATABASE'],
        $_ENV['DB_USERNAME'],
        $_ENV['DB_PASSWORD']
    );
    
    echo "✅ Database connection successful!\n";
    
    // Check if tables exist
    $tables = ['users', 'tasks', 'personal_access_tokens'];
    foreach ($tables as $table) {
        $stmt = $pdo->query("SHOW TABLES LIKE '$table'");
        if ($stmt->rowCount() > 0) {
            echo "✅ Table '$table' exists\n";
        } else {
            echo "❌ Table '$table' missing!\n";
            echo "   Run: php artisan migrate\n\n";
            exit(1);
        }
    }
    
    echo "\n✅ Database setup complete!\n\n";
    
} catch (Exception $e) {
    echo "❌ Database connection failed: " . $e->getMessage() . "\n";
    echo "   Check your .env file database credentials\n\n";
    exit(1);
}

// Check if APP_KEY is set
if (empty($_ENV['APP_KEY']) || $_ENV['APP_KEY'] === 'base64:') {
    echo "❌ APP_KEY not set!\n";
    echo "   Run: php artisan key:generate\n\n";
    exit(1);
} else {
    echo "✅ APP_KEY is configured\n";
}

// Check if APP_URL is set
if (empty($_ENV['APP_URL'])) {
    echo "⚠️  APP_URL not set (optional for local development)\n";
} else {
    echo "✅ APP_URL is configured\n";
}

echo "\n🎉 TaskTrack is ready to use!\n\n";

echo "📋 Quick Start Guide:\n";
echo "====================\n";
echo "1. Start the server: php artisan serve\n";
echo "2. Open browser: http://localhost:8000\n";
echo "3. Register a new account\n";
echo "4. Start creating tasks!\n\n";

echo "🔧 Development Commands:\n";
echo "=======================\n";
echo "• npm run dev          - Watch for frontend changes\n";
echo "• npm run build        - Build for production\n";
echo "• php artisan migrate  - Run database migrations\n";
echo "• php artisan test     - Run tests\n\n";

echo "📚 Documentation:\n";
echo "=================\n";
echo "• README.md           - Setup and usage guide\n";
echo "• TROUBLESHOOTING.md  - Common issues and solutions\n\n";

echo "🚀 Your TaskTrack app is fully functional!\n";
