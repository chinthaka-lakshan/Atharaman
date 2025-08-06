import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = async (credentials) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: credentials.email,
        avatar: null,
      };
      
      setUser(mockUser);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Invalid credentials' };
    }
  };

  const register = async (userData) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser = {
        id: Date.now(),
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        avatar: null,
      };
      
      setUser(newUser);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Registration failed' };
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  const forgotPassword = async (email) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { success: true, message: 'Password reset link sent to your email' };
    } catch (error) {
      return { success: false, error: 'Failed to send reset link' };
    }
  };

  const value = {
    user,
    isAuthenticated,
    login,
    register,
    logout,
    forgotPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};