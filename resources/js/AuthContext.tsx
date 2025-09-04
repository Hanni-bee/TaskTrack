import React from 'react';
import { apiRequest, csrf } from './utils';

const API_BASE = (typeof process !== 'undefined' && process.env.REACT_APP_API_URL) ? process.env.REACT_APP_API_URL : '/api';

interface User {
  id: number;
  name: string;
  email: string;
  subscription_type: 'basic' | 'premium';
  subscription_expires_at?: string;
  task_limit: number;
  can_set_reminders: boolean;
  can_use_categories: boolean;
  can_export_data: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (userData: { name: string; email: string; password: string; password_confirmation: string }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        await csrf();
        const userData = await apiRequest<User>(API_BASE + '/user');
        setUser(userData);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = async (credentials: { email: string; password: string }) => {
    setLoading(true);
    setError(null);
    try {
      await csrf();
      await apiRequest(API_BASE + '/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      });

      const userData = await apiRequest<User>(API_BASE + '/user');
      setUser(userData);
    } catch (err: any) {
      const errorMessage = sanitizeError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: { name: string; email: string; password: string; password_confirmation: string }) => {
    setLoading(true);
    setError(null);
    try {
      await csrf();
      await apiRequest(API_BASE + '/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      const userResponse = await apiRequest<User>(API_BASE + '/user');
      setUser(userResponse);
    } catch (err: any) {
      const errorMessage = sanitizeError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await apiRequest(API_BASE + '/logout', { method: 'POST' });
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
    }
  };

  const sanitizeError = (error: any): string => {
    if (error.status === 422) return 'Invalid input provided';
    if (error.status === 401) return 'Invalid credentials';
    if (error.status === 403) return 'Access denied';
    return 'An error occurred. Please try again.';
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
