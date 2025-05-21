import { Variants } from 'framer-motion';

// Duration tokens (matching CSS custom properties)
export const durations = {
  fast: 0.09, // 90ms
  medium: 0.2, // 200ms
  slow: 0.26, // 260ms
  lazy: 0.6, // 600ms
};

// Standard easing
export const standardEasing = [0.4, 0, 0.2, 1];

// Reusable variants for animations
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
    scale: 0.95 
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: durations.medium,
      ease: standardEasing,
    }
  },
  exit: { 
    opacity: 0,
    scale: 0.95,
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
      ease: standardEasing,
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
      ease: standardEasing,
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
      ease: standardEasing,
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

export const slideInBottom: Variants = {
  hidden: {
    y: '100%',
  },
  visible: {
    y: 0,
    transition: {
      duration: durations.slow,
      ease: standardEasing,
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

// Card hover effect
export const cardHover = {
  rest: { 
    y: 0,
    boxShadow: '0 4px 20px rgba(59, 130, 246, 0.15)',
  },
  hover: { 
    y: -2,
    boxShadow: '0 8px 32px rgba(59, 130, 246, 0.25)',
    transition: {
      duration: durations.fast,
      ease: standardEasing,
    }
  },
  tap: {
    y: 0,
    boxShadow: '0 2px 10px rgba(59, 130, 246, 0.15)',
    transition: {
      duration: durations.fast,
      ease: standardEasing,
    }
  }
};