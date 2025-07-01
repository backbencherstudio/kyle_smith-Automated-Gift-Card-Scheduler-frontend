"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getMe, logout } from '@/apis/authApis';
import { CustomToast } from '@/lib/Toast/CustomToast';

interface User {
  id: string;
  name: string;
  email: string;
  phone_number: string;
  avatar_url: string | null;
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
  logoutUser: (showToast?: boolean) => void;
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
    try {
      await refreshUser();
    } catch (error) {
      console.error('Failed to fetch user data after login:', error);
    }
  };

  const logoutUser = (showToast: boolean = true) => {
    logout();
    setUser(null);
    setUserType(null);
    if (user && showToast) {
      CustomToast.show('Logged out successfully');
    }
  };

  const refreshUser = async () => {
    try {
      const response = await getMe();
      if (response.success && response.data) {
        // Map API response to match User interface
        const userData = {
          ...response.data,
          avatar_url: (response.data as any).avatar_url || null
        };
        setUser(userData);
        setUserType(response.data.type);
      }
    } catch (error) {
      console.error('Failed to refresh user data:', error);
      logoutUser(false);  
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