import { useState } from 'react';
import axios from 'axios';

interface UseAuthReturn {
  login: (credentials: { email: string; password: string }) => Promise<any>;
  register: (userData: { name: string; email: string; password: string; password_confirmation: string }) => Promise<any>;
  logout: () => Promise<void>;
  loading: boolean;
  error: string | null;
  userName: string | null;
}

export function useAuth(): UseAuthReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null); // New state for user's name

  const login = async (credentials: { email: string; password: string }) => {
    setLoading(true);
    setError(null);
    
    try {
      await axios.get('/sanctum/csrf-cookie');
      const response = await axios.post('/login', credentials);
      setUserName(response.data.user.name); // Store user's name
      window.location.href = '/';
      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Login failed';
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
      await axios.get('/sanctum/csrf-cookie');
      const response = await axios.post('/register', userData);
      setUserName(userData.name); // Store user's name
      window.location.href = '/';
      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Registration failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await axios.post('/logout');
      setUserName(null); // Clear user's name on logout
      window.location.href = '/login';
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return { login, register, logout, loading, error, userName }; // Return user's name
}
