/**
 * Motion Tokens
 * Animation timing, easing, and duration values
 */

export const motion = {
  // Duration (in milliseconds)
  duration: {
    fast: 150,
    normal: 300,
    slow: 500,
    slower: 750,
    slowest: 1000,
  },
  
  // Easing functions
  easing: {
    // Standard easing
    linear: 'linear',
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
    
    // Custom easing curves
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    elastic: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
    sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
  },
  
  // Animation presets
  animations: {
    // Fade animations
    fadeIn: {
      duration: 300,
      easing: 'ease-out',
    },
    fadeOut: {
      duration: 200,
      easing: 'ease-in',
    },
    
    // Scale animations
    scaleIn: {
      duration: 200,
      easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    },
    scaleOut: {
      duration: 150,
      easing: 'cubic-bezier(0.4, 0, 0.6, 1)',
    },
    
    // Slide animations
    slideInUp: {
      duration: 300,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
    slideInDown: {
      duration: 300,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
    slideInLeft: {
      duration: 300,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
    slideInRight: {
      duration: 300,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
    
    // Story ring animation
    storyRing: {
      duration: 3000,
      easing: 'linear',
    },
    
    // Like animation
    like: {
      duration: 200,
      easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },
    
    // Heart animation
    heart: {
      duration: 300,
      easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    },
    
    // Loading animations
    loading: {
      duration: 1000,
      easing: 'linear',
    },
    
    // Navigation transitions
    navigation: {
      duration: 300,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
    
    // Modal animations
    modal: {
      duration: 300,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
    
    // Toast animations
    toast: {
      duration: 300,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
  },
  
  // Gesture animations
  gestures: {
    // Swipe gestures
    swipe: {
      duration: 200,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
    
    // Pull to refresh
    pullToRefresh: {
      duration: 300,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
    
    // Pinch to zoom
    pinch: {
      duration: 200,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
  },
} as const;

export type MotionKey = keyof typeof motion.animations;
