"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getMe, logout } from '@/apis/authApis';
import { CustomToast } from '@/lib/Toast/CustomToast';

interface User {
  id: string;
  name: string;
  email: string;
  phone_number: string;
  avatar: string | null;
  address: string;
  type: string;
  gender: string | null;
  date_of_birth: string | null;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  userType: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, type: string) => void;
  logoutUser: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userType, setUserType] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = async (token: string, type: string) => {
    setUserType(type);
    // Immediately fetch user data after login
    try {
      await refreshUser();
    } catch (error) {
      console.error('Failed to fetch user data after login:', error);
    }
  };

  const logoutUser = () => {
    logout();
    setUser(null);
    setUserType(null);
    // Only show toast when user manually logs out, not on initialization
    if (user) {
      CustomToast.show('Logged out successfully');
    }
  };

  const refreshUser = async () => {
    try {
      const response = await getMe();
      if (response.success && response.data) {
        setUser(response.data);
        // Also update userType from the user data
        setUserType(response.data.type);
      }
    } catch (error) {
      console.error('Failed to refresh user data:', error);
      logoutUser();
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      const type = localStorage.getItem('userType');

      if (token && type) {
        setUserType(type);
        try {
          await refreshUser();
        } catch (error) {
          console.error('Failed to initialize auth:', error);
          // Don't show toast on initialization failure
          logout();
          setUser(null);
          setUserType(null);
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const value: AuthContextType = {
    user,
    userType,
    isAuthenticated: !!user && !!userType,
    isLoading,
    login,
    logoutUser,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 