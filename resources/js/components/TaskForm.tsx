import React from 'react';
import { Task, TaskForm as TaskFormType } from '../types';
import { useFormValidation } from '../hooks';
import { useAuthContext } from '../AuthContext';

interface TaskFormProps {
  task?: Task;
  onSubmit: (data: TaskFormType) => void;
  onCancel: () => void;
  loading?: boolean;
}

export function TaskForm({ task, onSubmit, onCancel, loading = false }: TaskFormProps) {
  const initialValues: TaskFormType = {
    title: task?.title || '',
    description: task?.description || '',
    category: task?.category || 'general',
    priority: task?.priority || 'medium',
    tags: task?.tags || [],
    due_at: task?.due_at ? task.due_at.slice(0, 16) : '',
    status: task?.status || 'pending',
    reminder_at: task?.reminder_at ? task.reminder_at.slice(0, 16) : '',
    notes: task?.notes || '',
  };

  const validationSchema = (values: TaskFormType) => {
    const errors: Partial<Record<keyof TaskFormType, string>> = {};
    
    if (!values.title.trim()) {
      errors.title = 'Task title is required';
    } else if (values.title.trim().length < 3) {
      errors.title = 'Task title must be at least 3 characters';
    }
    
    if (values.description && values.description.length > 500) {
      errors.description = 'Description must be less than 500 characters';
    }
    
    if (values.due_at && new Date(values.due_at) < new Date()) {
      errors.due_at = 'Due date cannot be in the past';
    }

    if (values.reminder_at && new Date(values.reminder_at) < new Date()) {
      errors.reminder_at = 'Reminder date cannot be in the past';
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(values);
    }
  };

  const handleInputChange = (name: keyof TaskFormType, value: string | string[]) => {
    handleChange(name, value);
  };

  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
      e.preventDefault();
      const newTag = e.currentTarget.value.trim();
      if (!values.tags?.includes(newTag)) {
        handleInputChange('tags', [...(values.tags || []), newTag]);
        e.currentTarget.value = '';
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    handleInputChange('tags', values.tags?.filter(tag => tag !== tagToRemove) || []);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block font-medium mb-2 text-slate-200">
          Task Title *
        </label>
        <input 
          className={`input-modern ${errors.title && touched.title ? 'border-red-500' : ''}`}
          name="title"
          type="text"
          value={values.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          onBlur={() => handleBlur('title')}
          placeholder="Enter task title"
          disabled={loading}
        />
        {errors.title && touched.title && (
          <p className="text-red-400 text-sm mt-1">{errors.title}</p>
        )}
      </div>
      
      <div>
        <label className="block font-medium mb-2 text-slate-200">
          Description
        </label>
        <textarea
          className={`input-modern min-h-[100px] resize-none ${errors.description && touched.description ? 'border-red-500' : ''}`}
          name="description"
          value={values.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          onBlur={() => handleBlur('description')}
          placeholder="Enter task description (optional)"
          disabled={loading}
        />
        {errors.description && touched.description && (
          <p className="text-red-400 text-sm mt-1">{errors.description}</p>
        )}
        <p className="text-xs text-slate-500 mt-1">
          {values.description?.length || 0}/500 characters
        </p>
      </div>

      <div>
        <label className="block font-medium mb-2 text-slate-200">
          Notes
        </label>
        <textarea
          className="input-modern min-h-[80px] resize-none"
          name="notes"
          value={values.notes}
          onChange={(e) => handleInputChange('notes', e.target.value)}
          placeholder="Enter additional notes (optional)"
          disabled={loading}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-medium mb-2 text-slate-200">
            Category
          </label>
          <select 
            className="input-modern"
            name="category"
            value={values.category}
            onChange={(e) => handleInputChange('category', e.target.value as Task['category'])}
            disabled={loading}
          >
            <option value="general">General</option>
            <option value="work">Work</option>
            <option value="personal">Personal</option>
            <option value="health">Health</option>
            <option value="finance">Finance</option>
            <option value="education">Education</option>
            <option value="shopping">Shopping</option>
            <option value="travel">Travel</option>
          </select>
        </div>
        
        <div>
          <label className="block font-medium mb-2 text-slate-200">
            Priority
          </label>
          <select 
            className="input-modern"
            name="priority"
            value={values.priority}
            onChange={(e) => handleInputChange('priority', e.target.value as Task['priority'])}
            disabled={loading}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block font-medium mb-2 text-slate-200">
          Tags
        </label>
        <input 
          className="input-modern"
          type="text"
          placeholder="Press Enter to add tags"
          onKeyDown={handleTagInput}
          disabled={loading}
        />
        {values.tags && values.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {values.tags.map((tag, index) => (
              <span 
                key={index}
                className="inline-flex items-center gap-1 px-2 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-xs"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="hover:text-blue-300 transition-colors"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-medium mb-2 text-slate-200">
            Due Date
          </label>
          <input 
            className={`input-modern ${errors.due_at && touched.due_at ? 'border-red-500' : ''}`}
            name="due_at"
            type="datetime-local"
            value={values.due_at}
            onChange={(e) => handleInputChange('due_at', e.target.value)}
            onBlur={() => handleBlur('due_at')}
            disabled={loading}
          />
          {errors.due_at && touched.due_at && (
            <p className="text-red-400 text-sm mt-1">{errors.due_at}</p>
          )}
        </div>
        
        <div>
          <label className="block font-medium mb-2 text-slate-200">
            Reminder
          </label>
          <input 
            className={`input-modern ${errors.reminder_at && touched.reminder_at ? 'border-red-500' : ''}`}
            name="reminder_at"
            type="datetime-local"
            value={values.reminder_at}
            onChange={(e) => handleInputChange('reminder_at', e.target.value)}
            onBlur={() => handleBlur('reminder_at')}
            disabled={loading}
          />
          {errors.reminder_at && touched.reminder_at && (
            <p className="text-red-400 text-sm mt-1">{errors.reminder_at}</p>
          )}
        </div>

        <div>
          <label className="block font-medium mb-2 text-slate-200">
            Status
          </label>
          <select 
            className="input-modern"
            name="status"
            value={values.status}
            onChange={(e) => handleInputChange('status', e.target.value as Task['status'])}
            disabled={loading}
          >
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Completed</option>
          </select>
        </div>
      </div>
      
      <div className="flex gap-3 pt-4">
        <button 
          type="button" 
          onClick={onCancel}
          className="btn-secondary flex-1"
          disabled={loading}
        >
          Cancel
        </button>
        <button 
          type="submit" 
          className="btn-primary flex-1"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <span className="spinner mr-2" />
              {task ? 'Updating...' : 'Adding...'}
            </span>
          ) : (
            task ? 'Update Task' : 'Add Task'
          )}
        </button>
      </div>
    </form>
  );
}
