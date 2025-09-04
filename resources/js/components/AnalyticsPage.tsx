import React, { useState, useEffect } from 'react';
import { AnalyticsDashboard } from './AnalyticsDashboard';
import { useAuthContext } from '../AuthContext';
import { useLocation } from 'react-router-dom';
import { apiRequest } from '../utils';

function Sidebar() {
  const { logout } = useAuthContext();
  const location = useLocation();

  const { user } = useAuthContext();
  const isPremium = user?.subscription_type === 'premium';

  const navItems = [
    { name: 'My Day', path: '/', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
    { name: 'All Tasks', path: '/tasks', icon: 'M3 4h18M3 12h18M3 20h18' },
    { name: 'Calendar', path: '/calendar', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    ...(isPremium ? [{ name: 'Analytics', path: '/analytics', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' }] : []),
  ];

  return (
    <aside className="fixed top-0 left-0 h-full z-40 w-64 glass border-r border-slate-700/50">
      <div className="flex flex-col h-full">
        <div className="p-6 border-b border-slate-700/50">
          <h1 className="text-2xl font-bold text-slate-100">TaskTrack</h1>
          <p className="text-slate-400 text-sm mt-1">Your personal task manager</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map(item => (
            <a
              key={item.name}
              href={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                location.pathname === item.path
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
              </svg>
              <span className="font-medium">{item.name}</span>
            </a>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-700/50">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}

function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <div className="gradient-background" />
      <Sidebar />
      <div className="ml-64">
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

interface AnalyticsData {
  total_tasks: number;
  completed_tasks: number;
  pending_tasks: number;
  in_progress_tasks: number;
  overdue_tasks: number;
  tasks_by_category: Record<string, number>;
  tasks_by_priority: Record<string, number>;
  completion_rate: number;
  average_tasks_per_day: number;
}

export function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const data = await apiRequest<AnalyticsData>('/api/analytics');
        setAnalytics(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-slate-400">Loading analytics...</p>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <div className="text-red-400">
            <p className="text-lg font-medium mb-2">Error loading analytics</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!analytics) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <p className="text-slate-400">No analytics data available</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <AnalyticsDashboard tasks={[]} />
    </MainLayout>
  );
}
