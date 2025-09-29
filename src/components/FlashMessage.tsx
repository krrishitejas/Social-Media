import React from 'react';
import { showMessage, hideMessage } from 'react-native-flash-message';
import { useTheme } from './ThemeProvider';

interface FlashMessageProps {
  message?: string;
  type?: 'success' | 'warning' | 'danger' | 'info';
  duration?: number;
}

export const FlashMessage: React.FC<FlashMessageProps> = () => {
  const { colors } = useTheme();

  return null; // FlashMessage is rendered globally
};

// Helper functions for showing messages
export const showSuccessMessage = (message: string, description?: string) => {
  showMessage({
    message,
    description,
    type: 'success',
    backgroundColor: '#4CAF50',
    color: '#FFFFFF',
    duration: 3000,
  });
};

export const showErrorMessage = (message: string, description?: string) => {
  showMessage({
    message,
    description,
    type: 'danger',
    backgroundColor: '#F44336',
    color: '#FFFFFF',
    duration: 4000,
  });
};

export const showWarningMessage = (message: string, description?: string) => {
  showMessage({
    message,
    description,
    type: 'warning',
    backgroundColor: '#FF9800',
    color: '#FFFFFF',
    duration: 3000,
  });
};

export const showInfoMessage = (message: string, description?: string) => {
  showMessage({
    message,
    description,
    type: 'info',
    backgroundColor: '#2196F3',
    color: '#FFFFFF',
    duration: 3000,
  });
};
