/**
 * Design System Color Palette
 * Semantic color roles for the social media application
 */

export const colors = {
  // Primary (Dominant brand) — Deep Indigo
  primary: '#191970',
  primaryLight: '#2A2A8A',
  primaryDark: '#0F0F4A',
  
  // Surface / Neutral — Warm Linen
  surface: '#F9F4F0',
  surfaceLight: '#FEFCFA',
  surfaceDark: '#F0E8E0',
  
  // Success / Action Accent — Fresh Bud Green
  success: '#8BC34A',
  successLight: '#AED581',
  successDark: '#689F38',
  
  // Accent / Highlights — Icy Periwinkle
  accent: '#B3BFFF',
  accentLight: '#D1D6FF',
  accentDark: '#8A94FF',
  
  // Warning / CTA (Autumn) — Spiced Cider
  warning: '#C85C0C',
  warningLight: '#FF8A50',
  warningDark: '#E65100',
  
  // Link / Info (Winter) — Royal Sapphire
  info: '#0F52BA',
  infoLight: '#1976D2',
  infoDark: '#0D47A1',
  
  // Additional semantic colors
  error: '#F44336',
  errorLight: '#FFCDD2',
  errorDark: '#D32F2F',
  
  // Neutral grays
  gray: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#EEEEEE',
    300: '#E0E0E0',
    400: '#BDBDBD',
    500: '#9E9E9E',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },
  
  // Text colors
  text: {
    primary: '#212121',
    secondary: '#757575',
    disabled: '#BDBDBD',
    inverse: '#FFFFFF',
  },
  
  // Background colors
  background: {
    primary: '#FFFFFF',
    secondary: '#F9F4F0',
    tertiary: '#F5F5F5',
    overlay: 'rgba(0, 0, 0, 0.5)',
  },
  
  // Border colors
  border: {
    light: '#E0E0E0',
    medium: '#BDBDBD',
    dark: '#757575',
  },
  
  // Status colors
  status: {
    online: '#4CAF50',
    offline: '#9E9E9E',
    away: '#FF9800',
    busy: '#F44336',
  },
} as const;

// Dark mode colors
export const darkColors = {
  ...colors,
  primary: '#2A2A8A',
  surface: '#1A1A1A',
  surfaceLight: '#2A2A2A',
  surfaceDark: '#0F0F0F',
  text: {
    primary: '#FFFFFF',
    secondary: '#BDBDBD',
    disabled: '#757575',
    inverse: '#212121',
  },
  background: {
    primary: '#121212',
    secondary: '#1A1A1A',
    tertiary: '#2A2A2A',
    overlay: 'rgba(0, 0, 0, 0.8)',
  },
} as const;

export type ColorTheme = typeof colors;
export type ColorKey = keyof typeof colors;
