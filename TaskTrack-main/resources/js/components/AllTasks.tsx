import React from 'react';
import { TaskCard } from './TaskCard';
import { TaskForm } from './TaskForm';
import { useTasks, useToasts, useTaskFilters, useModal } from '../hooks';
import { Task, TaskForm as TaskFormType } from '../types';

export function AllTasks() {
  const { tasks, loading, toggleTaskStatus, deleteTask, updateTask, addTask } = useTasks();
  const { toasts, addToast, removeToast } = useToasts();
  const { filterTasks, query, setQuery, filter, setFilter, sortBy, setSortBy, sortOrder, setSortOrder } = useTaskFilters();
  
  // Modal states
  const addModal = useModal();
  const editModal = useModal();
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
    editModal.open();
  };

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

  const filteredTasks = filterTasks(tasks);

  return (
    <div className="space-y-4">
      {/* Toast Notifications */}
      {toasts.map(toast => (
        <div key={toast.id} className="toast animate-fade-in">
          <div className={`glass p-4 rounded-xl border ${
            toast.type === 'success' ? 'bg-green-500/10 border-green-500/30' : 
            toast.type === 'error' ? 'bg-red-500/10 border-red-500/30' : 
            'bg-blue-500/10 border-blue-500/30'
          }`}>
            <p className={`font-medium ${
              toast.type === 'success' ? 'text-green-400' : 
              toast.type === 'error' ? 'text-red-400' : 
              'text-blue-400'
            }`}>{toast.message}</p>
          </div>
        </div>
      ))}

      {/* Add Task Modal */}
      {addModal.isOpen && (
        <div className="modal-overlay" onClick={addModal.close}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-slate-100">Add New Task</h2>
                <button 
                  onClick={addModal.close}
                  className="text-slate-400 hover:text-slate-200 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <TaskForm 
                onSubmit={handleAddTask}
                onCancel={addModal.close}
                loading={formLoading}
              />
            </div>
          </div>
        </div>
      )}

      {/* Edit Task Modal */}
      {editModal.isOpen && editingTask && (
        <div className="modal-overlay" onClick={editModal.close}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-slate-100">Edit Task</h2>
                <button 
                  onClick={editModal.close}
                  className="text-slate-400 hover:text-slate-200 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <TaskForm 
                task={editingTask}
                onSubmit={handleUpdateTask}
                onCancel={editModal.close}
                loading={formLoading}
              />
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <h1 className="text-4xl font-bold text-slate-100 mb-2">All Tasks</h1>
        <p className="text-lg text-slate-400">Manage and organize all your tasks</p>
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
    </div>
  );
}
