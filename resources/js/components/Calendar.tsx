import React, { useState, useMemo } from 'react';
import { Task } from '../types';

interface CalendarProps {
  tasks: Task[];
  onDateSelect?: (date: Date) => void;
  onTaskClick?: (task: Task) => void;
}

export function Calendar({ tasks, onDateSelect, onTaskClick }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const today = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Get first day of month and days in month
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDayOfWeek = firstDayOfMonth.getDay();

  // Get tasks by date
  const tasksByDate = useMemo(() => {
    const taskMap = new Map<string, Task[]>();
    tasks.forEach(task => {
      if (task.due_at) {
        const dateKey = new Date(task.due_at).toDateString();
        if (!taskMap.has(dateKey)) {
          taskMap.set(dateKey, []);
        }
        taskMap.get(dateKey)!.push(task);
      }
    });
    return taskMap;
  }, [tasks]);

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(currentYear, currentMonth, day);
    setSelectedDate(clickedDate);
    onDateSelect?.(clickedDate);
  };

  const isToday = (day: number) => {
    return today.getDate() === day && 
           today.getMonth() === currentMonth && 
           today.getFullYear() === currentYear;
  };

  const isSelected = (day: number) => {
    if (!selectedDate) return false;
    return selectedDate.getDate() === day && 
           selectedDate.getMonth() === currentMonth && 
           selectedDate.getFullYear() === currentYear;
  };

  const getTasksForDay = (day: number) => {
    const date = new Date(currentYear, currentMonth, day);
    return tasksByDate.get(date.toDateString()) || [];
  };

  const renderCalendarDays = () => {
    const days = [];
    
    // Empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 p-1"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayTasks = getTasksForDay(day);
      const hasOverdue = dayTasks.some(task => 
        new Date(task.due_at!) < today && task.status !== 'done'
      );
      const hasCompleted = dayTasks.some(task => task.status === 'done');
      const hasPending = dayTasks.some(task => task.status !== 'done');

      days.push(
        <div
          key={day}
          onClick={() => handleDateClick(day)}
          className={`
            h-24 p-1 border border-slate-200/20 cursor-pointer transition-all duration-200
            hover:bg-slate-100/10 hover:border-blue-400/40 hover:scale-105
            ${isToday(day) ? 'bg-blue-500/20 border-blue-400/60 ring-2 ring-blue-400/30' : ''}
            ${isSelected(day) ? 'bg-purple-500/20 border-purple-400/60' : ''}
            ${hasOverdue ? 'bg-red-500/10 border-red-400/40' : ''}
            relative overflow-hidden group
          `}
        >
          {/* Glass effect overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
          
          {/* Day number */}
          <div className={`
            text-sm font-semibold mb-1 relative z-10
            ${isToday(day) ? 'text-blue-300' : 'text-slate-300'}
            ${isSelected(day) ? 'text-purple-300' : ''}
            ${hasOverdue ? 'text-red-300' : ''}
          `}>
            {day}
          </div>

          {/* Task indicators */}
          <div className="space-y-0.5 relative z-10">
            {dayTasks.slice(0, 3).map((task, index) => (
              <div
                key={task.id}
                onClick={(e) => {
                  e.stopPropagation();
                  onTaskClick?.(task);
                }}
                className={`
                  text-xs px-1 py-0.5 rounded truncate cursor-pointer
                  transition-all duration-200 hover:scale-105
                  ${task.status === 'done' 
                    ? 'bg-green-500/30 text-green-200 border border-green-400/40' 
                    : task.priority === 'high'
                    ? 'bg-red-500/30 text-red-200 border border-red-400/40'
                    : task.priority === 'medium'
                    ? 'bg-yellow-500/30 text-yellow-200 border border-yellow-400/40'
                    : 'bg-blue-500/30 text-blue-200 border border-blue-400/40'
                  }
                `}
                title={task.title}
              >
                {task.title}
              </div>
            ))}
            
            {dayTasks.length > 3 && (
              <div className="text-xs text-slate-400 px-1">
                +{dayTasks.length - 3} more
              </div>
            )}
          </div>

          {/* Status indicators */}
          <div className="absolute top-1 right-1 flex gap-1">
            {hasCompleted && (
              <div className="w-2 h-2 rounded-full bg-green-400/60"></div>
            )}
            {hasPending && (
              <div className="w-2 h-2 rounded-full bg-blue-400/60"></div>
            )}
            {hasOverdue && (
              <div className="w-2 h-2 rounded-full bg-red-400/60 animate-pulse"></div>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="glass p-6 rounded-2xl backdrop-blur-xl border border-slate-200/20">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          {monthNames[currentMonth]} {currentYear}
        </h2>
        
        <div className="flex gap-2">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 rounded-xl bg-slate-100/10 hover:bg-slate-100/20 border border-slate-200/20 
                     hover:border-blue-400/40 transition-all duration-200 hover:scale-105"
          >
            <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-4 py-2 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/40 
                     text-blue-300 text-sm font-medium transition-all duration-200 hover:scale-105"
          >
            Today
          </button>
          
          <button
            onClick={() => navigateMonth('next')}
            className="p-2 rounded-xl bg-slate-100/10 hover:bg-slate-100/20 border border-slate-200/20 
                     hover:border-blue-400/40 transition-all duration-200 hover:scale-105"
          >
            <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-400/60"></div>
          <span className="text-slate-400">Completed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-400/60"></div>
          <span className="text-slate-400">Pending</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-400/60 animate-pulse"></div>
          <span className="text-slate-400">Overdue</span>
        </div>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map(day => (
          <div key={day} className="h-8 flex items-center justify-center text-sm font-medium text-slate-400">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {renderCalendarDays()}
      </div>

      {/* Selected date info */}
      {selectedDate && (
        <div className="mt-6 p-4 rounded-xl bg-slate-100/10 border border-slate-200/20">
          <h3 className="text-lg font-semibold text-slate-200 mb-2">
            {selectedDate.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </h3>
          
          {getTasksForDay(selectedDate.getDate()).length > 0 ? (
            <div className="space-y-2">
              {getTasksForDay(selectedDate.getDate()).map(task => (
                <div
                  key={task.id}
                  onClick={() => onTaskClick?.(task)}
                  className="p-2 rounded-lg bg-slate-100/10 border border-slate-200/20 
                           hover:bg-slate-100/20 cursor-pointer transition-all duration-200"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-slate-200 font-medium">{task.title}</span>
                    <span className={`
                      px-2 py-1 rounded text-xs font-medium
                      ${task.status === 'done' 
                        ? 'bg-green-500/30 text-green-200' 
                        : task.priority === 'high'
                        ? 'bg-red-500/30 text-red-200'
                        : 'bg-blue-500/30 text-blue-200'
                      }
                    `}>
                      {task.status === 'done' ? 'Completed' : task.priority || 'Normal'}
                    </span>
                  </div>
                  {task.description && (
                    <p className="text-sm text-slate-400 mt-1">{task.description}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-400">No tasks scheduled for this date.</p>
          )}
        </div>
      )}
    </div>
  );
}
