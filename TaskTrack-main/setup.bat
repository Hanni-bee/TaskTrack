@echo off
echo 🚀 Setting up TaskTrack...

REM Check if PHP is installed
php --version >nul 2>&1
if errorlevel 1 (
    echo ❌ PHP is not installed. Please install PHP 8.2 or higher.
    pause
    exit /b 1
)

REM Check if Composer is installed
composer --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Composer is not installed. Please install Composer.
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js 18 or higher.
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm is not installed. Please install npm.
    pause
    exit /b 1
)

echo ✅ Prerequisites check passed!

REM Install PHP dependencies
echo 📦 Installing PHP dependencies...
composer install

REM Install Node.js dependencies
echo 📦 Installing Node.js dependencies...
npm install

REM Copy environment file if it doesn't exist
if not exist .env (
    echo 📝 Creating .env file...
    copy .env.example .env
    echo ⚠️  Please edit .env file with your database credentials before continuing.
    echo    You can run this script again after configuring the database.
    pause
    exit /b 0
)

REM Generate application key
echo 🔑 Generating application key...
php artisan key:generate

REM Run database migrations
echo 🗄️  Running database migrations...
php artisan migrate

REM Build frontend assets
echo 🔨 Building frontend assets...
npm run build

echo ✅ Setup complete!
echo.
echo 🎉 TaskTrack is ready to use!
echo 📝 Start the development server with: php artisan serve
echo 🌐 Visit: http://localhost:8000
echo.
echo 📚 For more information, check the README.md file.
pause
