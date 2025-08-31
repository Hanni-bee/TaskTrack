
import React from 'react';
import { Task } from '../types';
import { StatusBadge } from './StatusBadge';
import { CategoryBadge } from './CategoryBadge';
import { PriorityBadge } from './PriorityBadge';
import { formatDate, isOverdue, getDaysUntilDue } from '../utils';

interface TaskCardProps {
  task: Task;
  onToggleStatus: (id: number, status: Task['status']) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  index: number;
}

export function TaskCard({ task, onToggleStatus, onEdit, onDelete, index }: TaskCardProps) {
  const isTaskOverdue = task.due_at && isOverdue(task.due_at);
  const daysUntilDue = task.due_at ? getDaysUntilDue(task.due_at) : null;

  return (
    <div 
      className="glass p-6 rounded-2xl border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 hover:shadow-xl hover:shadow-slate-900/20 group animate-fade-in"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-start gap-3 mb-3">
            <h3 className="text-lg font-semibold text-slate-100 group-hover:text-white transition-colors">
              {task.title}
            </h3>
            <div className="flex items-center gap-2">
              <CategoryBadge category={task.category} />
              <PriorityBadge priority={task.priority} />
            </div>
          </div>
          
          {task.description && (
            <p className="text-slate-400 mb-4 leading-relaxed">
              {task.description}
            </p>
          )}

          {task.tags && task.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {task.tags.map((tag, tagIndex) => (
                <span 
                  key={tagIndex}
                  className="inline-flex items-center px-2 py-1 bg-slate-700/50 text-slate-300 border border-slate-600/50 rounded-full text-xs hover:bg-slate-600/50 transition-colors"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center gap-4 text-sm text-slate-400">
            {task.due_at && (
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className={isTaskOverdue ? 'text-red-400 font-medium' : ''}>
                  {formatDate(task.due_at)}
                  {isTaskOverdue && ' (Overdue)'}
                  {!isTaskOverdue && daysUntilDue !== null && daysUntilDue <= 3 && ` (${daysUntilDue} days left)`}
                </span>
              </div>
            )}
            
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{formatDate(task.created_at)}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 ml-4">
          <StatusBadge status={task.status} />
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggleStatus(task.id, task.status)}
            className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 rounded-lg transition-all duration-200 hover:scale-105"
            title={task.status === 'done' ? 'Mark as pending' : 'Mark as done'}
          >
            {task.status === 'done' ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(task)}
            className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all duration-200 hover:scale-105"
            title="Edit task"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          
          <button
            onClick={() => onDelete(task.id)}
            className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200 hover:scale-105"
            title="Delete task"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
