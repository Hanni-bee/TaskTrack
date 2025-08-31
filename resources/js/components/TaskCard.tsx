
import { Task } from '../types';
import { StatusBadge } from './StatusBadge';
import { formatDate, isOverdue, getDaysUntilDue } from '../utils';

interface TaskCardProps {
  task: Task;
  onToggleStatus: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  index: number;
  isKanban?: boolean;
}

export function TaskCard({ task, onToggleStatus, onEdit, onDelete, index }: TaskCardProps) {
  const isOverdueTask = task.due_at && isOverdue(task.due_at) && task.status !== 'done';
  const daysUntilDue = task.due_at ? getDaysUntilDue(task.due_at) : null;

  const getDueDateColor = () => {
    if (!task.due_at) return 'text-slate-400';
    if (isOverdueTask) return 'text-red-400';
    if (daysUntilDue === 0) return 'text-yellow-400';
    if (daysUntilDue && daysUntilDue <= 3) return 'text-orange-400';
    return 'text-slate-400';
  };

  const getDueDateText = () => {
    if (!task.due_at) return null;
    if (isOverdueTask) return 'Overdue';
    if (daysUntilDue === 0) return 'Due today';
    if (daysUntilDue === 1) return 'Due tomorrow';
    if (daysUntilDue && daysUntilDue <= 7) return `Due in ${daysUntilDue} days`;
    return formatDate(task.due_at);
  };

  return (
    <div 
      className={`task-card animate-slide-up`}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4 flex-1">
          <button
            onClick={() => onToggleStatus(task.id, task.status)}
            className={`w-6 h-6 rounded-full border-2 transition flex-shrink-0 mt-1 ${
              task.status === 'done' 
                ? 'border-green-500 bg-green-500' 
                : 'border-slate-600 hover:border-green-500'
            }`}
            aria-label={task.status === 'done' ? 'Mark as pending' : 'Mark as done'}
          >
            {task.status === 'done' && (
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>
          
          <div className="flex-1 min-w-0">
            <h3 className={`font-semibold text-lg mb-2 ${
              task.status === 'done' ? 'line-through text-slate-500' : 'text-slate-100'
            }`}>
              {task.title}
            </h3>
            
            {task.description && (
              <p className={`text-sm mb-3 ${
                task.status === 'done' ? 'text-slate-500' : 'text-slate-400'
              }`}>
                {task.description}
              </p>
            )}
            
            <div className="flex items-center gap-3 flex-wrap">
              <StatusBadge status={task.status} />
              
              {task.due_at && (
                <span className={`text-sm ${getDueDateColor()}`}>
                  <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {getDueDateText()}
                </span>
              )}
              
              <span className="text-xs text-slate-500">
                Created {formatDate(task.created_at)}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 ml-4">
          <button 
            onClick={() => onEdit(task)}
            className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
            aria-label="Edit task"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          
          <button 
            onClick={() => onDelete(task.id)}
            className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
            aria-label="Delete task"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
