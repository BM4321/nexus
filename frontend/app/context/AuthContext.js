import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store'; // Recommended for sensitive storage
import { API_BASE_URL } from '../../constants/config'; // We'll create this config file next

// 1. Create the Context
const AuthContext = createContext();

// 2. Define the Provider Component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // Stores user details (id, name, email, role)
  const [token, setToken] = useState(null); // Stores the JWT
  const [isLoading, setIsLoading] = useState(true); // Tracks initial loading/auth check

  // 3. Check for stored token on app start
  useEffect(() => {
    async function loadStoredAuth() {
      try {
        const storedToken = await SecureStore.getItemAsync('userToken');
        const storedUser = await SecureStore.getItemAsync('userDetails');

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          // Set Axios default header for all subsequent requests
          axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        }
      } catch (error) {
        console.error('Error loading stored auth data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadStoredAuth();
  }, []);

  // 4. Login Function
  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
      const { token: newToken, user: userData } = response.data;
      
      // Store token and user data
      await SecureStore.setItemAsync('userToken', newToken);
      await SecureStore.setItemAsync('userDetails', JSON.stringify(userData));
      
      setToken(newToken);
      setUser(userData);
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      
      return response.data;
    } catch (error) {
      // Clear token if login fails
      await logout(); 
      throw error.response ? error.response.data : new Error('Network Error');
    } finally {
      setIsLoading(false);
    }
  };

  // 5. Logout Function
  const logout = async () => {
    await SecureStore.deleteItemAsync('userToken');
    await SecureStore.deleteItemAsync('userDetails');
    delete axios.defaults.headers.common['Authorization'];
    setToken(null);
    setUser(null);
  };

  const contextValue = {
    user,
    token,
    isLoading,
    isAuthenticated: !!token,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// 6. Custom Hook for easy use
export const useAuth = () => useContext(AuthContext);