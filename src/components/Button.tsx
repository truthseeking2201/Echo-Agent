import React from 'react';
import { motion } from 'framer-motion';
import { durations, standardEasing } from '@/utils/motion';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'solid' | 'gradient' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  onClick?: (e?: React.MouseEvent) => void;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  tabIndex?: number;
  ariaLabel?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  withSound?: boolean;
}

/**
 * Button component with cyber-alchemy style and gradient ring animation
 * Optimistic Cyber-Alchemy design: cheerful blend of quantum tech and avant-garde art
 * 
 * @example
 * <Button variant="gradient" size="md" onClick={() => console.log('clicked')}>
 *   Mirror trade
 * </Button>
 */
export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'solid',
  size = 'md',
  onClick,
  disabled = false,
  className = '',
  type = 'button',
  tabIndex,
  ariaLabel,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  withSound = false,
  ...props
}) => {
  // Audio feedback
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  
  React.useEffect(() => {
    if (withSound && typeof window !== 'undefined') {
      audioRef.current = new Audio('/assets/sounds/button-click.mp3');
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current = null;
      }
    };
  }, [withSound]);
  
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (withSound && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {
        // Silent catch - audio might fail in some browsers
      });
    }
    
    if (onClick) onClick();
  };
  
  // Size variants
  const sizeClasses = {
    sm: "py-1.5 px-3 text-sm gap-1.5 text-sm min-h-[32px]",
    md: "py-2 px-4 text-base gap-2 min-h-[40px]",
    lg: "py-3 px-5 text-lg gap-2.5 min-h-[48px]",
  };
  
  // Visual variants with enhanced animations
  const getVariantClasses = () => {
    switch(variant) {
      case 'solid':
        return "bg-primary text-bg-900 hover:shadow-neon active:scale-[0.98] transition-all";
      case 'gradient':
        return `
          bg-black/50 text-white 
          relative overflow-hidden
          before:absolute before:inset-0 before:p-[2px] 
          before:bg-ai-gradient before:rounded-button before:-z-10 
          before:mask-composite-exclude before:animate-gradient-ring
          hover:before:animate-[gradient-ring_1s_linear_infinite]
          after:absolute after:inset-[1px] after:rounded-[10px] 
          after:bg-bg-900/80 after:-z-[5]
        `;
      case 'ghost':
        return `
          bg-transparent text-primary border border-primary/20
          hover:bg-primary/5 hover:border-primary/40
          active:bg-primary/10
        `;
      default:
        return "bg-primary text-bg-900 hover:shadow-neon";
    }
  };
  
  // Disabled state
  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : "";
  
  // Full width
  const widthClass = fullWidth ? "w-full" : "";

  return (
    <motion.button
      type={type}
      onClick={handleClick}
      disabled={disabled}
      whileHover={{ 
        y: -2,
        transition: { duration: durations.fast, ease: standardEasing }
      }}
      whileTap={!disabled ? { 
        scale: 0.98,
        y: 0,
        transition: { duration: durations.fast, ease: standardEasing }
      } : undefined}
      transition={{
        duration: durations.fast,
        ease: standardEasing
      }}
      className={`
        relative inline-flex items-center justify-center font-medium rounded-button
        transition-all duration-fast
        focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-opacity-50
        ${sizeClasses[size]} 
        ${getVariantClasses()} 
        ${disabledClasses}
        ${widthClass}
        ${className}
      `}
      tabIndex={tabIndex}
      aria-label={ariaLabel}
      {...props}
    >
      {/* Particle effect on hover - only on gradient variant */}
      {variant === 'gradient' && (
        <span className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-30 transition-opacity duration-500">
          <span className="absolute top-1/2 left-1/2 w-[200%] h-[200%] -translate-x-1/2 -translate-y-1/2 bg-matrix-sparkle" />
        </span>
      )}
      
      {/* Button content */}
      <span className="relative flex items-center justify-center">
        {icon && iconPosition === 'left' && (
          <span className="flex-shrink-0 mr-2">{icon}</span>
        )}
        <span>{children}</span>
        {icon && iconPosition === 'right' && (
          <span className="flex-shrink-0 ml-2">{icon}</span>
        )}
      </span>
    </motion.button>
  );
};

export default Button;