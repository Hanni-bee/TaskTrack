import React from 'react';
import { TaskCard } from './TaskCard';
import { useTasks, useToasts, useTaskFilters } from '../hooks';
import { Task } from '../types';

export function AllTasks() {
  const { tasks, loading, toggleTaskStatus, deleteTask } = useTasks();
  const { toasts, addToast, removeToast } = useToasts();
  const { filterTasks, query, setQuery, filter, setFilter, sortBy, setSortBy, sortOrder, setSortOrder } = useTaskFilters();
  
  const [editingTask, setEditingTask] = React.useState<Task | null>(null);
  const [formLoading, setFormLoading] = React.useState(false);

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
  };

  const filteredTasks = filterTasks(tasks);

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="glass p-6 mb-6 animate-fade-in">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-4 items-center">
            <input
              type="text"
              placeholder="Search tasks..."
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
            <p className="text-slate-400">
              {query ? 'Try adjusting your search or filters.' : 'You have no tasks yet.'}
            </p>
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
    </div>
  );
}
