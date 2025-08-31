import React from 'react';
import { PriorityOption } from '../types';

interface PriorityBadgeProps {
  priority: string;
  className?: string;
}

const priorityOptions: Record<string, PriorityOption> = {
  high: {
    value: 'high',
    label: 'High',
    color: 'red',
    icon: 'M13 10V3L4 14h7v7l9-11h-7z'
  },
  medium: {
    value: 'medium',
    label: 'Medium',
    color: 'yellow',
    icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
  },
  low: {
    value: 'low',
    label: 'Low',
    color: 'green',
    icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
  }
};

export function PriorityBadge({ priority, className = '' }: PriorityBadgeProps) {
  const option = priorityOptions[priority] || priorityOptions.medium;
  
  const colorClasses = {
    red: 'bg-red-500/10 text-red-400 border-red-500/20',
    yellow: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    green: 'bg-green-500/10 text-green-400 border-green-500/20'
  };

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all duration-200 hover:scale-105 ${colorClasses[option.color as keyof typeof colorClasses]} ${className}`}>
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={option.icon} />
      </svg>
      <span>{option.label}</span>
    </div>
  );
}
