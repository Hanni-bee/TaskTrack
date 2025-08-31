# TaskTrack - Personal Task Management App

A modern, responsive task management application built with Laravel 11 and React. Features user authentication, task creation, editing, filtering, and a calendar view.

## Features

- 🔐 **User Authentication**: Secure login/register with email and password
- 📝 **Task Management**: Create, edit, delete, and organize tasks
- 🎯 **Status Tracking**: Track task progress (pending, in progress, done)
- 📅 **Calendar View**: Visual calendar with task indicators
- 🔍 **Search & Filter**: Find tasks quickly with search and status filters
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile
- ⚡ **Real-time Updates**: Instant task updates without page refresh
- 🎨 **Modern UI**: Beautiful dark theme with glass morphism effects

## Tech Stack

- **Backend**: Laravel 11 (PHP)
- **Frontend**: React 18 with TypeScript
- **Database**: MySQL/PostgreSQL
- **Authentication**: Laravel Sanctum
- **Styling**: Tailwind CSS
- **Build Tool**: Vite

## Prerequisites

- PHP 8.2 or higher
- Composer
- Node.js 18 or higher
- MySQL/PostgreSQL database
- Laragon (recommended for Windows) or similar local development environment

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd TaskTrack-main
```

### 2. Install PHP Dependencies

```bash
composer install
```

### 3. Install Node.js Dependencies

```bash
npm install
```

### 4. Environment Setup

Copy the environment file and configure your database:

```bash
cp .env.example .env
```

Edit `.env` file with your database credentials:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=tasktrack
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

### 5. Generate Application Key

```bash
php artisan key:generate
```

### 6. Run Database Migrations

```bash
php artisan migrate
```

### 7. Build Frontend Assets

```bash
npm run build
```

### 8. Start the Development Server

```bash
php artisan serve
```

The application will be available at `http://localhost:8000`

## Usage

### First Time Setup

1. Visit `http://localhost:8000`
2. Click "Create one" to register a new account
3. Enter your name, email, and password
4. You'll be automatically logged in and redirected to the dashboard

### Using the Application

- **Dashboard**: View all your tasks with search and filter options
- **All Tasks**: Dedicated page for comprehensive task management
- **Calendar**: Visual calendar showing tasks by date
- **Add Task**: Click the "Add Task" button to create new tasks
- **Edit Task**: Click the edit icon on any task card
- **Delete Task**: Click the delete icon and confirm
- **Toggle Status**: Click the status badge to change task status

## Troubleshooting

### Common Issues

#### 1. Database Connection Error

```bash
# Test database connection
php test_auth.php
```

Make sure your database credentials are correct in `.env`

#### 2. Authentication Issues

- Clear browser cookies and cache
- Check that CSRF tokens are being sent correctly
- Verify Sanctum configuration in `config/sanctum.php`

#### 3. Frontend Build Issues

```bash
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

#### 4. API Endpoints Not Working

Check that your routes are properly configured:

```bash
# List all routes
php artisan route:list
```

### Development Commands

```bash
# Start development server
php artisan serve

# Watch for frontend changes
npm run dev

# Build for production
npm run build

# Run tests
php artisan test

# Clear all caches
php artisan optimize:clear
```

## File Structure

```
TaskTrack-main/
├── app/
│   ├── Http/Controllers/
│   │   ├── Api/TaskController.php
│   │   └── Auth/
│   ├── Models/
│   └── Providers/
├── resources/
│   ├── js/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── AuthContext.tsx
│   │   ├── app.tsx
│   │   ├── types.ts
│   │   └── utils.ts
│   └── views/
├── routes/
│   ├── api.php
│   └── auth.php
└── database/
    └── migrations/
```

## API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login
- `POST /api/logout` - User logout
- `GET /api/user` - Get current user

### Tasks
- `GET /api/tasks` - Get all tasks for authenticated user
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/{id}` - Update task
- `DELETE /api/tasks/{id}` - Delete task

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open-sourced software licensed under the [MIT license](LICENSE).

## Support

If you encounter any issues or have questions, please:

1. Check the troubleshooting section above
2. Search existing issues
3. Create a new issue with detailed information about your problem

## Changelog

### Version 1.0.0
- Initial release
- User authentication system
- Task management functionality
- Calendar view
- Responsive design
- Search and filter capabilities
