import React from 'react';
import { useAuthContext } from '../AuthContext';

interface PremiumAnalyticsGateProps {
  children: React.ReactNode;
}

export function PremiumAnalyticsGate({ children }: PremiumAnalyticsGateProps) {
  const { user } = useAuthContext();

  // Show premium gate if user doesn't have premium subscription
  if (!user?.subscription_type || user.subscription_type !== 'premium') {
    return (
      <div className="min-h-screen">
        <div className="gradient-background" />
        <div className="relative z-10 p-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
                Advanced Analytics
              </h1>
              <p className="text-xl text-slate-300 mb-2">Unlock powerful productivity insights</p>
              <p className="text-slate-400">Upgrade to Premium to access detailed analytics and reporting</p>
            </div>

            {/* Premium Features Preview */}
            <div className="glass p-8 rounded-2xl backdrop-blur-xl border border-slate-200/20 mb-8">
              <h2 className="text-2xl font-semibold text-slate-200 mb-6 text-center">What you'll get with Premium Analytics</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="text-center p-6 rounded-xl bg-slate-100/5 border border-slate-200/10">
                  <div className="w-16 h-16 mx-auto mb-4 bg-blue-500/20 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">📊</span>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-200 mb-2">Productivity Score</h3>
                  <p className="text-slate-400 text-sm">Track your efficiency with advanced scoring algorithms</p>
                </div>

                <div className="text-center p-6 rounded-xl bg-slate-100/5 border border-slate-200/10">
                  <div className="w-16 h-16 mx-auto mb-4 bg-orange-500/20 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">🔥</span>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-200 mb-2">Streak Tracking</h3>
                  <p className="text-slate-400 text-sm">Monitor daily completion streaks and build habits</p>
                </div>

                <div className="text-center p-6 rounded-xl bg-slate-100/5 border border-slate-200/10">
                  <div className="w-16 h-16 mx-auto mb-4 bg-green-500/20 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-200 mb-2">Goal Progress</h3>
                  <p className="text-slate-400 text-sm">Set and track weekly/monthly productivity goals</p>
                </div>

                <div className="text-center p-6 rounded-xl bg-slate-100/5 border border-slate-200/10">
                  <div className="w-16 h-16 mx-auto mb-4 bg-purple-500/20 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">📈</span>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-200 mb-2">Trend Analysis</h3>
                  <p className="text-slate-400 text-sm">Visualize productivity patterns over time</p>
                </div>

                <div className="text-center p-6 rounded-xl bg-slate-100/5 border border-slate-200/10">
                  <div className="w-16 h-16 mx-auto mb-4 bg-pink-500/20 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">🏷️</span>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-200 mb-2">Category Insights</h3>
                  <p className="text-slate-400 text-sm">Analyze performance across different task categories</p>
                </div>

                <div className="text-center p-6 rounded-xl bg-slate-100/5 border border-slate-200/10">
                  <div className="w-16 h-16 mx-auto mb-4 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">⏱️</span>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-200 mb-2">Time Analysis</h3>
                  <p className="text-slate-400 text-sm">Track time spent and optimize your workflow</p>
                </div>
              </div>
            </div>

            {/* Preview Dashboard (Blurred) */}
            <div className="relative mb-8">
              <div className="glass p-8 rounded-2xl backdrop-blur-xl border border-slate-200/20 blur-sm">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                  <div className="glass p-6 rounded-xl backdrop-blur-xl border border-slate-200/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-slate-400 text-sm">Total Tasks</p>
                        <p className="text-2xl font-bold text-slate-200">47</p>
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
                        <p className="text-2xl font-bold text-green-400">32</p>
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
                        <p className="text-2xl font-bold text-blue-400">68%</p>
                      </div>
                      <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                        <span className="text-2xl">📊</span>
                      </div>
                    </div>
                  </div>

                  <div className="glass p-6 rounded-xl backdrop-blur-xl border border-slate-200/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-slate-400 text-sm">Current Streak</p>
                        <p className="text-2xl font-bold text-orange-400">7 days</p>
                      </div>
                      <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                        <span className="text-2xl">🔥</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="h-64 bg-slate-100/5 rounded-xl flex items-center justify-center">
                  <p className="text-slate-400">Interactive charts and graphs</p>
                </div>
              </div>

              {/* Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-200 mb-2">Premium Feature</h3>
                  <p className="text-slate-400 mb-6">Upgrade to unlock advanced analytics</p>
                  
                  <div className="flex gap-4 justify-center">
                    <a
                      href="/subscription"
                      className="px-8 py-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl text-white font-semibold hover:from-purple-600 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      Upgrade to Premium
                    </a>
                    
                    <a
                      href="/"
                      className="px-8 py-3 glass rounded-xl text-slate-200 font-semibold hover:bg-slate-100/10 transition-all duration-200 border border-slate-200/20"
                    >
                      Back to Dashboard
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Current Plan Info */}
            <div className="glass p-6 rounded-2xl backdrop-blur-xl border border-slate-200/20 text-center">
              <h3 className="text-lg font-semibold text-slate-200 mb-2">Current Plan: Basic</h3>
              <p className="text-slate-400 mb-4">
                You're currently on the Basic plan with limited features. Upgrade to Premium for unlimited tasks and advanced analytics.
              </p>
              <div className="flex justify-center gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-slate-200">{user?.task_limit || 10}</p>
                  <p className="text-slate-400 text-sm">Task Limit</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-400">✗</p>
                  <p className="text-slate-400 text-sm">Analytics</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-400">✗</p>
                  <p className="text-slate-400 text-sm">Categories</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-400">✗</p>
                  <p className="text-slate-400 text-sm">Reminders</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // User has premium, show the actual analytics dashboard
  return <>{children}</>;
}
