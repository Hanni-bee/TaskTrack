# Troubleshooting Guide

This guide helps you resolve common issues when setting up and running TaskTrack.

## Quick Fixes

### 1. Clear All Caches
```bash
php artisan optimize:clear
php artisan config:clear
php artisan cache:clear
php artisan view:clear
php artisan route:clear
```

### 2. Rebuild Frontend Assets
```bash
npm run build
```

### 3. Check Database Connection
```bash
php test_auth.php
```

## Common Issues

### Authentication Problems

#### Issue: Can't log in or register
**Symptoms:**
- Login/register forms don't work
- Getting "Unauthorized" errors
- CSRF token errors

**Solutions:**
1. Clear browser cookies and cache
2. Check `.env` file has correct database credentials
3. Ensure Sanctum is properly configured
4. Verify CSRF tokens are being sent

```bash
# Test authentication endpoints
curl -X POST http://localhost:8000/api/register \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123","password_confirmation":"password123"}'
```

#### Issue: Session not persisting
**Solutions:**
1. Check `config/session.php` configuration
2. Verify `APP_KEY` is set in `.env`
3. Clear session storage: `php artisan session:table`

### Database Issues

#### Issue: Database connection failed
**Solutions:**
1. Check database credentials in `.env`
2. Ensure database server is running
3. Verify database exists
4. Check database permissions

```bash
# Test database connection
php artisan tinker
DB::connection()->getPdo();
```

#### Issue: Migration errors
**Solutions:**
1. Drop and recreate database
2. Run migrations fresh: `php artisan migrate:fresh`
3. Check migration files for syntax errors

### Frontend Issues

#### Issue: React components not loading
**Symptoms:**
- Blank page
- JavaScript errors in console
- Components not rendering

**Solutions:**
1. Check if assets are built: `npm run build`
2. Clear browser cache
3. Check for JavaScript errors in browser console
4. Verify Vite configuration

#### Issue: API calls failing
**Symptoms:**
- Tasks not loading
- Can't add/edit tasks
- Network errors

**Solutions:**
1. Check API routes: `php artisan route:list`
2. Verify CORS configuration
3. Check authentication middleware
4. Test API endpoints directly

### Development Environment Issues

#### Issue: Laragon/XAMPP not working
**Solutions:**
1. Check if Apache/Nginx is running
2. Verify PHP version (8.2+)
3. Check if MySQL/PostgreSQL is running
4. Verify virtual host configuration

#### Issue: Node.js/npm problems
**Solutions:**
1. Update Node.js to latest LTS version
2. Clear npm cache: `npm cache clean --force`
3. Delete `node_modules` and reinstall: `rm -rf node_modules package-lock.json && npm install`

## Performance Issues

### Slow Loading
**Solutions:**
1. Enable OPcache in PHP
2. Use Redis for caching
3. Optimize database queries
4. Enable asset compression

### Memory Issues
**Solutions:**
1. Increase PHP memory limit in `php.ini`
2. Optimize database queries
3. Use pagination for large datasets

## Security Issues

### CSRF Token Errors
**Solutions:**
1. Ensure CSRF tokens are included in requests
2. Check `config/sanctum.php` configuration
3. Verify session configuration

### Authentication Bypass
**Solutions:**
1. Check middleware configuration
2. Verify route protection
3. Test authentication endpoints

## Debugging

### Enable Debug Mode
Set `APP_DEBUG=true` in `.env` for detailed error messages.

### Check Logs
```bash
# Laravel logs
tail -f storage/logs/laravel.log

# PHP error log
tail -f /var/log/php_errors.log
```

### Browser Developer Tools
1. Open browser developer tools (F12)
2. Check Console for JavaScript errors
3. Check Network tab for failed requests
4. Check Application tab for storage issues

## Testing

### Run Tests
```bash
# Run all tests
php artisan test

# Run specific test
php artisan test --filter=AuthenticationTest
```

### Manual Testing Checklist
- [ ] User registration works
- [ ] User login works
- [ ] User logout works
- [ ] Tasks can be created
- [ ] Tasks can be edited
- [ ] Tasks can be deleted
- [ ] Task status can be toggled
- [ ] Search functionality works
- [ ] Filter functionality works
- [ ] Calendar view works
- [ ] Responsive design works on mobile

## Getting Help

If you're still experiencing issues:

1. **Check the logs** for specific error messages
2. **Search existing issues** in the repository
3. **Create a new issue** with:
   - Detailed description of the problem
   - Steps to reproduce
   - Error messages and logs
   - Your environment details (OS, PHP version, etc.)

## Environment Checklist

Before reporting issues, ensure:

- [ ] PHP 8.2 or higher installed
- [ ] Composer installed
- [ ] Node.js 18 or higher installed
- [ ] npm installed
- [ ] Database server running
- [ ] Database credentials correct
- [ ] All dependencies installed
- [ ] Environment file configured
- [ ] Application key generated
- [ ] Migrations run successfully
- [ ] Frontend assets built
