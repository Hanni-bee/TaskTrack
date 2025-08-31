import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiRequest } from './utils';

// Sanitize error messages to prevent information leakage
const sanitizeError = (error: any): string => {
  if (error.status === 422) return 'Invalid input provided';
  if (error.status === 401) return 'Invalid credentials';
  if (error.status === 403) return 'Access denied';
  if (error.status === 429) return 'Too many requests. Please try again later.';
  if (error.status >= 500) return 'Server error. Please try again later.';
  return 'An error occurred. Please try again.';
};

interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (userData: { name: string; email: string; password: string; password_confirmation: string }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await apiRequest<User>('/api/user');
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
      await apiRequest('http://127.0.0.1:8000/login', { method: 'POST', body: JSON.stringify(credentials) });
      // Navigate to the dashboard after successful login
      window.location.href = '/';
      const userData = await apiRequest<User>('/api/user');
      setUser(userData);
    } catch (err: any) {
      const sanitizedError = sanitizeError(err);
      setError(sanitizedError);
      throw new Error(sanitizedError);
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: { name: string; email: string; password: string; password_confirmation: string }) => {
    setLoading(true);
    setError(null);
    try {
      await apiRequest('/register', { method: 'POST', body: JSON.stringify(userData) });
      const userResponse = await apiRequest<User>('/api/user');
      setUser(userResponse);
    } catch (err: any) {
      const sanitizedError = sanitizeError(err);
      setError(sanitizedError);
      throw new Error(sanitizedError);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await apiRequest('/logout', { method: 'POST' });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
