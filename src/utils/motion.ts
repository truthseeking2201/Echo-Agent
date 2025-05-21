import { Variants } from 'framer-motion';

// Duration tokens based on UI revamp specs
export const durations = {
  fast: 0.14, // 140ms - t-fast for hover/press
  medium: 0.32, // 320ms - t-medium for card hover
  route: 0.45, // 450ms - t-route for page change
  lazy: 0.8, // 800ms - for longer animations
  slow: 0.6, // 600ms - for drawer and complex animations
};

// Easing curves from UI revamp
export const standardEasing = [0.4, 0, 0.2, 1]; // curve-standard
export const springEasing = [0.43, 0.13, 0.23, 0.96]; // curve-spring

// Reusable variants for animations based on UI revamp specs
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: {
      duration: durations.medium,
      ease: standardEasing,
    }
  },
  exit: { 
    opacity: 0,
    transition: {
      duration: durations.fast,
      ease: standardEasing,
    }
  }
};

export const fadeInUp: Variants = {
  hidden: { 
    opacity: 0, 
    y: 10 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: durations.medium,
      ease: standardEasing,
    }
  },
  exit: { 
    opacity: 0,
    y: 10,
    transition: {
      duration: durations.fast,
      ease: standardEasing,
    }
  }
};

export const scaleIn: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.96 
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: durations.medium,
      ease: springEasing,
    }
  },
  exit: { 
    opacity: 0,
    scale: 0.96,
    transition: {
      duration: durations.fast,
      ease: standardEasing,
    }
  }
};

export const slideInRight: Variants = {
  hidden: { 
    opacity: 0, 
    x: 20 
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: durations.medium,
      ease: springEasing,
    }
  },
  exit: { 
    opacity: 0,
    x: 20,
    transition: {
      duration: durations.fast,
      ease: standardEasing,
    }
  }
};

export const slideInLeft: Variants = {
  hidden: { 
    opacity: 0, 
    x: -20 
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: durations.medium,
      ease: springEasing,
    }
  },
  exit: { 
    opacity: 0,
    x: -20,
    transition: {
      duration: durations.fast,
      ease: standardEasing,
    }
  }
};

export const slideInUp: Variants = {
  hidden: { 
    opacity: 0,
    y: 20 
  },
  visible: { 
    opacity: 1,
    y: 0,
    transition: {
      duration: durations.medium,
      ease: springEasing,
    }
  },
  exit: { 
    opacity: 0,
    y: 20,
    transition: {
      duration: durations.fast,
      ease: standardEasing,
    }
  }
};

// Modal animations based on the UI revamp specifications
export const modalDesktop: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.96,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.35, // 350ms
      ease: springEasing,
    }
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    transition: {
      duration: durations.fast,
      ease: standardEasing,
    }
  }
};

export const modalMobile: Variants = {
  hidden: {
    y: '100%',
  },
  visible: {
    y: 0,
    transition: {
      duration: 0.4, // 400ms
      ease: springEasing,
    }
  },
  exit: {
    y: '100%',
    transition: {
      duration: durations.medium,
      ease: standardEasing,
    }
  }
};

// Staggered children animation helper
export const staggerChildren = (delay = 0.05) => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: delay,
    }
  }
});

// Card hover effect according to UI revamp specs
export const cardHover = {
  rest: { 
    y: 0,
    boxShadow: '0 4px 24px rgba(0, 0, 0, 0.24)',
  },
  hover: { 
    y: -4,
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.24)',
    transition: {
      duration: durations.medium,
      ease: springEasing,
    }
  },
  focusWithin: {
    boxShadow: '0 0 12px var(--tw-gradient-stops)',
    transition: {
      duration: durations.fast,
      ease: standardEasing,
    }
  },
  tap: {
    y: 0,
    scale: 0.99,
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
    transition: {
      duration: durations.fast,
      ease: standardEasing,
    }
  }
};