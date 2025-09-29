/**
 * Typography Scale
 * Font sizes, weights, and line heights for consistent text styling
 */

export const typography = {
  // Font families
  fontFamily: {
    regular: 'System',
    medium: 'System',
    semiBold: 'System',
    bold: 'System',
    light: 'System',
  },
  
  // Font sizes
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
    '6xl': 60,
  },
  
  // Font weights
  fontWeight: {
    light: '300',
    regular: '400',
    medium: '500',
    semiBold: '600',
    bold: '700',
    extraBold: '800',
  },
  
  // Line heights
  lineHeight: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
    loose: 1.8,
  },
  
  // Text styles
  textStyles: {
    // Headings
    h1: {
      fontSize: 36,
      fontWeight: '700',
      lineHeight: 1.2,
    },
    h2: {
      fontSize: 30,
      fontWeight: '600',
      lineHeight: 1.3,
    },
    h3: {
      fontSize: 24,
      fontWeight: '600',
      lineHeight: 1.3,
    },
    h4: {
      fontSize: 20,
      fontWeight: '500',
      lineHeight: 1.4,
    },
    h5: {
      fontSize: 18,
      fontWeight: '500',
      lineHeight: 1.4,
    },
    h6: {
      fontSize: 16,
      fontWeight: '500',
      lineHeight: 1.4,
    },
    
    // Body text
    body: {
      fontSize: 16,
      fontWeight: '400',
      lineHeight: 1.5,
    },
    bodySmall: {
      fontSize: 14,
      fontWeight: '400',
      lineHeight: 1.5,
    },
    bodyLarge: {
      fontSize: 18,
      fontWeight: '400',
      lineHeight: 1.5,
    },
    
    // Captions and labels
    caption: {
      fontSize: 12,
      fontWeight: '400',
      lineHeight: 1.4,
    },
    label: {
      fontSize: 14,
      fontWeight: '500',
      lineHeight: 1.4,
    },
    
    // Buttons
    button: {
      fontSize: 16,
      fontWeight: '600',
      lineHeight: 1.2,
    },
    buttonSmall: {
      fontSize: 14,
      fontWeight: '600',
      lineHeight: 1.2,
    },
    buttonLarge: {
      fontSize: 18,
      fontWeight: '600',
      lineHeight: 1.2,
    },
    
    // Special text
    overline: {
      fontSize: 12,
      fontWeight: '500',
      lineHeight: 1.2,
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
    subtitle: {
      fontSize: 14,
      fontWeight: '400',
      lineHeight: 1.4,
    },
  },
} as const;

export type TypographyKey = keyof typeof typography.textStyles;
