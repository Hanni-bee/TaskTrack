# 🚀 TaskTrack Quick Setup Guide

## Prerequisites (Install These First)

### 1. PHP 8.1+ with Extensions
```bash
# Windows (using Chocolatey)
choco install php

# Or download from: https://windows.php.net/download/
# Required extensions: mbstring, openssl, pdo, tokenizer, xml, ctype, json, bcmath
```

### 2. Composer (PHP Package Manager)
```bash
# Download from: https://getcomposer.org/download/
# Or via Chocolatey:
choco install composer
```

### 3. Node.js 16+ and npm
```bash
# Download from: https://nodejs.org/
# Or via Chocolatey:
choco install nodejs

# Verify installation:
node --version
npm --version
```

## 🎯 5-Minute Setup Commands

### Step 1: Install Dependencies
```bash
# Navigate to project folder
cd "C:\Users\Admin\Downloads\TaskTrack-main (1)"

# Install PHP dependencies
composer install

# Install JavaScript dependencies
npm install
```

### Step 2: Environment Setup
```bash
# Copy environment file
copy .env.example .env

# Generate application key
php artisan key:generate
```

### Step 3: Database Setup
```bash
# Run database migrations (creates SQLite database)
php artisan migrate
```

### Step 4: Build & Run
```bash
# Build frontend assets
npm run build

# Start the server (accessible on network)
php artisan serve --host=0.0.0.0 --port=8000
```

## 🌐 Access Your App

### Local Access:
- **http://localhost:8000**
- **http://127.0.0.1:8000**

### Network Access (Other Devices):
- **http://[YOUR-IP]:8000**
- Find your IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
- Example: `http://192.168.1.100:8000`

## ✅ What Works Immediately

### Authentication System
- ✅ User registration with automatic Basic subscription
- ✅ Secure login/logout with Laravel Sanctum
- ✅ Password validation and error handling

### Task Management
- ✅ Create, edit, delete tasks (10 task limit for Basic users)
- ✅ Task status tracking (pending, in progress, done)
- ✅ Due dates and priority levels
- ✅ Search and filtering capabilities

### Premium Features (Mock Payment)
- ✅ Upgrade to Premium (free - no payment required)
- ✅ Unlimited tasks (1000 limit)
- ✅ Categories and reminders
- ✅ Data export functionality
- ✅ **Advanced Analytics Dashboard** (Premium only)

### Modern UI Features
- ✅ Dark/light theme switching
- ✅ Glass morphism design with gradients
- ✅ Responsive mobile-first design
- ✅ Drag & drop Kanban board
- ✅ Beautiful calendar with task integration
- ✅ Real-time notifications
- ✅ Touch gestures and swipe actions

### Security & Performance
- ✅ CORS protection for local network access
- ✅ Security headers middleware
- ✅ Error sanitization
- ✅ Task pagination (50 per page)
- ✅ Safe localStorage with error handling

## 🔧 Troubleshooting

### Common Issues:

**"composer not found"**
```bash
# Install Composer first:
# https://getcomposer.org/download/
```

**"php artisan command not found"**
```bash
# Make sure PHP is in your PATH
# Or use full path: C:\php\php.exe artisan serve
```

**"npm command not found"**
```bash
# Install Node.js: https://nodejs.org/
```

**"Permission denied" errors**
```bash
# Run terminal as Administrator (Windows)
# Or use sudo (Mac/Linux)
```

**Can't access from other devices**
```bash
# Check Windows Firewall settings
# Allow port 8000 through firewall
# Use --host=0.0.0.0 flag when serving
```

## 📱 Testing Premium Features

1. **Register** a new account (gets Basic plan)
2. **Navigate** to `/subscription`
3. **Click** "Upgrade to Premium" (free upgrade)
4. **Access** Analytics at `/analytics`
5. **Test** categories, reminders, unlimited tasks

## 🎉 You're Ready!

Your TaskTrack app is now running with:
- ✅ Complete task management system
- ✅ Premium subscription features
- ✅ Advanced analytics dashboard
- ✅ Modern responsive UI
- ✅ Cross-device compatibility
- ✅ Security hardening

**Access from any device on your network using your computer's IP address!**
