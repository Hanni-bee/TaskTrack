
import { Task } from '../types';

interface StatusBadgeProps {
  status: Task['status'];
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const statusConfig = {
    pending: { 
      label: 'Pending', 
      className: 'status-pending',
      icon: (
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    in_progress: { 
      label: 'In Progress', 
      className: 'status-progress',
      icon: (
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    done: { 
      label: 'Completed', 
      className: 'status-done',
      icon: (
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      )
    }
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <span className={`status-badge ${config.className} flex items-center gap-1`}>
      {config.icon}
      {config.label}
    </span>
  );
}
