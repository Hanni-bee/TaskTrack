<?php

echo "🚀 TaskTrack New Device Setup Script\n";
echo "=====================================\n\n";

// Check if we're in the right directory
if (!file_exists('composer.json')) {
    echo "❌ Error: composer.json not found. Make sure you're in the TaskTrack project directory.\n";
    exit(1);
}

echo "✅ Found TaskTrack project files\n\n";

// Step 1: Check PHP version
echo "1. Checking PHP version...\n";
$phpVersion = phpversion();
echo "   PHP Version: $phpVersion\n";

if (version_compare($phpVersion, '8.1.0', '<')) {
    echo "   ⚠️  Warning: PHP 8.1+ recommended. Current version might work but not guaranteed.\n";
} else {
    echo "   ✅ PHP version is compatible\n";
}
echo "\n";

// Step 2: Check required PHP extensions
echo "2. Checking PHP extensions...\n";
$requiredExtensions = [
    'pdo',
    'pdo_mysql',
    'mbstring',
    'openssl',
    'tokenizer',
    'xml',
    'ctype',
    'json',
    'bcmath',
    'fileinfo'
];

$missingExtensions = [];
foreach ($requiredExtensions as $ext) {
    if (!extension_loaded($ext)) {
        $missingExtensions[] = $ext;
        echo "   ❌ Missing: $ext\n";
    } else {
        echo "   ✅ $ext\n";
    }
}

if (!empty($missingExtensions)) {
    echo "\n❌ Missing required PHP extensions: " . implode(', ', $missingExtensions) . "\n";
    echo "Please install these extensions and try again.\n";
    exit(1);
}
echo "\n";

// Step 3: Check if .env file exists
echo "3. Checking environment configuration...\n";
if (!file_exists('.env')) {
    echo "   ❌ .env file not found\n";
    echo "   📝 Creating .env file from template...\n";
    
    // Create basic .env content
    $envContent = "APP_NAME=TaskTrack
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost:8000

LOG_CHANNEL=stack
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=debug

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=tasktrack
DB_USERNAME=root
DB_PASSWORD=

BROADCAST_DRIVER=log
CACHE_DRIVER=file
FILESYSTEM_DISK=local
QUEUE_CONNECTION=sync
SESSION_DRIVER=file
SESSION_LIFETIME=120

MEMCACHED_HOST=127.0.0.1

REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

MAIL_MAILER=smtp
MAIL_HOST=mailpit
MAIL_PORT=1025
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS=\"hello@example.com\"
MAIL_FROM_NAME=\"\${APP_NAME}\"

AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=
AWS_USE_PATH_STYLE_ENDPOINT=false

PUSHER_APP_ID=
PUSHER_APP_KEY=
PUSHER_APP_SECRET=
PUSHER_HOST=
PUSHER_PORT=443
PUSHER_SCHEME=https
PUSHER_APP_CLUSTER=mt1

VITE_APP_NAME=\"\${APP_NAME}\"
VITE_PUSHER_APP_KEY=\"\${PUSHER_APP_KEY}\"
VITE_PUSHER_HOST=\"\${PUSHER_HOST}\"
VITE_PUSHER_PORT=\"\${PUSHER_PORT}\"
VITE_PUSHER_SCHEME=\"\${PUSHER_SCHEME}\"
VITE_PUSHER_APP_CLUSTER=\"\${PUSHER_APP_CLUSTER}\"
";
    
    file_put_contents('.env', $envContent);
    echo "   ✅ .env file created\n";
} else {
    echo "   ✅ .env file exists\n";
}
echo "\n";

// Step 4: Check if vendor directory exists
echo "4. Checking PHP dependencies...\n";
if (!is_dir('vendor')) {
    echo "   ❌ vendor directory not found\n";
    echo "   📦 Installing PHP dependencies...\n";
    echo "   Please run: composer install\n";
} else {
    echo "   ✅ vendor directory exists\n";
}
echo "\n";

// Step 5: Check if node_modules exists
echo "5. Checking Node.js dependencies...\n";
if (!is_dir('node_modules')) {
    echo "   ❌ node_modules directory not found\n";
    echo "   📦 Installing Node.js dependencies...\n";
    echo "   Please run: npm install\n";
} else {
    echo "   ✅ node_modules directory exists\n";
}
echo "\n";

// Step 6: Check if APP_KEY is set
echo "6. Checking application key...\n";
$envContent = file_get_contents('.env');
if (strpos($envContent, 'APP_KEY=') !== false && strpos($envContent, 'APP_KEY=base64:') === false) {
    echo "   ❌ Application key not set\n";
    echo "   🔑 Please run: php artisan key:generate\n";
} else {
    echo "   ✅ Application key is set\n";
}
echo "\n";

// Step 7: Check database connection
echo "7. Checking database connection...\n";
try {
    // Load environment variables
    $dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
    $dotenv->load();
    
    $host = $_ENV['DB_HOST'] ?? '127.0.0.1';
    $database = $_ENV['DB_DATABASE'] ?? 'tasktrack';
    $username = $_ENV['DB_USERNAME'] ?? 'root';
    $password = $_ENV['DB_PASSWORD'] ?? '';
    
    $pdo = new PDO("mysql:host=$host", $username, $password);
    echo "   ✅ Database connection successful\n";
    
    // Check if database exists
    $stmt = $pdo->query("SHOW DATABASES LIKE '$database'");
    if ($stmt->rowCount() > 0) {
        echo "   ✅ Database '$database' exists\n";
    } else {
        echo "   ❌ Database '$database' does not exist\n";
        echo "   📝 Please create the database: CREATE DATABASE $database;\n";
    }
    
} catch (Exception $e) {
    echo "   ❌ Database connection failed: " . $e->getMessage() . "\n";
    echo "   📝 Please check your database configuration in .env file\n";
}
echo "\n";

// Step 8: Check if migrations have been run
echo "8. Checking database migrations...\n";
if (is_dir('vendor')) {
    echo "   📝 Please run: php artisan migrate\n";
} else {
    echo "   ⏳ Install dependencies first, then run migrations\n";
}
echo "\n";

// Step 9: Check if frontend assets are built
echo "9. Checking frontend assets...\n";
if (!is_dir('public/build')) {
    echo "   ❌ Frontend assets not built\n";
    echo "   📦 Please run: npm run build\n";
} else {
    echo "   ✅ Frontend assets exist\n";
}
echo "\n";

echo "🎯 Setup Instructions:\n";
echo "=====================\n";
echo "1. Install PHP dependencies: composer install\n";
echo "2. Install Node.js dependencies: npm install\n";
echo "3. Generate application key: php artisan key:generate\n";
echo "4. Create database: CREATE DATABASE tasktrack;\n";
echo "5. Run migrations: php artisan migrate\n";
echo "6. Build frontend: npm run build\n";
echo "7. Start server: php artisan serve\n";
echo "\n";

echo "🔧 Quick Setup Commands:\n";
echo "=======================\n";
echo "composer install && npm install && php artisan key:generate && php artisan migrate && npm run build && php artisan serve\n";
echo "\n";

echo "📞 If you encounter issues:\n";
echo "==========================\n";
echo "1. Check PHP version (8.1+ recommended)\n";
echo "2. Ensure MySQL is running\n";
echo "3. Verify database credentials in .env\n";
echo "4. Check file permissions\n";
echo "5. Run: php artisan config:clear && php artisan cache:clear\n";
echo "\n";

echo "🚀 Your TaskTrack app should be ready to run!\n";
?>
