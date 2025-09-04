import React, { useState } from 'react';
import { useAuthContext } from '../AuthContext';

export function SubscriptionStatus() {
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(false);

  if (!user) return null;

  const isPremium = user.subscription_type === 'premium';
  const expiresAt = user.subscription_expires_at ? new Date(user.subscription_expires_at).toLocaleDateString() : 'N/A';

  const handleUpgrade = async () => {
    setLoading(true);
    // Mock payment processing
    setTimeout(() => {
      alert('Mock payment successful! You are now a premium user.');
      // In real app, this would update the user's subscription in the backend
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="glass p-4 rounded-xl text-center text-slate-100 mb-6">
      <h3 className="text-lg font-semibold mb-2">Subscription Status</h3>
      <p>
        You are currently on the <span className={isPremium ? 'text-green-400' : 'text-yellow-400'}>{isPremium ? 'Premium' : 'Basic'}</span> plan.
      </p>
      {isPremium && (
        <p className="mt-1 text-sm text-slate-400">
          Your subscription expires on {expiresAt}.
        </p>
      )}
      {!isPremium && (
        <div className="mt-4">
          <p className="text-sm text-slate-400 mb-3">
            Upgrade to premium to unlock unlimited tasks, reminders, notes, and analytics.
          </p>
          <button
            onClick={handleUpgrade}
            disabled={loading}
            className="btn-primary text-sm px-4 py-2"
          >
            {loading ? 'Processing...' : 'Upgrade - $9.99/month'}
          </button>
        </div>
      )}
    </div>
  );
}
