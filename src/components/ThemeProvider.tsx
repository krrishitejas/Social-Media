import React, { createContext, useContext, useState, useEffect } from 'react';
import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme, darkTheme, Theme, DarkTheme } from '@design-system';

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
  colors: Theme['colors'] | DarkTheme['colors'];
  typography: Theme['typography'];
  spacing: Theme['spacing'];
  elevation: Theme['elevation'];
  motion: Theme['motion'];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Get initial theme from storage
    const getStoredTheme = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem('theme');
        if (storedTheme) {
          setIsDark(storedTheme === 'dark');
        } else {
          // Use system preference
          const systemTheme = Appearance.getColorScheme();
          setIsDark(systemTheme === 'dark');
        }
      } catch (error) {
        console.error('Error getting stored theme:', error);
      }
    };

    getStoredTheme();

    // Listen for system theme changes
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      // Only update if user hasn't manually set a preference
      AsyncStorage.getItem('theme').then((storedTheme) => {
        if (!storedTheme) {
          setIsDark(colorScheme === 'dark');
        }
      });
    });

    return () => subscription?.remove();
  }, []);

  const toggleTheme = async () => {
    try {
      const newTheme = !isDark;
      setIsDark(newTheme);
      await AsyncStorage.setItem('theme', newTheme ? 'dark' : 'light');
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const currentTheme = isDark ? darkTheme : theme;

  const value: ThemeContextType = {
    isDark,
    toggleTheme,
    colors: currentTheme.colors,
    typography: currentTheme.typography,
    spacing: currentTheme.spacing,
    elevation: currentTheme.elevation,
    motion: currentTheme.motion,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
