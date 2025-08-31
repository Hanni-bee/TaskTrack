import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import '../css/app.css';

// Import our new components and utilities
import { Task, TaskForm as TaskFormType } from './types';
import type { Toast as ToastType } from './types';
import { csrf, getCsrfToken, apiRequest, formatDate, isOverdue, getDaysUntilDue } from './utils';
import { useTasks, useToasts, useTaskFilters, useModal, useFormValidation, useKeyboardShortcuts } from './hooks';
import { TaskCard } from './components/TaskCard';
import { StatusBadge } from './components/StatusBadge';
import { TaskForm } from './components/TaskForm';
import { AllTasks } from './components/AllTasks';
import { Calendar } from './components/Calendar';
import { SubscriptionCard } from './components/SubscriptionCard';
import { SubscriptionPage } from './components/SubscriptionPage';
import { AuthProvider, useAuthContext } from './AuthContext';

// --- AUTH COMPONENTS ---
function RequireAuth({ children }: { children: React.ReactElement }) {
  const { user, loading } = useAuthContext();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass p-8 rounded-2xl">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-center text-slate-400">Checking session...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// --- UI COMPONENTS ---
function Toast({ message, type = 'info', onClose }: { message: string; type?: 'success' | 'error' | 'info' | 'warning'; onClose: () => void }) {
  React.useEffect(() => { 
    const id = setTimeout(onClose, 4000); 
    return () => clearTimeout(id); 
  }, [onClose]);

  const bgColor = type === 'success' ? 'bg-green-500/10 border-green-500/30' : 
                  type === 'error' ? 'bg-red-500/10 border-red-500/30' : 
                  'bg-blue-500/10 border-blue-500/30';
  
  const textColor = type === 'success' ? 'text-green-400' : 
                   type === 'error' ? 'text-red-400' : 
                   'text-blue-400';

  return (
    <div className="toast animate-fade-in">
      <div className={`glass p-4 rounded-xl border ${bgColor}`}>
        <p className={`font-medium ${textColor}`}>{message}</p>
      </div>
    </div>
  );
}

function Modal({ isOpen, onClose, title, children }: { 
  isOpen: boolean; 
  onClose: () => void; 
  title: string; 
  children: React.ReactNode; 
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-100">{title}</h2>
            <button 
              onClick={onClose}
              className="text-slate-400 hover:text-slate-200 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

// --- LAYOUT COMPONENTS ---
function Sidebar() {
  const { logout } = useAuthContext();
  const location = useLocation();

  const navItems = [
    { name: 'My Day', path: '/', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
    { name: 'All Tasks', path: '/tasks', icon: 'M3 4h18M3 12h18M3 20h18' },
    { name: 'Calendar', path: '/calendar', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
  ];

  return (
    <aside className="fixed top-0 left-0 h-full z-40 w-64 glass border-r border-slate-700/50">
      <div className="flex flex-col h-full">
        <div className="p-6 border-b border-slate-700/50">
          <h1 className="text-2xl font-bold text-slate-100">TaskTrack</h1>
          <p className="text-slate-400 text-sm mt-1">Your personal task manager</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map(item => (
            <a
              key={item.name}
              href={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                location.pathname === item.path
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
              </svg>
              <span className="font-medium">{item.name}</span>
            </a>
          ))}
        </nav>
        
        <div className="p-4 border-t border-slate-700/50">
          <button 
            onClick={logout} 
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}

function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <div className="gradient-background" />
      <Sidebar />
      <div className="ml-64">
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="gradient-background" />
      <div className="relative z-10 w-full max-w-md animate-fade-in">
        {children}
      </div>
    </div>
  );
}

// --- PAGES ---
function Login() {
  const { addToast } = useToasts();
  const { login, loading, error } = useAuthContext();

  const initialValues = { email: '', password: '' };
  const validationSchema = (values: typeof initialValues) => {
    const errors: Partial<Record<keyof typeof initialValues, string>> = {};
    if (!values.email) errors.email = 'Email is required';
    if (!values.password) errors.password = 'Password is required';
    if (values.email && !/\S+@\S+\.\S+/.test(values.email)) errors.email = 'Please enter a valid email';
    return errors;
  };

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validate
  } = useFormValidation(initialValues, validationSchema);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    
    try {
      await login(values);
      addToast({ message: 'Welcome back!', type: 'success' });
    } catch (error) {
      addToast({ message: error instanceof Error ? error.message : 'Login failed', type: 'error' });
    }
  }

  return (
    <AuthLayout>
      <div className="glass p-8 rounded-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 text-slate-100">Welcome Back</h1>
          <p className="text-slate-400">Sign in to continue to TaskTrack</p>
        </div>
        
        <form className="space-y-6" onSubmit={onSubmit}>
          <div>
            <label className="block font-medium mb-2 text-slate-200">Email Address</label>
            <input 
              className={`input-modern ${errors.email && touched.email ? 'border-red-500' : ''}`}
              name="email"
              type="email"
              value={values.email}
              onChange={(e) => handleChange('email', e.target.value)}
              onBlur={() => handleBlur('email')}
              placeholder="you@example.com"
              disabled={loading}
            />
            {errors.email && touched.email && (
              <p className="text-red-400 text-sm mt-1">{errors.email}</p>
            )}
          </div>
          
          <div>
            <label className="block font-medium mb-2 text-slate-200">Password</label>
            <input 
              className={`input-modern ${errors.password && touched.password ? 'border-red-500' : ''}`}
              name="password"
              type="password"
              value={values.password}
              onChange={(e) => handleChange('password', e.target.value)}
              onBlur={() => handleBlur('password')}
              placeholder="••••••••"
              disabled={loading}
            />
            {errors.password && touched.password && (
              <p className="text-red-400 text-sm mt-1">{errors.password}</p>
            )}
          </div>
          
          <button className="btn-primary w-full h-12 text-lg font-semibold" disabled={loading}>
            {loading ? <span className="spinner" /> : 'Sign In'}
          </button>
        </form>
        
        <div className="mt-8 text-center">
          <p className="text-slate-400">
            No account?{' '}
            <a className="text-blue-400 hover:text-blue-300 font-medium transition-colors" href="/register">Create one</a>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}

function Register() {
  const { addToast } = useToasts();
  const { register, loading, error } = useAuthContext();

  const initialValues = { name: '', email: '', password: '', password_confirmation: '' };
  const validationSchema = (values: typeof initialValues) => {
    const errors: Partial<Record<keyof typeof initialValues, string>> = {};
    if (!values.name) errors.name = 'Name is required';
    if (!values.email) errors.email = 'Email is required';
    if (!values.password) errors.password = 'Password is required';
    if (values.email && !/\S+@\S+\.\S+/.test(values.email)) errors.email = 'Please enter a valid email';
    if (values.password && values.password.length < 6) errors.password = 'Password must be at least 6 characters';
    if (values.password && values.password_confirmation && values.password !== values.password_confirmation) {
      errors.password_confirmation = 'Passwords do not match';
    }
    return errors;
  };

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validate
  } = useFormValidation(initialValues, validationSchema);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    
    try {
      await register(values);
      addToast({ message: 'Account created successfully!', type: 'success' });
    } catch (error) {
      addToast({ message: error instanceof Error ? error.message : 'Registration failed', type: 'error' });
    }
  }

  return (
    <AuthLayout>
      <div className="glass p-8 rounded-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 text-slate-100">Create an Account</h1>
          <p className="text-slate-400">Join TaskTrack and boost your productivity</p>
        </div>
        
        <form className="space-y-6" onSubmit={onSubmit}>
          <div>
            <label className="block font-medium mb-2 text-slate-200">Full Name</label>
            <input 
              className={`input-modern ${errors.name && touched.name ? 'border-red-500' : ''}`}
              name="name"
              type="text"
              value={values.name}
              onChange={(e) => handleChange('name', e.target.value)}
              onBlur={() => handleBlur('name')}
              placeholder="Juan dela Cruz"
              disabled={loading}
            />
            {errors.name && touched.name && (
              <p className="text-red-400 text-sm mt-1">{errors.name}</p>
            )}
          </div>
          
          <div>
            <label className="block font-medium mb-2 text-slate-200">Email Address</label>
            <input 
              className={`input-modern ${errors.email && touched.email ? 'border-red-500' : ''}`}
              name="email"
              type="email"
              value={values.email}
              onChange={(e) => handleChange('email', e.target.value)}
              onBlur={() => handleBlur('email')}
              placeholder="you@example.com"
              disabled={loading}
            />
            {errors.email && touched.email && (
              <p className="text-red-400 text-sm mt-1">{errors.email}</p>
            )}
          </div>
          
          <div>
            <label className="block font-medium mb-2 text-slate-200">Password</label>
            <input 
              className={`input-modern ${errors.password && touched.password ? 'border-red-500' : ''}`}
              name="password"
              type="password"
              value={values.password}
              onChange={(e) => handleChange('password', e.target.value)}
              onBlur={() => handleBlur('password')}
              placeholder="Min. 6 characters"
              disabled={loading}
            />
            {errors.password && touched.password && (
              <p className="text-red-400 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <div>
            <label className="block font-medium mb-2 text-slate-200">Confirm Password</label>
            <input 
              className={`input-modern ${errors.password_confirmation && touched.password_confirmation ? 'border-red-500' : ''}`}
              name="password_confirmation"
              type="password"
              value={values.password_confirmation}
              onChange={(e) => handleChange('password_confirmation', e.target.value)}
              onBlur={() => handleBlur('password_confirmation')}
              placeholder="Confirm your password"
              disabled={loading}
            />
            {errors.password_confirmation && touched.password_confirmation && (
              <p className="text-red-400 text-sm mt-1">{errors.password_confirmation}</p>
            )}
          </div>
          
          <button className="btn-primary w-full h-12 text-lg font-semibold" disabled={loading}>
            {loading ? <span className="spinner" /> : 'Create Account'}
          </button>
        </form>
        
        <p className="mt-8 text-center text-slate-400">
          Already have an account?{' '}
          <a className="text-blue-400 hover:text-blue-300 font-medium transition-colors" href="/login">Sign in</a>
        </p>
      </div>
    </AuthLayout>
  );
}

function Dashboard() {
  const { tasks, loading, addTask, updateTask, deleteTask, toggleTaskStatus } = useTasks();
  const { toasts, addToast, removeToast } = useToasts();
  const { filterTasks, query, setQuery, filter, setFilter, sortBy, setSortBy, sortOrder, setSortOrder } = useTaskFilters();
  const { user } = useAuthContext(); // Get user from auth context
  
  // Modal states
  const addModal = useModal();
  const editModal = useModal();
  const [editingTask, setEditingTask] = React.useState<Task | null>(null);
  const [currentView, setCurrentView] = useState<'dashboard' | 'all-tasks' | 'calendar' | 'subscription'>('dashboard');
  const [formLoading, setFormLoading] = React.useState(false);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    'ctrl+n': () => addModal.open(),
    'ctrl+k': () => {
      const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement;
      searchInput?.focus();
    },
    'escape': () => {
      addModal.close();
      editModal.close();
    }
  });

  const handleAddTask = async (taskData: TaskFormType) => {
    setFormLoading(true);
    try {
      await addTask(taskData);
      addToast({ message: 'Task added successfully!', type: 'success' });
      addModal.close();
    } catch (error) {
      addToast({ message: error instanceof Error ? error.message : 'Failed to add task', type: 'error' });
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateTask = async (taskData: TaskFormType) => {
    if (!editingTask) return;
    
    setFormLoading(true);
    try {
      await updateTask(editingTask.id, taskData);
      addToast({ message: 'Task updated successfully!', type: 'success' });
      editModal.close();
      setEditingTask(null);
    } catch (error) {
      addToast({ message: error instanceof Error ? error.message : 'Failed to update task', type: 'error' });
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteTask = async (id: number) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    
    try {
      await deleteTask(id);
      addToast({ message: 'Task deleted successfully!', type: 'success' });
    } catch (error) {
      addToast({ message: error instanceof Error ? error.message : 'Failed to delete task', type: 'error' });
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    editModal.open();
  };

  const filteredTasks = filterTasks(tasks);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";

  return (
    <MainLayout>
      {/* Toast Notifications */}
      {toasts.map(toast => (
        <Toast 
          key={toast.id} 
          message={toast.message} 
          type={toast.type} 
          onClose={() => removeToast(toast.id!)} 
        />
      ))}

      {/* Add Task Modal */}
      <Modal isOpen={addModal.isOpen} onClose={addModal.close} title="Add New Task">
        <TaskForm 
          onSubmit={handleAddTask}
          onCancel={addModal.close}
          loading={formLoading}
        />
      </Modal>

      {/* Edit Task Modal */}
      <Modal isOpen={editModal.isOpen} onClose={editModal.close} title="Edit Task">
        {editingTask && (
          <TaskForm 
            task={editingTask}
            onSubmit={handleUpdateTask}
            onCancel={editModal.close}
            loading={formLoading}
          />
        )}
      </Modal>

      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <h1 className="text-4xl font-bold text-slate-100">{greeting}, {user?.name || 'User'}.</h1>
        <p className="text-lg mt-2 text-slate-400">Run your day or your day will run you.</p>
      </div>

      {/* Controls */}
      <div className="glass p-6 mb-6 animate-fade-in">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-4 items-center">
            <button 
              onClick={addModal.open}
              className="btn-primary"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Task
            </button>
            
            <input
              type="text"
              placeholder="Search tasks... (Ctrl+K)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="input-modern w-64"
            />
          </div>
          
          <div className="flex gap-3 items-center">
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value as any)}
              className="input-modern w-32"
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Completed</option>
            </select>
            
            <select 
              value={`${sortBy}-${sortOrder}`} 
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                setSortBy(field as any);
                setSortOrder(order as any);
              }}
              className="input-modern w-40"
            >
              <option value="created_at-desc">Newest First</option>
              <option value="created_at-asc">Oldest First</option>
              <option value="due_at-asc">Due Date (Earliest)</option>
              <option value="due_at-desc">Due Date (Latest)</option>
              <option value="title-asc">Title A-Z</option>
              <option value="title-desc">Title Z-A</option>
            </select>
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-4">
        {loading && (
          <div className="text-center py-12">
            <div className="spinner mx-auto mb-4"></div>
            <p className="text-slate-400">Loading tasks...</p>
          </div>
        )}

        {!loading && filteredTasks.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-slate-700/50 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-slate-200 mb-2">No tasks found</h3>
            <p className="text-slate-400 mb-4">
              {query ? 'Try adjusting your search or filters.' : 'Get started by adding your first task!'}
            </p>
            {!query && (
              <button onClick={addModal.open} className="btn-primary">
                Add Your First Task
              </button>
            )}
          </div>
        )}

        {filteredTasks.map((task, index) => (
          <TaskCard
            key={task.id}
            task={task}
            onToggleStatus={toggleTaskStatus}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
            index={index}
          />
        ))}
      </div>
    </MainLayout>
  );
}

// --- APP ROUTER ---
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<RequireAuth><Dashboard /></RequireAuth>} />
          <Route path="/tasks" element={<RequireAuth><AllTasks /></RequireAuth>} />
          <Route path="/calendar" element={<RequireAuth><Calendar /></RequireAuth>} />
          <Route path="/subscription" element={<RequireAuth><SubscriptionPage /></RequireAuth>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

const el = document.getElementById('root');
if (el) createRoot(el).render(<React.StrictMode><App /></React.StrictMode>);
