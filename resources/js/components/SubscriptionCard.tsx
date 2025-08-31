import React, { useState } from 'react';
import { Subscription } from '../types';
import { apiRequest } from '../utils';

interface SubscriptionCardProps {
  subscription: Subscription;
  onUpgrade: () => void;
  onExport?: () => void;
}

export function SubscriptionCard({ subscription, onUpgrade, onExport }: SubscriptionCardProps) {
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      await apiRequest('/api/subscription/upgrade', { method: 'POST' });
      onUpgrade();
    } catch (error) {
      console.error('Upgrade failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    if (!onExport) return;
    
    setLoading(true);
    try {
      const data = await apiRequest('/api/subscription/export');
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `tasktrack-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      onExport();
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass p-6 rounded-2xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-slate-100 flex items-center gap-2">
            {subscription.is_premium ? (
              <>
                Premium Plan
                <span className="px-2 py-1 text-xs bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full">
                  Active
                </span>
              </>
            ) : (
              'Basic Plan'
            )}
          </h3>
          <p className="text-slate-400 text-sm mt-1">
            {subscription.is_premium 
              ? 'Unlock all features and unlimited tasks'
              : 'Limited features with task restrictions'
            }
          </p>
        </div>
        
        {!subscription.is_premium && (
          <button
            onClick={handleUpgrade}
            disabled={loading}
            className="btn-primary"
          >
            {loading ? 'Upgrading...' : 'Upgrade to Premium'}
          </button>
        )}
      </div>

      {/* Usage Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-slate-800/50 p-4 rounded-xl">
          <div className="text-2xl font-bold text-slate-100">
            {subscription.current_tasks}
          </div>
          <div className="text-sm text-slate-400">Tasks Created</div>
        </div>
        
        <div className="bg-slate-800/50 p-4 rounded-xl">
          <div className="text-2xl font-bold text-slate-100">
            {subscription.is_premium ? '∞' : subscription.remaining_tasks}
          </div>
          <div className="text-sm text-slate-400">
            {subscription.is_premium ? 'Unlimited' : 'Remaining Tasks'}
          </div>
        </div>
      </div>

      {/* Progress Bar for Basic Users */}
      {!subscription.is_premium && (
        <div className="mb-6">
          <div className="flex justify-between text-sm text-slate-400 mb-2">
            <span>Task Usage</span>
            <span>{subscription.current_tasks} / {subscription.task_limit}</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${Math.min((subscription.current_tasks / subscription.task_limit) * 100, 100)}%` 
              }}
            />
          </div>
          {subscription.remaining_tasks <= 2 && (
            <p className="text-orange-400 text-sm mt-2 flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              You're running low on tasks! Consider upgrading to Premium.
            </p>
          )}
        </div>
      )}

      {/* Features List */}
      <div className="space-y-3">
        <h4 className="font-medium text-slate-200 mb-3">Plan Features</h4>
        
        <div className="flex items-center gap-3">
          <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
            subscription.is_premium ? 'bg-green-500' : 'bg-slate-600'
          }`}>
            {subscription.is_premium ? (
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </div>
          <span className={subscription.is_premium ? 'text-slate-200' : 'text-slate-400'}>
            {subscription.is_premium ? 'Unlimited Tasks' : `${subscription.task_limit} Tasks Maximum`}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
            subscription.can_use_categories ? 'bg-green-500' : 'bg-slate-600'
          }`}>
            {subscription.can_use_categories ? (
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </div>
          <span className={subscription.can_use_categories ? 'text-slate-200' : 'text-slate-400'}>
            Task Categories
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
            subscription.can_set_reminders ? 'bg-green-500' : 'bg-slate-600'
          }`}>
            {subscription.can_set_reminders ? (
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </div>
          <span className={subscription.can_set_reminders ? 'text-slate-200' : 'text-slate-400'}>
            Task Reminders
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
            subscription.can_export_data ? 'bg-green-500' : 'bg-slate-600'
          }`}>
            {subscription.can_export_data ? (
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </div>
          <span className={subscription.can_export_data ? 'text-slate-200' : 'text-slate-400'}>
            Data Export
          </span>
        </div>
      </div>

      {/* Export Button for Premium Users */}
      {subscription.can_export_data && onExport && (
        <div className="mt-6 pt-4 border-t border-slate-700">
          <button
            onClick={handleExport}
            disabled={loading}
            className="btn-secondary w-full"
          >
            {loading ? 'Exporting...' : 'Export My Data'}
          </button>
        </div>
      )}

      {/* Expiration Warning for Premium Users */}
      {subscription.is_premium && subscription.subscription_expires_at && (
        <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
          <p className="text-yellow-400 text-sm">
            Your Premium subscription expires on{' '}
            {new Date(subscription.subscription_expires_at).toLocaleDateString()}
          </p>
        </div>
      )}
    </div>
  );
}
