/* eslint-disable react-refresh/only-export-components */
import { createContext, useState } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Safe initial state load
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');

      // Ensure storedUser exists, isn't literal "undefined", and token exists
      if (storedUser && storedUser !== 'undefined' && token) {
        return JSON.parse(storedUser);
      }
      return null;
    } catch (error) {
      console.error('Failed to parse stored user data:', error);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      return null;
    }
  });

  const [loading] = useState(false);

  // Axios login handler with response normalization
  const login = async (email, password) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, { email, password });
      
      // Adapt to either { user, token } or a direct payload containing user info
      const token = response.data?.token;
      const userData = response.data?.user || response.data;

      if (!userData || !token) {
        throw new Error('Invalid authentication response from server.');
      }

      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', token);
      setUser(userData);

      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};