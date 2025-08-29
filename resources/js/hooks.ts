import React from 'react';
import { Task, Toast, TaskFilter, TaskSortBy, SortOrder } from './types';
import { apiRequest, getLocalStorage, setLocalStorage, sortTasks, debounce } from './utils';

// Custom hook for managing tasks
export function useTasks() {
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const loadTasks = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiRequest<Task[]>('/api/tasks');
      setTasks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  const addTask = React.useCallback(async (taskData: Partial<Task>) => {
    try {
      const newTask = await apiRequest<Task>('/api/tasks', {
        method: 'POST',
        body: JSON.stringify(taskData),
      });
      setTasks(prev => [...prev, newTask]);
      return newTask;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to add task');
    }
  }, []);

  const updateTask = React.useCallback(async (id: number, taskData: Partial<Task>) => {
    try {
      const updatedTask = await apiRequest<Task>(`/api/tasks/${id}`, {
        method: 'PUT',
        body: JSON.stringify(taskData),
      });
      setTasks(prev => prev.map(task => task.id === id ? updatedTask : task));
      return updatedTask;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update task');
    }
  }, []);

  const deleteTask = React.useCallback(async (id: number) => {
    try {
      await apiRequest(`/api/tasks/${id}`, { method: 'DELETE' });
      setTasks(prev => prev.filter(task => task.id !== id));
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to delete task');
    }
  }, []);

  const toggleTaskStatus = React.useCallback(async (id: number, currentStatus: Task['status']) => {
    const newStatus = currentStatus === 'done' ? 'pending' : 'done';
    await updateTask(id, { status: newStatus });
  }, [updateTask]);

  React.useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  return {
    tasks,
    loading,
    error,
    loadTasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
  };
}

// Custom hook for managing toasts
export function useToasts() {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const addToast = React.useCallback((toast: Toast) => {
    const id = Date.now();
    setToasts(prev => [...prev, { ...toast, id }]);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, []);

  const removeToast = React.useCallback((id: number) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  return { toasts, addToast, removeToast };
}

// Custom hook for task filtering and sorting
export function useTaskFilters() {
  const [query, setQuery] = React.useState('');
  const [filter, setFilter] = React.useState<TaskFilter>('all');
  const [sortBy, setSortBy] = React.useState<TaskSortBy>('created_at');
  const [sortOrder, setSortOrder] = React.useState<SortOrder>('desc');

  // Load filters from localStorage
  React.useEffect(() => {
    const savedFilter = getLocalStorage<TaskFilter>('taskFilter', 'all');
    const savedSortBy = getLocalStorage<TaskSortBy>('taskSortBy', 'created_at');
    const savedSortOrder = getLocalStorage<SortOrder>('taskSortOrder', 'desc');
    
    setFilter(savedFilter);
    setSortBy(savedSortBy);
    setSortOrder(savedSortOrder);
  }, []);

  // Save filters to localStorage
  React.useEffect(() => {
    setLocalStorage('taskFilter', filter);
  }, [filter]);

  React.useEffect(() => {
    setLocalStorage('taskSortBy', sortBy);
  }, [sortBy]);

  React.useEffect(() => {
    setLocalStorage('taskSortOrder', sortOrder);
  }, [sortOrder]);

  const debouncedSetQuery = React.useMemo(
    () => debounce((value: string) => setQuery(value), 300),
    []
  );

  const filterTasks = React.useCallback((tasks: Task[]) => {
    let filtered = tasks.filter(task => {
      const matchesQuery = task.title.toLowerCase().includes(query.toLowerCase()) ||
                          (task.description && task.description.toLowerCase().includes(query.toLowerCase()));
      const matchesFilter = filter === 'all' || task.status === filter;
      return matchesQuery && matchesFilter;
    });

    return sortTasks(filtered, sortBy, sortOrder);
  }, [query, filter, sortBy, sortOrder]);

  return {
    query,
    setQuery: debouncedSetQuery,
    filter,
    setFilter,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    filterTasks,
  };
}

// Custom hook for authentication
export { useAuthContext as useAuth } from './AuthContext';

// Custom hook for modals
export function useModal() {
  const [isOpen, setIsOpen] = React.useState(false);

  const open = React.useCallback(() => setIsOpen(true), []);
  const close = React.useCallback(() => setIsOpen(false), []);
  const toggle = React.useCallback(() => setIsOpen(prev => !prev), []);

  return { isOpen, open, close, toggle };
}

// Custom hook for form validation
export function useFormValidation<T extends Record<string, any>>(
  initialValues: T,
  validationSchema: (values: T) => Partial<Record<keyof T, string>>
) {
  const [values, setValues] = React.useState<T>(initialValues);
  const [errors, setErrors] = React.useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = React.useState<Partial<Record<keyof T, boolean>>>({});

  const handleChange = React.useCallback((name: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }));
    if (touched[name]) {
      const validationErrors = validationSchema({ ...values, [name]: value });
      setErrors(prev => ({ ...prev, [name]: validationErrors[name] }));
    }
  }, [values, touched, validationSchema]);

  const handleBlur = React.useCallback((name: keyof T) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    const validationErrors = validationSchema(values);
    setErrors(prev => ({ ...prev, [name]: validationErrors[name] }));
  }, [values, validationSchema]);

  const validate = React.useCallback(() => {
    const validationErrors = validationSchema(values);
    setErrors(validationErrors);
    setTouched(Object.keys(values).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
    return Object.keys(validationErrors).length === 0;
  }, [values, validationSchema]);

  const reset = React.useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validate,
    reset,
    setValues,
  };
}

// Custom hook for keyboard shortcuts
export function useKeyboardShortcuts(
  shortcuts: Record<string, () => void>
): void {
  React.useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const key = event.key.toLowerCase();
      const ctrl = event.ctrlKey || event.metaKey;
      
      // Common shortcuts
      if (ctrl && key === 'k') {
        event.preventDefault();
        shortcuts['ctrl+k']?.();
      }
      
      if (ctrl && key === 'n') {
        event.preventDefault();
        shortcuts['ctrl+n']?.();
      }
      
      if (key === 'escape') {
        shortcuts['escape']?.();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
}
