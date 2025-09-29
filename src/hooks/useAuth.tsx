import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthState, User, LoginCredentials, RegisterCredentials } from '@types';
import { authService } from '@services/authService';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  updateUser: (user: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null,
    refreshToken: null,
  });

  useEffect(() => {
    // Check for stored authentication on app start
    checkStoredAuth();
  }, []);

  const checkStoredAuth = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const refreshToken = await AsyncStorage.getItem('refreshToken');
      const userData = await AsyncStorage.getItem('userData');

      if (token && userData) {
        setAuthState({
          isAuthenticated: true,
          user: JSON.parse(userData),
          token,
          refreshToken,
        });
      }
    } catch (error) {
      console.error('Error checking stored auth:', error);
    }
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await authService.login(credentials);
      
      // Store authentication data
      await AsyncStorage.setItem('authToken', response.token);
      await AsyncStorage.setItem('refreshToken', response.refreshToken);
      await AsyncStorage.setItem('userData', JSON.stringify(response.user));

      setAuthState({
        isAuthenticated: true,
        user: response.user,
        token: response.token,
        refreshToken: response.refreshToken,
      });
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    try {
      const response = await authService.register(credentials);
      
      // Store authentication data
      await AsyncStorage.setItem('authToken', response.token);
      await AsyncStorage.setItem('refreshToken', response.refreshToken);
      await AsyncStorage.setItem('userData', JSON.stringify(response.user));

      setAuthState({
        isAuthenticated: true,
        user: response.user,
        token: response.token,
        refreshToken: response.refreshToken,
      });
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Clear stored authentication data
      await AsyncStorage.multiRemove(['authToken', 'refreshToken', 'userData']);

      setAuthState({
        isAuthenticated: false,
        user: null,
        token: null,
        refreshToken: null,
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const refreshToken = async () => {
    try {
      if (!authState.refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await authService.refreshToken(authState.refreshToken);
      
      await AsyncStorage.setItem('authToken', response.token);
      await AsyncStorage.setItem('refreshToken', response.refreshToken);

      setAuthState(prev => ({
        ...prev,
        token: response.token,
        refreshToken: response.refreshToken,
      }));
    } catch (error) {
      console.error('Token refresh error:', error);
      // If refresh fails, logout user
      await logout();
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (authState.user) {
      const updatedUser = { ...authState.user, ...userData };
      setAuthState(prev => ({ ...prev, user: updatedUser }));
      
      // Update stored user data
      AsyncStorage.setItem('userData', JSON.stringify(updatedUser));
    }
  };

  const value: AuthContextType = {
    ...authState,
    login,
    register,
    logout,
    refreshToken,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
