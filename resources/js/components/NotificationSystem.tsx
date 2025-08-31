import React, { useState, useEffect } from 'react';
import { Task } from '../types';

interface NotificationSystemProps {
  tasks: Task[];
}

export function NotificationSystem({ tasks }: NotificationSystemProps) {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    // Check current permission status
    if ('Notification' in window) {
      setPermission(Notification.permission);
      setIsEnabled(localStorage.getItem('notifications-enabled') === 'true');
    }
  }, []);

  useEffect(() => {
    if (isEnabled && permission === 'granted') {
      checkOverdueTasks();
      scheduleDailyDigest(tasks);
    }

    // Cleanup function to prevent memory leaks
    return () => {
      // Clear any pending timeouts or intervals
      if (typeof window !== 'undefined') {
        const highestTimeoutId = setTimeout(() => {}, 0);
        for (let i = 0; i < highestTimeoutId; i++) {
          clearTimeout(i);
        }
      }
    };
  }, [isEnabled, permission, tasks]);

  useEffect(() => {
    if (!isEnabled || permission !== 'granted') return;

    // Check for overdue tasks every minute
    const interval = setInterval(() => {
      checkOverdueTasks();
      checkUpcomingReminders();
    }, 60000);

    return () => clearInterval(interval);
  }, [tasks, isEnabled, permission]);

  const requestPermission = async () => {
    if ('Notification' in window) {
      const result = await Notification.requestPermission();
      setPermission(result);
      if (result === 'granted') {
        setIsEnabled(true);
        localStorage.setItem('notifications-enabled', 'true');
        showNotification('Notifications enabled!', 'You\'ll now receive reminders for your tasks.');
      }
    }
  };

  const toggleNotifications = () => {
    const newState = !isEnabled;
    setIsEnabled(newState);
    localStorage.setItem('notifications-enabled', newState.toString());
    
    if (newState && permission !== 'granted') {
      requestPermission();
    }
  };

  const showNotification = (title: string, body: string, options?: NotificationOptions) => {
    if (permission === 'granted' && isEnabled) {
      const notification = new Notification(title, {
        body,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: 'tasktrack',
        requireInteraction: false,
        ...options
      });

      // Auto close after 5 seconds
      setTimeout(() => notification.close(), 5000);
    }
  };

  const checkOverdueTasks = () => {
    const now = new Date();
    const overdueTasks = tasks.filter(task => 
      task.due_at && 
      new Date(task.due_at) < now && 
      task.status !== 'done' &&
      !task.notified_overdue
    );

    overdueTasks.forEach(task => {
      showNotification(
        '⚠️ Task Overdue',
        `"${task.title}" was due ${formatTimeAgo(new Date(task.due_at!))}`,
        { tag: `overdue-${task.id}` }
      );
    });
  };

  const checkUpcomingReminders = () => {
    const now = new Date();
    const upcomingTasks = tasks.filter(task => 
      task.reminder_at && 
      new Date(task.reminder_at) <= now &&
      new Date(task.reminder_at) > new Date(now.getTime() - 60000) && // Within last minute
      task.status !== 'done' &&
      !task.notified_reminder
    );

    upcomingTasks.forEach(task => {
      showNotification(
        '🔔 Task Reminder',
        `"${task.title}" ${task.due_at ? `is due ${formatTimeAgo(new Date(task.due_at))}` : 'needs your attention'}`,
        { tag: `reminder-${task.id}` }
      );
    });
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'just now';
  };

  // Don't render anything if notifications aren't supported
  if (!('Notification' in window)) {
    return null;
  }

  return (
    <div className="glass p-4 rounded-xl">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-slate-200">Notifications</h3>
          <p className="text-sm text-slate-400">
            Get reminded about overdue tasks and upcoming deadlines
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {permission === 'denied' && (
            <span className="text-xs text-red-400">Blocked</span>
          )}
          
          <button
            onClick={permission === 'granted' ? toggleNotifications : requestPermission}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              isEnabled && permission === 'granted' 
                ? 'bg-blue-500' 
                : 'bg-slate-600'
            }`}
            disabled={permission === 'denied'}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isEnabled && permission === 'granted' ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>
      
      {permission === 'denied' && (
        <div className="mt-3 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
          <p className="text-sm text-red-300">
            Notifications are blocked. Please enable them in your browser settings to receive task reminders.
          </p>
        </div>
      )}
    </div>
  );
}

// Service Worker registration for better notification handling
export const registerNotificationServiceWorker = async () => {
  if ('serviceWorker' in navigator && 'Notification' in window) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered:', registration);
      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }
};

// Daily digest notification
export const scheduleDailyDigest = (tasks: Task[]) => {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(9, 0, 0, 0); // 9 AM tomorrow

  const timeUntilDigest = tomorrow.getTime() - now.getTime();

  setTimeout(() => {
    const pendingTasks = tasks.filter(t => t.status !== 'done').length;
    const overdueTasks = tasks.filter(t => 
      t.due_at && new Date(t.due_at) < now && t.status !== 'done'
    ).length;

    if (pendingTasks > 0) {
      new Notification('📊 Daily Task Summary', {
        body: `You have ${pendingTasks} pending tasks${overdueTasks > 0 ? ` (${overdueTasks} overdue)` : ''}. Start your day strong!`,
        icon: '/favicon.ico',
        tag: 'daily-digest'
      });
    }

    // Schedule next digest
    scheduleDailyDigest(tasks);
  }, timeUntilDigest);
};
