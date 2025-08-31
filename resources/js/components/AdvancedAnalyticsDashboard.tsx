import React, { useState, useEffect } from 'react';
import { Task } from '../types';
import { apiRequest } from '../utils';

interface AnalyticsData {
  overview: {
    total_tasks: number;
    completed_tasks: number;
    pending_tasks: number;
    overdue_tasks: number;
    completion_rate: number;
    avg_completion_time: number;
    productivity_score: number;
  };
  productivity: {
    daily_average: number;
    current_streak: number;
    longest_streak: number;
    weekly_pattern: any[];
    peak_hours: any[];
  };
  trends: {
    daily_completion: any[];
    weekly_summary: any[];
    monthly_comparison: any[];
  };
  categories: {
    breakdown: any[];
    most_productive_category: string;
    category_trends: any[];
  };
  time_analysis: {
    total_time_tracked: number;
    average_task_duration: number;
    time_by_category: any[];
    efficiency_score: number;
  };
  goals: {
    weekly_goal: number;
    weekly_progress: number;
    weekly_percentage: number;
    on_track: boolean;
    projected_completion: number;
  };
}

interface AdvancedAnalyticsDashboardProps {
  tasks: Task[];
}

export function AdvancedAnalyticsDashboard({ tasks }: AdvancedAnalyticsDashboardProps) {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('30');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const data = await apiRequest<AnalyticsData>(`/api/analytics/dashboard?period=${period}`);
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="glass p-8 rounded-2xl backdrop-blur-xl border border-slate-200/20">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-200/20 rounded-xl w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-slate-200/20 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="glass p-8 rounded-2xl backdrop-blur-xl border border-slate-200/20 text-center">
        <p className="text-slate-400">Failed to load analytics data</p>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'productivity', label: 'Productivity', icon: '🚀' },
    { id: 'trends', label: 'Trends', icon: '📈' },
    { id: 'categories', label: 'Categories', icon: '🏷️' },
    { id: 'time', label: 'Time Analysis', icon: '⏱️' },
    { id: 'goals', label: 'Goals', icon: '🎯' },
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass p-6 rounded-xl backdrop-blur-xl border border-slate-200/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total Tasks</p>
              <p className="text-2xl font-bold text-slate-200">{analytics.overview.total_tasks}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <span className="text-2xl">📝</span>
            </div>
          </div>
        </div>

        <div className="glass p-6 rounded-xl backdrop-blur-xl border border-slate-200/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Completed</p>
              <p className="text-2xl font-bold text-green-400">{analytics.overview.completed_tasks}</p>
            </div>
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
              <span className="text-2xl">✅</span>
            </div>
          </div>
        </div>

        <div className="glass p-6 rounded-xl backdrop-blur-xl border border-slate-200/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Completion Rate</p>
              <p className="text-2xl font-bold text-blue-400">{analytics.overview.completion_rate}%</p>
            </div>
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
          </div>
        </div>

        <div className="glass p-6 rounded-xl backdrop-blur-xl border border-slate-200/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Productivity Score</p>
              <p className="text-2xl font-bold text-purple-400">{analytics.overview.productivity_score}</p>
            </div>
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🚀</span>
            </div>
          </div>
        </div>
      </div>

      {analytics.overview.overdue_tasks > 0 && (
        <div className="glass p-6 rounded-xl backdrop-blur-xl border border-red-400/40 bg-red-500/10">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <h3 className="text-red-300 font-semibold">Overdue Tasks</h3>
              <p className="text-red-200">You have {analytics.overview.overdue_tasks} overdue tasks that need attention.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderProductivity = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass p-6 rounded-xl backdrop-blur-xl border border-slate-200/20">
          <h3 className="text-lg font-semibold text-slate-200 mb-4">Streak Analysis</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Current Streak</span>
              <span className="text-2xl font-bold text-orange-400">{analytics.productivity.current_streak} days</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Longest Streak</span>
              <span className="text-xl font-semibold text-slate-200">{analytics.productivity.longest_streak} days</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (analytics.productivity.current_streak / analytics.productivity.longest_streak) * 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="glass p-6 rounded-xl backdrop-blur-xl border border-slate-200/20">
          <h3 className="text-lg font-semibold text-slate-200 mb-4">Daily Average</h3>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-400 mb-2">
              {analytics.productivity.daily_average}
            </div>
            <p className="text-slate-400">tasks completed per day</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderGoals = () => (
    <div className="space-y-6">
      <div className="glass p-6 rounded-xl backdrop-blur-xl border border-slate-200/20">
        <h3 className="text-lg font-semibold text-slate-200 mb-4">Weekly Goal Progress</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Progress</span>
            <span className="text-slate-200">
              {analytics.goals.weekly_progress} / {analytics.goals.weekly_goal} tasks
            </span>
          </div>
          
          <div className="w-full bg-slate-700 rounded-full h-4">
            <div 
              className={`h-4 rounded-full transition-all duration-500 ${
                analytics.goals.on_track 
                  ? 'bg-gradient-to-r from-green-500 to-blue-500' 
                  : 'bg-gradient-to-r from-yellow-500 to-red-500'
              }`}
              style={{ width: `${Math.min(100, analytics.goals.weekly_percentage)}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between items-center text-sm">
            <span className={analytics.goals.on_track ? 'text-green-400' : 'text-yellow-400'}>
              {analytics.goals.on_track ? '✅ On Track' : '⚠️ Behind Schedule'}
            </span>
            <span className="text-slate-400">{analytics.goals.weekly_percentage.toFixed(1)}%</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'overview': return renderOverview();
      case 'productivity': return renderProductivity();
      case 'goals': return renderGoals();
      case 'trends':
        return <div className="text-center text-slate-400 py-8">Trend analysis coming soon...</div>;
      case 'categories':
        return <div className="text-center text-slate-400 py-8">Category breakdown coming soon...</div>;
      case 'time':
        return <div className="text-center text-slate-400 py-8">Time analysis coming soon...</div>;
      default:
        return renderOverview();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Advanced Analytics
        </h1>
        
        <div className="flex gap-2">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-4 py-2 rounded-xl bg-slate-100/10 border border-slate-200/20 text-slate-200 
                     focus:outline-none focus:ring-2 focus:ring-blue-400/50"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="glass p-2 rounded-2xl backdrop-blur-xl border border-slate-200/20">
        <div className="flex flex-wrap gap-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                px-4 py-2 rounded-xl transition-all duration-200 flex items-center gap-2
                ${activeTab === tab.id 
                  ? 'bg-blue-500/30 text-blue-300 border border-blue-400/40' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-100/10'
                }
              `}
            >
              <span>{tab.icon}</span>
              <span className="text-sm font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="glass p-6 rounded-2xl backdrop-blur-xl border border-slate-200/20">
        {renderActiveTab()}
      </div>
    </div>
  );
}
