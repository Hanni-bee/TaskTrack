# TaskTrack - Localhost Cross-Device Testing Guide

## 🚀 Quick Setup for Testing on Other Devices

Your TaskTrack app is configured for localhost testing across multiple devices on the same network.

### **Prerequisites**
- All devices must be on the **same WiFi network**
- Main device runs the Laravel server
- Other devices access via main device's IP address

## 📱 Step-by-Step Setup

### **1. On Your Main Device (Server)**

```bash
# Navigate to project directory
cd TaskTrack-main

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Run migrations
php artisan migrate

# Install dependencies
npm install

# Build frontend assets
npm run build

# Start Laravel server (accessible on network)
php artisan serve --host=0.0.0.0 --port=8000
```

### **2. Find Your Main Device IP Address**

**Windows:**
```cmd
ipconfig
# Look for "IPv4 Address" (e.g., 192.168.1.100)
```

**Mac/Linux:**
```bash
ifconfig | grep inet
# Look for your local network IP (192.168.x.x)
```

### **3. On Other Devices**

Open browser and navigate to:
```
http://[YOUR_MAIN_DEVICE_IP]:8000
```

**Example:**
```
http://192.168.1.100:8000
```

## ✅ All Features Available on Other Devices

### **🔐 Authentication**
- **Registration** - Creates Basic subscription automatically
- **Login/Logout** - Full session management
- **Password reset** - Email-based recovery

### **📋 Task Management**
- **CRUD operations** - Create, read, update, delete tasks
- **Subscription limits** - Basic (10 tasks) vs Premium (unlimited)
- **Premium features** - Categories, priorities, reminders, notes
- **Status management** - Pending, In Progress, Done

### **🎨 UI/UX Features**
- **Theme toggle** - Light/Dark/System themes
- **Responsive design** - Optimized for all screen sizes
- **Mobile gestures** - Swipe to complete/delete
- **Drag & drop** - Task reordering
- **Kanban board** - Visual task management

### **📊 Advanced Features**
- **Analytics dashboard** - Task metrics and insights
- **Advanced filters** - Smart search and filtering
- **Time tracking** - Start/stop timers per task
- **Task templates** - Pre-built and custom templates
- **Notifications** - Browser push notifications

### **💳 Subscription System**
- **Plan comparison** - Basic vs Premium features
- **Usage tracking** - Tasks used vs limit
- **Upgrade flow** - Premium subscription activation
- **Feature gating** - Access control based on plan

## 📱 Device-Specific Features

### **Desktop/Laptop**
- **Full feature set** - All components available
- **Keyboard shortcuts** - Enhanced productivity
- **Large screen layouts** - Optimized spacing

### **Tablet**
- **Touch-optimized** - Larger touch targets
- **Responsive grids** - Adaptive layouts
- **Swipe gestures** - Natural interactions

### **Mobile Phone**
- **Bottom navigation** - Thumb-friendly navigation
- **Floating action button** - Quick task creation
- **Pull-to-refresh** - Native mobile patterns
- **Haptic feedback** - Touch response

## 🔧 Network Configuration

### **Firewall Settings**
Ensure port 8000 is open on your main device:

**Windows Firewall:**
```cmd
netsh advfirewall firewall add rule name="Laravel Dev Server" dir=in action=allow protocol=TCP localport=8000
```

**Mac:**
```bash
# Usually no configuration needed
```

### **Router Configuration**
- **No special setup required** for local network testing
- All devices use same WiFi network
- Server accessible via internal IP

## 🧪 Testing Checklist

### **Basic Functionality**
- [ ] Registration creates Basic subscription
- [ ] Login works with created credentials
- [ ] Task creation respects subscription limits
- [ ] Task CRUD operations work properly
- [ ] Theme switching persists across sessions

### **Mobile Features**
- [ ] Responsive design on small screens
- [ ] Touch gestures work (swipe, tap, drag)
- [ ] Bottom navigation accessible
- [ ] Floating action button functional
- [ ] Pull-to-refresh works

### **Advanced Features**
- [ ] Kanban board drag & drop
- [ ] Analytics dashboard loads data
- [ ] Notifications request permission
- [ ] Time tracking starts/stops correctly
- [ ] Task templates create tasks

### **Subscription System**
- [ ] Basic users see 10-task limit
- [ ] Premium features are gated
- [ ] Upgrade flow displays correctly
- [ ] Usage tracking updates in real-time

## 🚨 Troubleshooting

### **Can't Access from Other Device**
1. **Check IP address** - Ensure using correct internal IP
2. **Verify server running** - `php artisan serve --host=0.0.0.0`
3. **Test firewall** - Temporarily disable to test
4. **Same network** - Confirm all devices on same WiFi

### **Features Not Working**
1. **Clear browser cache** on testing device
2. **Check console errors** in browser dev tools
3. **Verify migrations** ran successfully
4. **Rebuild assets** with `npm run build`

### **Database Issues**
1. **Run migrations** - `php artisan migrate`
2. **Check database file** - Ensure SQLite file exists
3. **Reset database** - `php artisan migrate:fresh` if needed

## 📊 Expected Performance

### **Loading Times**
- **Initial load**: 2-3 seconds
- **Navigation**: Instant (SPA)
- **API requests**: <500ms on local network

### **Responsiveness**
- **Theme switching**: Smooth transitions
- **Drag operations**: 60fps animations
- **Touch interactions**: Immediate feedback

## 🎯 Ready for Testing

Your TaskTrack application is fully configured for localhost testing across multiple devices. All enhanced features including subscription management, advanced UI components, and mobile optimizations will work seamlessly on any device connected to your local network.

**Start the server and begin testing! 🚀**
