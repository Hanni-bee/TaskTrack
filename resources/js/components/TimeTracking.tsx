import React, { useState, useEffect } from 'react';
import { Task } from '../types';

interface TimeEntry {
  id: string;
  taskId: string;
  startTime: Date;
  endTime?: Date;
  duration: number; // in seconds
  description?: string;
}

interface TimeTrackingProps {
  task: Task;
  onTimeUpdate: (taskId: string, totalTime: number) => void;
}

export function TimeTracking({ task, onTimeUpdate }: TimeTrackingProps) {
  const [isTracking, setIsTracking] = useState(false);
  const [currentSession, setCurrentSession] = useState<TimeEntry | null>(null);
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>(() => {
    const saved = localStorage.getItem(`time-entries-${task.id}`);
    return saved ? JSON.parse(saved) : [];
  });
  const [elapsedTime, setElapsedTime] = useState(0);

  // Update elapsed time every second when tracking
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isTracking && currentSession) {
      interval = setInterval(() => {
        const now = new Date();
        const elapsed = Math.floor((now.getTime() - currentSession.startTime.getTime()) / 1000);
        setElapsedTime(elapsed);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTracking, currentSession]);

  // Save time entries to localStorage
  useEffect(() => {
    localStorage.setItem(`time-entries-${task.id}`, JSON.stringify(timeEntries));
    
    // Calculate total time and notify parent
    const totalTime = timeEntries.reduce((sum, entry) => sum + entry.duration, 0);
    onTimeUpdate(task.id, totalTime);
  }, [timeEntries, task.id, onTimeUpdate]);

  const startTracking = () => {
    const session: TimeEntry = {
      id: `session-${Date.now()}`,
      taskId: task.id,
      startTime: new Date(),
      duration: 0
    };
    
    setCurrentSession(session);
    setIsTracking(true);
    setElapsedTime(0);
  };

  const stopTracking = () => {
    if (!currentSession) return;

    const endTime = new Date();
    const duration = Math.floor((endTime.getTime() - currentSession.startTime.getTime()) / 1000);
    
    const completedEntry: TimeEntry = {
      ...currentSession,
      endTime,
      duration
    };

    setTimeEntries(prev => [...prev, completedEntry]);
    setCurrentSession(null);
    setIsTracking(false);
    setElapsedTime(0);
  };

  const deleteTimeEntry = (entryId: string) => {
    setTimeEntries(prev => prev.filter(entry => entry.id !== entryId));
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getTotalTime = () => {
    const totalSeconds = timeEntries.reduce((sum, entry) => sum + entry.duration, 0) + elapsedTime;
    return totalSeconds;
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="space-y-4">
      {/* Timer Display */}
      <div className="glass p-6 rounded-xl text-center">
        <div className="text-4xl font-mono font-bold text-slate-100 mb-4">
          {formatDuration(getTotalTime())}
        </div>
        
        <div className="flex items-center justify-center gap-4">
          {!isTracking ? (
            <button
              onClick={startTracking}
              className="flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
              Start Timer
            </button>
          ) : (
            <button
              onClick={stopTracking}
              className="flex items-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
              </svg>
              Stop Timer
            </button>
          )}
        </div>

        {isTracking && (
          <div className="mt-4 text-sm text-slate-400">
            Started at {formatDate(currentSession!.startTime)}
          </div>
        )}
      </div>

      {/* Time Entries History */}
      {timeEntries.length > 0 && (
        <div className="glass p-4 rounded-xl">
          <h3 className="font-semibold text-slate-200 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Time Entries ({timeEntries.length})
          </h3>
          
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {timeEntries.map(entry => (
              <div key={entry.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-slate-200">
                      {formatDuration(entry.duration)}
                    </span>
                    <span className="text-sm text-slate-400">
                      {formatDate(entry.startTime)}
                      {entry.endTime && ` - ${formatDate(entry.endTime)}`}
                    </span>
                  </div>
                  {entry.description && (
                    <p className="text-sm text-slate-300 mt-1">{entry.description}</p>
                  )}
                </div>
                
                <button
                  onClick={() => deleteTimeEntry(entry.id)}
                  className="p-1 hover:bg-red-500/20 rounded transition-colors"
                >
                  <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Time Statistics */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass p-4 rounded-xl text-center">
          <div className="text-2xl font-bold text-blue-400">
            {timeEntries.length}
          </div>
          <div className="text-sm text-slate-400">Sessions</div>
        </div>
        
        <div className="glass p-4 rounded-xl text-center">
          <div className="text-2xl font-bold text-green-400">
            {timeEntries.length > 0 ? formatDuration(Math.floor(getTotalTime() / timeEntries.length)) : '0:00'}
          </div>
          <div className="text-sm text-slate-400">Avg Session</div>
        </div>
      </div>
    </div>
  );
}

// Global time tracking summary component
interface TimeTrackingSummaryProps {
  tasks: Task[];
}

export function TimeTrackingSummary({ tasks }: TimeTrackingSummaryProps) {
  const [totalTime, setTotalTime] = useState(0);
  const [todayTime, setTodayTime] = useState(0);
  const [weekTime, setWeekTime] = useState(0);

  useEffect(() => {
    let total = 0;
    let today = 0;
    let week = 0;
    
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(todayStart.getTime() - (todayStart.getDay() * 24 * 60 * 60 * 1000));

    tasks.forEach(task => {
      const entries = JSON.parse(localStorage.getItem(`time-entries-${task.id}`) || '[]') as TimeEntry[];
      
      entries.forEach(entry => {
        total += entry.duration;
        
        const entryDate = new Date(entry.startTime);
        if (entryDate >= todayStart) {
          today += entry.duration;
        }
        if (entryDate >= weekStart) {
          week += entry.duration;
        }
      });
    });

    setTotalTime(total);
    setTodayTime(today);
    setWeekTime(week);
  }, [tasks]);

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <div className="glass p-6 rounded-2xl">
      <h3 className="text-xl font-semibold text-slate-100 mb-4 flex items-center gap-2">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Time Tracking Summary
      </h3>
      
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-400">{formatDuration(todayTime)}</div>
          <div className="text-sm text-slate-400">Today</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-green-400">{formatDuration(weekTime)}</div>
          <div className="text-sm text-slate-400">This Week</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-400">{formatDuration(totalTime)}</div>
          <div className="text-sm text-slate-400">All Time</div>
        </div>
      </div>
    </div>
  );
}
