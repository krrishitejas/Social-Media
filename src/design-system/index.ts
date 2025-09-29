/**
 * Design System
 * Centralized design tokens and theme configuration
 */

export { colors, darkColors, type ColorTheme, type ColorKey } from './colors';
export { typography, type TypographyKey } from './typography';
export { spacing, type SpacingKey } from './spacing';
export { elevation, type ElevationKey } from './elevation';
export { motion, type MotionKey } from './motion';

// Theme configuration
export const theme = {
  colors,
  typography,
  spacing,
  elevation,
  motion,
} as const;

export const darkTheme = {
  colors: darkColors,
  typography,
  spacing,
  elevation,
  motion,
} as const;

export type Theme = typeof theme;
export type DarkTheme = typeof darkTheme;
