import React, { useMemo } from 'react';
import { Task } from '../types';

interface AnalyticsDashboardProps {
  tasks: Task[];
}

export function AnalyticsDashboard({ tasks }: AnalyticsDashboardProps) {
  const analytics = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisWeek = new Date(today.getTime() - (today.getDay() * 24 * 60 * 60 * 1000));
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Basic stats
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'done').length;
    const pendingTasks = tasks.filter(t => t.status === 'pending').length;
    const inProgressTasks = tasks.filter(t => t.status === 'in_progress').length;
    const overdueTasks = tasks.filter(t => t.due_at && new Date(t.due_at) < now && t.status !== 'done').length;

    // Time-based stats
    const tasksCompletedToday = tasks.filter(t => 
      t.status === 'done' && t.updated_at && new Date(t.updated_at) >= today
    ).length;
    
    const tasksCompletedThisWeek = tasks.filter(t => 
      t.status === 'done' && t.updated_at && new Date(t.updated_at) >= thisWeek
    ).length;

    const tasksCompletedThisMonth = tasks.filter(t => 
      t.status === 'done' && t.updated_at && new Date(t.updated_at) >= thisMonth
    ).length;

    // Category breakdown
    const categoryStats = tasks.reduce((acc, task) => {
      const category = task.category || 'uncategorized';
      if (!acc[category]) {
        acc[category] = { total: 0, completed: 0 };
      }
      acc[category].total++;
      if (task.status === 'done') {
        acc[category].completed++;
      }
      return acc;
    }, {} as Record<string, { total: number; completed: number }>);

    // Priority breakdown
    const priorityStats = tasks.reduce((acc, task) => {
      const priority = task.priority || 'none';
      if (!acc[priority]) {
        acc[priority] = { total: 0, completed: 0 };
      }
      acc[priority].total++;
      if (task.status === 'done') {
        acc[priority].completed++;
      }
      return acc;
    }, {} as Record<string, { total: number; completed: number }>);

    // Completion rate
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Productivity streak (consecutive days with completed tasks)
    const getProductivityStreak = () => {
      const completedDates = tasks
        .filter(t => t.status === 'done' && t.updated_at)
        .map(t => new Date(t.updated_at!).toDateString())
        .filter((date, index, arr) => arr.indexOf(date) === index)
        .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

      let streak = 0;
      const todayStr = today.toDateString();
      
      for (let i = 0; i < completedDates.length; i++) {
        const expectedDate = new Date(today.getTime() - (i * 24 * 60 * 60 * 1000)).toDateString();
        if (completedDates.includes(expectedDate)) {
          streak++;
        } else {
          break;
        }
      }
      
      return streak;
    };

    return {
      totalTasks,
      completedTasks,
      pendingTasks,
      inProgressTasks,
      overdueTasks,
      tasksCompletedToday,
      tasksCompletedThisWeek,
      tasksCompletedThisMonth,
      categoryStats,
      priorityStats,
      completionRate,
      productivityStreak: getProductivityStreak()
    };
  }, [tasks]);

  const StatCard = ({ title, value, subtitle, icon, color = 'bg-blue-500' }: {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: string;
    color?: string;
  }) => (
    <div className="glass p-6 rounded-2xl">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center text-2xl`}>
          {icon}
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-slate-100">{value}</div>
          {subtitle && <div className="text-sm text-slate-400">{subtitle}</div>}
        </div>
      </div>
      <h3 className="text-slate-200 font-medium">{title}</h3>
    </div>
  );

  const ProgressBar = ({ label, current, total, color = 'bg-blue-500' }: {
    label: string;
    current: number;
    total: number;
    color?: string;
  }) => {
    const percentage = total > 0 ? (current / total) * 100 : 0;
    return (
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-slate-200">{label}</span>
          <span className="text-slate-400">{current}/{total}</span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-2">
          <div
            className={`${color} h-2 rounded-full transition-all duration-500`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-slate-100 mb-2">Analytics Dashboard</h2>
        <p className="text-slate-400">Track your productivity and task completion patterns</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Tasks"
          value={analytics.totalTasks}
          icon="📋"
          color="bg-slate-500"
        />
        <StatCard
          title="Completed"
          value={analytics.completedTasks}
          subtitle={`${analytics.completionRate}% completion rate`}
          icon="✅"
          color="bg-green-500"
        />
        <StatCard
          title="In Progress"
          value={analytics.inProgressTasks}
          icon="⚡"
          color="bg-blue-500"
        />
        <StatCard
          title="Overdue"
          value={analytics.overdueTasks}
          icon="⚠️"
          color="bg-red-500"
        />
      </div>

      {/* Time-based Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Completed Today"
          value={analytics.tasksCompletedToday}
          icon="🎯"
          color="bg-purple-500"
        />
        <StatCard
          title="This Week"
          value={analytics.tasksCompletedThisWeek}
          icon="📅"
          color="bg-indigo-500"
        />
        <StatCard
          title="This Month"
          value={analytics.tasksCompletedThisMonth}
          icon="📊"
          color="bg-pink-500"
        />
      </div>

      {/* Productivity Streak */}
      <div className="glass p-6 rounded-2xl">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center text-2xl">
            🔥
          </div>
          <div>
            <h3 className="text-xl font-semibold text-slate-100">Productivity Streak</h3>
            <p className="text-slate-400">Consecutive days with completed tasks</p>
          </div>
        </div>
        <div className="text-center">
          <div className="text-4xl font-bold text-transparent bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text">
            {analytics.productivityStreak}
          </div>
          <div className="text-slate-400 mt-1">
            {analytics.productivityStreak === 1 ? 'day' : 'days'}
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="glass p-6 rounded-2xl">
        <h3 className="text-xl font-semibold text-slate-100 mb-4">Tasks by Category</h3>
        <div className="space-y-4">
          {Object.entries(analytics.categoryStats).map(([category, stats]) => (
            <ProgressBar
              key={category}
              label={category.charAt(0).toUpperCase() + category.slice(1)}
              current={stats.completed}
              total={stats.total}
              color="bg-gradient-to-r from-blue-500 to-purple-500"
            />
          ))}
          {Object.keys(analytics.categoryStats).length === 0 && (
            <p className="text-slate-400 text-center py-4">No tasks with categories yet</p>
          )}
        </div>
      </div>

      {/* Priority Breakdown */}
      <div className="glass p-6 rounded-2xl">
        <h3 className="text-xl font-semibold text-slate-100 mb-4">Tasks by Priority</h3>
        <div className="space-y-4">
          {Object.entries(analytics.priorityStats).map(([priority, stats]) => {
            const colors = {
              high: 'bg-gradient-to-r from-red-500 to-pink-500',
              medium: 'bg-gradient-to-r from-yellow-500 to-orange-500',
              low: 'bg-gradient-to-r from-green-500 to-blue-500',
              none: 'bg-gradient-to-r from-gray-500 to-slate-500'
            };
            return (
              <ProgressBar
                key={priority}
                label={priority === 'none' ? 'No Priority' : priority.charAt(0).toUpperCase() + priority.slice(1)}
                current={stats.completed}
                total={stats.total}
                color={colors[priority as keyof typeof colors] || colors.none}
              />
            );
          })}
        </div>
      </div>

      {/* Quick Insights */}
      <div className="glass p-6 rounded-2xl">
        <h3 className="text-xl font-semibold text-slate-100 mb-4">Quick Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-300">Most productive category:</span>
              <span className="text-blue-400 font-medium">
                {Object.entries(analytics.categoryStats).length > 0
                  ? Object.entries(analytics.categoryStats).reduce((a, b) => 
                      a[1].completed > b[1].completed ? a : b
                    )[0]
                  : 'None'
                }
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-300">Average completion rate:</span>
              <span className="text-green-400 font-medium">{analytics.completionRate}%</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-300">Tasks need attention:</span>
              <span className="text-orange-400 font-medium">{analytics.overdueTasks + analytics.inProgressTasks}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-300">Daily average (this month):</span>
              <span className="text-purple-400 font-medium">
                {Math.round(analytics.tasksCompletedThisMonth / new Date().getDate())}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
