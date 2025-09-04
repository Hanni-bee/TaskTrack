import React, { useState } from 'react';
import { useAuthContext } from '../AuthContext';

export function SubscriptionUpgrade() {
  const { user, login } = useAuthContext();
  const [loading, setLoading] = useState(false);

  if (!user || user.subscription_type === 'premium') return null;

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      // Call backend API to upgrade subscription
      const response = await fetch('/api/subscription/upgrade', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert('Upgrade failed: ' + (errorData.message || 'Unknown error'));
        setLoading(false);
        return;
      }

      // Refresh user data after upgrade
      // Assuming there is an API to fetch current user data
      const userResponse = await fetch('/api/user', {
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
        },
      });
      if (userResponse.ok) {
        const updatedUser = await userResponse.json();
        // Update user context state
        // Assuming login function can accept user data or add a setUser function in context
        // Here, we simulate by calling login with empty password to refresh user state
        await login({ email: updatedUser.email, password: '' });
        alert('Subscription upgraded to premium successfully!');
      } else {
        alert('Failed to refresh user data after upgrade.');
      }
    } catch (error: any) {
      alert('Upgrade failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass p-6 rounded-2xl text-center">
      <h3 className="text-xl font-semibold text-slate-100 mb-4">Upgrade to Premium</h3>
      <p className="text-slate-400 mb-6">
        Unlock unlimited tasks, reminders, notes, and detailed analytics.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl mb-2">📋</div>
          <p className="text-sm text-slate-300">Unlimited Tasks</p>
        </div>
        <div className="text-center">
          <div className="text-2xl mb-2">⏰</div>
          <p className="text-sm text-slate-300">Reminders</p>
        </div>
        <div className="text-center">
          <div className="text-2xl mb-2">📊</div>
          <p className="text-sm text-slate-300">Analytics</p>
        </div>
      </div>
      <button
        onClick={handleUpgrade}
        disabled={loading}
        className="btn-primary w-full"
      >
        {loading ? 'Processing...' : 'Upgrade to Premium - $9.99/month'}
      </button>
    </div>
  );
}
