/**
 * Spacing Scale
 * Consistent spacing values for margins, padding, and layout
 */

export const spacing = {
  // Base spacing unit (4px)
  base: 4,
  
  // Spacing scale
  xs: 4,    // 4px
  sm: 8,    // 8px
  md: 16,   // 16px
  lg: 24,   // 24px
  xl: 32,   // 32px
  '2xl': 48, // 48px
  '3xl': 64, // 64px
  '4xl': 96, // 96px
  
  // Component-specific spacing
  component: {
    // Button padding
    buttonPadding: {
      small: { vertical: 8, horizontal: 16 },
      medium: { vertical: 12, horizontal: 24 },
      large: { vertical: 16, horizontal: 32 },
    },
    
    // Card padding
    cardPadding: {
      small: 12,
      medium: 16,
      large: 24,
    },
    
    // Input padding
    inputPadding: {
      vertical: 12,
      horizontal: 16,
    },
    
    // Screen padding
    screenPadding: {
      horizontal: 16,
      vertical: 24,
    },
    
    // Section spacing
    sectionSpacing: {
      small: 16,
      medium: 24,
      large: 32,
    },
  },
  
  // Layout spacing
  layout: {
    // Header height
    headerHeight: 56,
    
    // Tab bar height
    tabBarHeight: 60,
    
    // Bottom sheet height
    bottomSheetHeight: 300,
    
    // Modal spacing
    modalPadding: 24,
    
    // Grid spacing
    gridSpacing: 2,
  },
} as const;

export type SpacingKey = keyof typeof spacing;
