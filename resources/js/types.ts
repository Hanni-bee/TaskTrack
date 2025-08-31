// Task Management Types
export interface Task {
  id: number;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'done';
  due_at?: string;
  created_at: string;
  updated_at: string;
  user_id: number;
  category?: string;
  priority: 'low' | 'medium' | 'high';
  reminder_at?: string;
  notes?: string;
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
export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

// Component Props Types
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
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
