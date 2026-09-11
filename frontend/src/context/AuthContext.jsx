/* eslint-disable react-refresh/only-export-components */
import { createContext, useState } from 'react';
import API from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser && storedUser !== 'undefined') {
        return JSON.parse(storedUser);
      }
      return null;
    } catch (error) {
      console.error('Failed to parse stored user data:', error);
      localStorage.removeItem('user');
      return null;
    }
  });

  const [loading] = useState(false);

  const login = async (email, password) => {
    try {
      const response = await API.post('/auth/login', { email, password });
      const userData = response.data?.user || response.data;

      if (!userData) {
        throw new Error('Invalid authentication response from server.');
      }

      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);

      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await API.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};