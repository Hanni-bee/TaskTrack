# 🚀 TaskTrack Server Setup Guide

## ⚠️ **Why Login Doesn't Work**

The login issue occurs because you need **TWO servers running**:
1. **Laravel Backend** (API server)
2. **React Frontend** (Development server)

## 🔧 **Correct Server Setup**

### **Option 1: Production Mode (Recommended)**
This serves everything from Laravel server:

```bash
# 1. Build React assets
npm run build

# 2. Start Laravel server
php artisan serve
```

**Access at:** `http://localhost:8000`

### **Option 2: Development Mode**
This runs both servers for hot reloading:

```bash
# Terminal 1: Start Laravel backend
php artisan serve

# Terminal 2: Start React development server
npm run dev
```

**Access at:** `http://localhost:5173`

## 🎯 **Step-by-Step Setup**

### **Step 1: Check Your Current Setup**
```bash
# Navigate to project
cd TaskTrack-main

# Check if dependencies are installed
ls vendor/
ls node_modules/
```

### **Step 2: Install Dependencies (if needed)**
```bash
# Install PHP dependencies
composer install

# Install Node.js dependencies
npm install
```

### **Step 3: Configure Environment**
```bash
# Generate application key
php artisan key:generate

# Clear caches
php artisan config:clear
php artisan cache:clear
```

### **Step 4: Set Up Database**
```bash
# Run migrations
php artisan migrate

# Run the new migration for categories
php run_migration.php
```

### **Step 5: Choose Your Server Mode**

#### **Mode A: Production (Single Server)**
```bash
# Build React assets
npm run build

# Start Laravel server
php artisan serve
```
**URL:** `http://localhost:8000`

#### **Mode B: Development (Two Servers)**
```bash
# Terminal 1: Laravel backend
php artisan serve

# Terminal 2: React frontend
npm run dev
```
**URL:** `http://localhost:5173`

## 🔍 **Troubleshooting Login Issues**

### **Issue 1: "Cannot connect to API"**
**Solution:**
- Make sure Laravel server is running on port 8000
- Check that API routes are accessible at `http://localhost:8000/api`

### **Issue 2: "CSRF token mismatch"**
**Solution:**
```bash
# Clear Laravel caches
php artisan config:clear
php artisan cache:clear
php artisan route:clear
```

### **Issue 3: "Database connection failed"**
**Solution:**
```bash
# Test database connection
php test_connection.php

# Check .env file configuration
cat .env | grep DB_
```

### **Issue 4: "React components not loading"**
**Solution:**
```bash
# Rebuild React assets
npm run build

# Or restart development server
npm run dev
```

## 🎯 **Testing Your Setup**

### **Test 1: Check Laravel Server**
```bash
# Start Laravel server
php artisan serve

# Visit in browser
http://localhost:8000
```
**Expected:** Laravel welcome page or TaskTrack login

### **Test 2: Check API Endpoints**
```bash
# Test API endpoints
curl http://localhost:8000/api/user
```
**Expected:** JSON response (may be 401 if not authenticated)

### **Test 3: Test Database**
```bash
# Test database connection
php test_connection.php

# Test authentication flow
php test_auth_flow.php
```

## 📱 **Access URLs**

### **Production Mode:**
- **Main App:** `http://localhost:8000`
- **API:** `http://localhost:8000/api/*`
- **Authentication:** `http://localhost:8000/api/login`

### **Development Mode:**
- **Main App:** `http://localhost:5173`
- **API:** `http://localhost:8000/api/*` (proxied)
- **Hot Reload:** Enabled

## 🔧 **Server Configuration Files**

### **Vite Config (vite.config.ts)**
```typescript
server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
        '/api': {
            target: 'http://localhost:8000',
            changeOrigin: true,
            secure: false
        },
        '/sanctum': {
            target: 'http://localhost:8000',
            changeOrigin: true,
            secure: false
        }
    }
}
```

### **Laravel Config (.env)**
```env
APP_URL=http://localhost:8000
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=tasktrack
DB_USERNAME=root
DB_PASSWORD=
```

## 🚀 **Quick Start Commands**

### **For Production:**
```bash
npm run build && php artisan serve
```

### **For Development:**
```bash
# Terminal 1
php artisan serve

# Terminal 2
npm run dev
```

### **For Testing:**
```bash
# Test everything
php setup_new_device.php
php test_connection.php
php test_auth_flow.php
```

## 🎉 **Success Indicators**

Your servers are working correctly when:

### **Laravel Server (Port 8000):**
- ✅ Shows TaskTrack login page
- ✅ API endpoints respond
- ✅ Database connection works

### **React Dev Server (Port 5173):**
- ✅ Shows React app
- ✅ Hot reload works
- ✅ API calls succeed

### **Login Works When:**
- ✅ Both servers are running
- ✅ Database is accessible
- ✅ API routes are working
- ✅ CSRF tokens are generated

## 📞 **Common Issues & Solutions**

### **Port Already in Use:**
```bash
# Kill process on port 8000
lsof -ti:8000 | xargs kill -9

# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

### **Permission Denied:**
```bash
# Fix permissions
chmod -R 755 storage bootstrap/cache
```

### **Module Not Found:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## 🎯 **Recommended Setup**

**For beginners:** Use **Production Mode** (single server)
```bash
npm run build && php artisan serve
```
Then visit: `http://localhost:8000`

**For developers:** Use **Development Mode** (two servers)
```bash
# Terminal 1: php artisan serve
# Terminal 2: npm run dev
```
Then visit: `http://localhost:5173`

**Your TaskTrack app should now work perfectly with proper server setup! 🚀**
