/**
 * Elevation System
 * Shadow and elevation values for depth and hierarchy
 */

export const elevation = {
  // Shadow levels
  shadow: {
    none: {
      shadowColor: 'transparent',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0,
    },
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 8,
    },
    xl: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.25,
      shadowRadius: 16,
      elevation: 16,
    },
  },
  
  // Component elevations
  component: {
    // Cards
    card: 'sm',
    cardHover: 'md',
    cardActive: 'lg',
    
    // Buttons
    button: 'none',
    buttonPressed: 'sm',
    
    // Modals
    modal: 'xl',
    modalBackdrop: 'lg',
    
    // Navigation
    header: 'sm',
    tabBar: 'md',
    drawer: 'lg',
    
    // Floating elements
    fab: 'lg',
    tooltip: 'md',
    dropdown: 'md',
    
    // Content
    post: 'sm',
    story: 'md',
    comment: 'sm',
  },
  
  // Z-index values
  zIndex: {
    base: 0,
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
    toast: 1080,
  },
} as const;

export type ElevationKey = keyof typeof elevation.shadow;
