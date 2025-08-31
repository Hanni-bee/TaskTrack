import React, { useState, useEffect } from 'react';
import { Calendar as ReactCalendar } from 'react-calendar';
import { useTasks } from '../hooks/useTasks';
import { Task } from '../types';
import { formatDate } from '../utils';
import 'react-calendar/dist/Calendar.css';

export function Calendar() {
  const [date, setDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const { tasks } = useTasks();

  // Get tasks for a specific date
  const getTasksForDate = (date: Date): Task[] => {
    return tasks.filter(task => {
      if (!task.due_at) return false;
      const taskDate = new Date(task.due_at);
      return taskDate.toDateString() === date.toDateString();
    });
  };

  // Get all dates that have tasks
  const getDatesWithTasks = (): Date[] => {
    const dates: Date[] = [];
    tasks.forEach(task => {
      if (task.due_at) {
        const taskDate = new Date(task.due_at);
        if (!dates.some(date => date.toDateString() === taskDate.toDateString())) {
          dates.push(taskDate);
        }
      }
    });
    return dates;
  };

  const handleDateChange = (newDate: Date) => {
    setDate(newDate);
    setSelectedDate(newDate);
  };

  const selectedDateTasks = selectedDate ? getTasksForDate(selectedDate) : [];
  const datesWithTasks = getDatesWithTasks();

  // Custom tile content to show task indicators
  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const tasksForDate = getTasksForDate(date);
      if (tasksForDate.length > 0) {
        const pendingTasks = tasksForDate.filter(task => task.status === 'pending').length;
        const completedTasks = tasksForDate.filter(task => task.status === 'done').length;
        
        return (
          <div className="flex flex-col items-center">
            {pendingTasks > 0 && (
              <div className="w-2 h-2 bg-yellow-500 rounded-full mb-1" title={`${pendingTasks} pending tasks`} />
            )}
            {completedTasks > 0 && (
              <div className="w-2 h-2 bg-green-500 rounded-full" title={`${completedTasks} completed tasks`} />
            )}
          </div>
        );
      }
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="mb-8 animate-fade-in">
        <h1 className="text-4xl font-bold text-slate-100 mb-2">Calendar</h1>
        <p className="text-lg text-slate-400">View and manage your tasks by date</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <div className="glass p-6 rounded-2xl">
            <ReactCalendar
              onChange={handleDateChange}
              value={date}
              tileContent={tileContent}
              className="w-full border-0 bg-transparent text-slate-200"
              tileClassName={({ date, view }) => {
                if (view === 'month') {
                  const tasksForDate = getTasksForDate(date);
                  if (tasksForDate.length > 0) {
                    return 'bg-blue-500/20 border border-blue-500/30';
                  }
                }
                return '';
              }}
            />
            
            {/* Legend */}
            <div className="mt-6 flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-slate-300">Pending Tasks</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-slate-300">Completed Tasks</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500/20 border border-blue-500/30 rounded"></div>
                <span className="text-slate-300">Has Tasks</span>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Date Tasks */}
        <div className="lg:col-span-1">
          <div className="glass p-6 rounded-2xl h-fit">
            <h3 className="text-xl font-semibold text-slate-100 mb-4">
              {selectedDate ? formatDate(selectedDate.toISOString()) : 'Select a Date'}
            </h3>
            
            {selectedDate && selectedDateTasks.length === 0 && (
              <div className="text-center py-8">
                <div className="w-12 h-12 mx-auto mb-4 bg-slate-700/50 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-slate-400">No tasks scheduled for this date</p>
              </div>
            )}

            {selectedDateTasks.length > 0 && (
              <div className="space-y-3">
                {selectedDateTasks.map(task => (
                  <div key={task.id} className="p-3 bg-slate-700/30 rounded-lg border border-slate-600/30">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-slate-200 mb-1">{task.title}</h4>
                        {task.description && (
                          <p className="text-sm text-slate-400 mb-2">{task.description}</p>
                        )}
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            task.status === 'done' ? 'bg-green-500/20 text-green-400' :
                            task.status === 'in_progress' ? 'bg-blue-500/20 text-blue-400' :
                            'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {task.status.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Upcoming Tasks */}
      <div className="glass p-6 rounded-2xl">
        <h3 className="text-xl font-semibold text-slate-100 mb-4">Upcoming Tasks</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {datesWithTasks.slice(0, 6).map(date => {
            const tasksForDate = getTasksForDate(date);
            const pendingCount = tasksForDate.filter(task => task.status === 'pending').length;
            const completedCount = tasksForDate.filter(task => task.status === 'done').length;
            
            return (
              <div key={date.toISOString()} className="p-4 bg-slate-700/30 rounded-lg border border-slate-600/30">
                <h4 className="font-medium text-slate-200 mb-2">{formatDate(date.toISOString())}</h4>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-yellow-400">{pendingCount} pending</span>
                  <span className="text-green-400">{completedCount} completed</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
