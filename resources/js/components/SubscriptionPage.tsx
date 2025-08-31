import React, { useState, useEffect } from 'react';
import { Subscription } from '../types';
import { apiRequest } from '../utils';
import { SubscriptionCard } from './SubscriptionCard';
import { useAuthContext } from '../AuthContext';

export function SubscriptionPage() {
  const { user } = useAuthContext();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSubscription();
  }, []);

  const fetchSubscription = async () => {
    try {
      setLoading(true);
      const data = await apiRequest<Subscription>('/api/subscription');
      setSubscription(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load subscription');
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = () => {
    fetchSubscription(); // Refresh subscription data after upgrade
  };

  const handleExport = () => {
    // Show success message or handle export completion
    console.log('Data exported successfully');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass p-8 rounded-2xl">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-center text-slate-400">Loading subscription...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass p-8 rounded-2xl">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-medium text-slate-200 mb-2 text-center">Error Loading Subscription</h3>
          <p className="text-slate-400 text-center mb-4">{error}</p>
          <button onClick={fetchSubscription} className="btn-primary w-full">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-slate-100 mb-2">Subscription Management</h1>
        <p className="text-lg text-slate-400">Manage your TaskTrack subscription and features</p>
      </div>

      {/* Current Subscription */}
      {subscription && (
        <SubscriptionCard
          subscription={subscription}
          onUpgrade={handleUpgrade}
          onExport={handleExport}
        />
      )}

      {/* Pricing Comparison */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Basic Plan */}
        <div className={`glass p-6 rounded-2xl border-2 ${
          !subscription?.is_premium ? 'border-blue-500/50' : 'border-slate-700/50'
        }`}>
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-slate-100 mb-2">Basic Plan</h3>
            <div className="text-3xl font-bold text-slate-100">
              Free
            </div>
            <p className="text-slate-400 mt-2">Perfect for getting started</p>
          </div>

          <ul className="space-y-3 mb-6">
            <li className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-slate-200">Up to 10 tasks</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-slate-200">Basic task management</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-slate-600 flex items-center justify-center">
                <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <span className="text-slate-400">No categories</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-slate-600 flex items-center justify-center">
                <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <span className="text-slate-400">No reminders</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-slate-600 flex items-center justify-center">
                <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <span className="text-slate-400">No data export</span>
            </li>
          </ul>

          {!subscription?.is_premium && (
            <div className="text-center">
              <span className="inline-block px-4 py-2 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium">
                Current Plan
              </span>
            </div>
          )}
        </div>

        {/* Premium Plan */}
        <div className={`glass p-6 rounded-2xl border-2 relative ${
          subscription?.is_premium ? 'border-purple-500/50' : 'border-slate-700/50'
        }`}>
          {/* Popular Badge */}
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <span className="px-4 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium rounded-full">
              Most Popular
            </span>
          </div>

          <div className="text-center mb-6 mt-4">
            <h3 className="text-2xl font-bold text-slate-100 mb-2">Premium Plan</h3>
            <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              $9.99/month
            </div>
            <p className="text-slate-400 mt-2">Unlock all features</p>
          </div>

          <ul className="space-y-3 mb-6">
            <li className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-slate-200">Unlimited tasks</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-slate-200">Task categories</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-slate-200">Task reminders</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-slate-200">Data export</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-slate-200">Priority support</span>
            </li>
          </ul>

          {subscription?.is_premium ? (
            <div className="text-center">
              <span className="inline-block px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-400 rounded-full text-sm font-medium">
                Current Plan
              </span>
            </div>
          ) : (
            <button 
              onClick={handleUpgrade}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
            >
              Upgrade to Premium
            </button>
          )}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="glass p-6 rounded-2xl">
        <h3 className="text-xl font-semibold text-slate-100 mb-4">Frequently Asked Questions</h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-slate-200 mb-2">Can I cancel my subscription anytime?</h4>
            <p className="text-slate-400">Yes, you can cancel your Premium subscription at any time. You'll continue to have access to Premium features until the end of your billing period.</p>
          </div>
          <div>
            <h4 className="font-medium text-slate-200 mb-2">What happens to my data if I downgrade?</h4>
            <p className="text-slate-400">Your existing tasks will remain, but you'll be limited to 10 tasks total. Premium features like categories and reminders will be disabled but not deleted.</p>
          </div>
          <div>
            <h4 className="font-medium text-slate-200 mb-2">Is there a free trial?</h4>
            <p className="text-slate-400">Every new user starts with our Basic plan for free. You can upgrade to Premium at any time to unlock additional features.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
