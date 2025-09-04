# 🚀 TaskTrack New Device Setup Guide

## ⚠️ **Why Your App Doesn't Run on New Devices**

When you copy Laravel project files to a new device, several critical components are missing:

### **Missing Components:**
1. ❌ **Dependencies** (`vendor/` and `node_modules/` directories)
2. ❌ **Environment Configuration** (`.env` file)
3. ❌ **Application Key** (encryption key)
4. ❌ **Database Setup** (tables and data)
5. ❌ **Frontend Assets** (compiled React files)

## 🔧 **Complete Setup Process**

### **Step 1: Prerequisites**
Make sure you have these installed on your new device:
- ✅ **PHP 8.1+** with required extensions
- ✅ **Composer** (PHP package manager)
- ✅ **Node.js 16+** and npm
- ✅ **MySQL** or MariaDB
- ✅ **Git** (optional, for version control)

### **Step 2: Run the Setup Script**
```bash
# Navigate to your project directory
cd TaskTrack-main

# Run the setup script
php setup_new_device.php
```

This script will:
- ✅ Check PHP version and extensions
- ✅ Create `.env` file if missing
- ✅ Verify dependencies
- ✅ Test database connection
- ✅ Provide setup instructions

### **Step 3: Install Dependencies**
```bash
# Install PHP dependencies
composer install

# Install Node.js dependencies
npm install
```

### **Step 4: Configure Environment**
```bash
# Generate application key
php artisan key:generate

# Clear configuration cache
php artisan config:clear
php artisan cache:clear
```

### **Step 5: Set Up Database**
```sql
-- Create the database
CREATE DATABASE tasktrack;

-- Create user (optional)
CREATE USER 'tasktrack'@'localhost' IDENTIFIED BY 'tasktrack';
GRANT ALL PRIVILEGES ON tasktrack.* TO 'tasktrack'@'localhost';
FLUSH PRIVILEGES;
```

### **Step 6: Run Migrations**
```bash
# Run database migrations
php artisan migrate

# Run the new migration for categories and priority
php run_migration.php
```

### **Step 7: Build Frontend**
```bash
# Build React assets
npm run build
```

### **Step 8: Start the Server**
```bash
# Start Laravel development server
php artisan serve
```

## 🎯 **One-Command Setup**

Run this single command for complete setup:
```bash
composer install && npm install && php artisan key:generate && php artisan migrate && npm run build && php artisan serve
```

## 🔍 **Common Issues & Solutions**

### **Issue 1: "Class not found" errors**
**Solution:**
```bash
composer install
composer dump-autoload
```

### **Issue 2: "APP_KEY not set" error**
**Solution:**
```bash
php artisan key:generate
```

### **Issue 3: Database connection failed**
**Solutions:**
1. Check if MySQL is running
2. Verify database credentials in `.env`
3. Create database: `CREATE DATABASE tasktrack;`

### **Issue 4: "Module not found" in React**
**Solution:**
```bash
npm install
npm run build
```

### **Issue 5: Permission errors**
**Solution:**
```bash
# On Linux/Mac
chmod -R 755 storage bootstrap/cache

# On Windows (run as administrator)
icacls storage /grant Everyone:F /T
icacls bootstrap/cache /grant Everyone:F /T
```

## 📋 **Required Files Checklist**

Make sure these files exist in your project:

### **Essential Files:**
- ✅ `composer.json` - PHP dependencies
- ✅ `package.json` - Node.js dependencies
- ✅ `.env` - Environment configuration
- ✅ `artisan` - Laravel command line tool

### **Configuration Files:**
- ✅ `config/database.php` - Database settings
- ✅ `config/app.php` - Application settings
- ✅ `vite.config.ts` - Build configuration

### **Source Code:**
- ✅ `app/` - Laravel application code
- ✅ `resources/js/` - React components
- ✅ `resources/css/` - Stylesheets
- ✅ `database/migrations/` - Database schema

## 🗄️ **Database Configuration**

Your `.env` file should contain:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=tasktrack
DB_USERNAME=root
DB_PASSWORD=your_password
```

## 🔧 **Testing Your Setup**

Run these commands to verify everything works:

```bash
# Test database connection
php test_connection.php

# Test authentication flow
php test_auth_flow.php

# Verify setup
php verify_setup.php
```

## 🚀 **Quick Start Commands**

### **For Development:**
```bash
# Start development server
php artisan serve

# Watch for changes (in another terminal)
npm run dev
```

### **For Production:**
```bash
# Build for production
npm run build

# Start production server
php artisan serve --host=0.0.0.0 --port=8000
```

## 📱 **Access Your App**

After setup, access your app at:
- **Local:** http://localhost:8000
- **Network:** http://your-ip-address:8000

## 🎉 **Success Indicators**

Your TaskTrack app is working when you see:
- ✅ Laravel welcome page or login screen
- ✅ No error messages in browser console
- ✅ Database tables created successfully
- ✅ React components loading properly
- ✅ Authentication working (signup/login)

## 📞 **Getting Help**

If you still have issues:

1. **Run the setup script:** `php setup_new_device.php`
2. **Check error logs:** `storage/logs/laravel.log`
3. **Verify PHP extensions:** `php -m`
4. **Test database:** `php test_connection.php`
5. **Clear caches:** `php artisan config:clear && php artisan cache:clear`

## 🎯 **Summary**

The key to running TaskTrack on a new device is:
1. **Install dependencies** (composer install, npm install)
2. **Configure environment** (.env file, APP_KEY)
3. **Set up database** (create database, run migrations)
4. **Build frontend** (npm run build)
5. **Start server** (php artisan serve)

**Your TaskTrack app should now work perfectly on any device! 🚀**
