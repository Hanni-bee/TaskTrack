// Task Management Types
export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'done';
  due_at?: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  category?: string;
  priority?: 'low' | 'medium' | 'high';
  reminder_at?: string;
  notes?: string;
  notified_overdue?: boolean;
  notified_reminder?: boolean;
  total_time?: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string;
  created_at: string;
  updated_at: string;
  subscription_type: 'basic' | 'premium';
  subscription_expires_at?: string;
  task_limit: number;
  can_set_reminders: boolean;
  can_use_categories: boolean;
  can_export_data: boolean;
}

export interface Subscription {
  subscription_type: 'basic' | 'premium';
  subscription_expires_at?: string;
  task_limit: number;
  current_tasks: number;
  remaining_tasks: number;
  can_set_reminders: boolean;
  can_use_categories: boolean;
  can_export_data: boolean;
  is_premium: boolean;
}

// Form Types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface TaskForm {
  title: string;
  description?: string;
  due_at?: string;
  status: 'pending' | 'in_progress' | 'done';
  category?: string;
  priority: 'low' | 'medium' | 'high';
  reminder_at?: string;
  notes?: string;
}

// UI Types
export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id?: number;
  message: string;
  type: ToastType;
}

export type TaskFilter = 'all' | 'pending' | 'in_progress' | 'done';
export type TaskSortBy = 'created_at' | 'due_at' | 'title';
export type SortOrder = 'asc' | 'desc';

// API Response Types
export interface ValidationErrors {
  [key: string]: string[];
}

export interface FormState<T> {
  data: T;
  errors: ValidationErrors;
  processing: boolean;
}

export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  errors?: ValidationErrors;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

// React types for Laravel environment
declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

// Enhanced feature types
export interface TimeEntry {
  id: string;
  taskId: string;
  startTime: Date;
  endTime?: Date;
  duration: number;
  description?: string;
}

export interface TaskTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  estimatedDuration?: number;
  tags: string[];
  icon: string;
}

export interface DragItem {
  id: string;
  index: number;
  type: 'task';
}

export type Theme = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

// Component Props Types
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: any;
}

export interface ToastProps {
  message: string;
  type?: ToastType;
  onClose: () => void;
}

export interface StatusBadgeProps {
  status: Task['status'];
}

export interface TaskCardProps {
  task: Task;
  onToggleStatus: (id: number, status: Task['status']) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
}
