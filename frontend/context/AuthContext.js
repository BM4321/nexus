import React, { createContext, useContext, useState, useEffect } from 'react';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

// Storage helper that works on both web and native
const storage = {
  async getItem(key) {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    } else {
      return await SecureStore.getItemAsync(key);
    }
  },
  async setItem(key, value) {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  },
  async deleteItem(key) {
    if (Platform.OS === 'web') {
      localStorage.removeItem(key);
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  },
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const token = await storage.getItem('token');
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const userData = await storage.getItem('user');
        setUser(userData ? JSON.parse(userData) : { token });
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      // MOCK LOGIN - Remove this when backend is ready
      if (email && password) {
        const mockToken = 'mock-jwt-token-' + Date.now();
        const mockUser = {
          id: 1,
          email: email,
          name: email.split('@')[0]
        };
        
        await storage.setItem('token', mockToken);
        await storage.setItem('user', JSON.stringify(mockUser));
        axios.defaults.headers.common['Authorization'] = `Bearer ${mockToken}`;
        setUser(mockUser);
        
        return { success: true };
      }
      
      // REAL API CALL - Uncomment when backend is ready
      /*
      const response = await axios.post('http://localhost:3000/api/auth/login', {
        email,
        password,
      });
      
      const { token, user } = response.data;
      
      await storage.setItem('token', token);
      await storage.setItem('user', JSON.stringify(user));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
      
      return { success: true };
      */
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || 'Login failed' 
      };
    }
  };

  const logout = async () => {
    try {
      await storage.deleteItem('token');
      await storage.deleteItem('user');
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const register = async (email, password, name) => {
    try {
      // MOCK REGISTER - Remove this when backend is ready
      if (email && password && name) {
        const mockToken = 'mock-jwt-token-' + Date.now();
        const mockUser = {
          id: 1,
          email: email,
          name: name
        };
        
        await storage.setItem('token', mockToken);
        await storage.setItem('user', JSON.stringify(mockUser));
        axios.defaults.headers.common['Authorization'] = `Bearer ${mockToken}`;
        setUser(mockUser);
        
        return { success: true };
      }
      
      // REAL API CALL - Uncomment when backend is ready
      /*
      const response = await axios.post('http://localhost:3000/api/auth/register', {
        email,
        password,
        name,
      });
      
      const { token, user } = response.data;
      
      await storage.setItem('token', token);
      await storage.setItem('user', JSON.stringify(user));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
      
      return { success: true };
      */
    } catch (error) {
      console.error('Register error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || 'Registration failed' 
      };
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};
