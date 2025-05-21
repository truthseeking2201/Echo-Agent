import React from 'react';
import { motion } from 'framer-motion';
import { durations } from '@/utils/motion';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'gradient' | 'ghost' | 'solid';
  size?: 'sm' | 'md' | 'lg';
  onClick?: (e?: React.MouseEvent) => void;
  disabled?: boolean;
  loading?: boolean;
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
 * Button component based on UI revamp specification
 * 
 * Default: 1px gradient ring, transparent fill
 * Hover: Fill primary; ring fades 140ms; scale 1→1.02
 * Active: Fill darken 6%; inner shadow; scale 0.97 then spring
 * Loading: Replaces label with spinner ai-shimmer; continuous 800ms linear
 * Disabled: 40% opacity, cursor-not-allowed
 * 
 * @example
 * <Button variant="primary" size="md" onClick={() => console.log('clicked')}>
 *   Mirror trade
 * </Button>
 */
export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  loading = false,
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
    if (disabled || loading) return;
    
    if (withSound && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {
        // Silent catch - audio might fail in some browsers
      });
    }
    
    if (onClick) onClick(e);
  };
  
  // Size variants - updated per UI revamp spec
  const sizeClasses = {
    sm: "py-1.5 px-3 text-caption gap-1.5 min-h-[32px]",
    md: "py-2 px-4 text-body gap-2 min-h-[40px]",
    lg: "py-3 px-5 text-subhead gap-2.5 min-h-[48px]",
  };
  
  // Visual variants according to UI revamp specs
  const getVariantClasses = () => {
    switch(variant) {
      case 'solid':
      case 'primary':
        return `
          bg-transparent text-white relative
          before:absolute before:inset-0 before:p-[1px] 
          before:bg-gradient-ai before:rounded-button 
          before:mask-composite-exclude
          hover:bg-primary hover:text-bg-900 hover:shadow-neon
          active:scale-[0.97] active:bg-[#00BFC5] active:shadow-inner
        `;
      case 'gradient':
        return `
          bg-black/50 text-white 
          relative overflow-hidden
          before:absolute before:inset-0 before:p-[2px] 
          before:bg-gradient-ai before:rounded-button before:-z-10 
          before:mask-composite-exclude before:animate-gradient-ring
          hover:before:animate-[gradient-ring_1s_linear_infinite]
          hover:scale-[1.02]
          active:scale-[0.97]
          after:absolute after:inset-[1px] after:rounded-[10px] 
          after:bg-bg-900/80 after:-z-[5]
        `;
      case 'ghost':
        return `
          bg-transparent text-primary border border-primary/20
          hover:bg-primary/10 hover:border-primary/40 hover:scale-[1.02]
          active:bg-primary/20 active:scale-[0.97]
        `;
      default:
        return "bg-primary text-bg-900 hover:shadow-neon";
    }
  };
  
  // State classes
  const stateClasses = (() => {
    if (loading) return "opacity-90 cursor-wait pointer-events-none";
    if (disabled) return "opacity-40 cursor-not-allowed pointer-events-none";
    return "";
  })();
  
  // Full width
  const widthClass = fullWidth ? "w-full" : "";

  return (
    <motion.button
      type={type}
      onClick={handleClick}
      disabled={disabled || loading}
      whileHover={!disabled && !loading ? { 
        scale: 1.02,
        transition: { duration: 0.14, ease: [0.4, 0, 0.2, 1] }
      } : undefined}
      whileTap={!disabled && !loading ? { 
        scale: 0.97,
        transition: { duration: 0.14, ease: [0.4, 0, 0.2, 1] }
      } : undefined}
      transition={{
        duration: 0.14,
        ease: [0.4, 0, 0.2, 1]
      }}
      className={`
        relative inline-flex items-center justify-center font-medium rounded-button
        transition-all duration-fast
        focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-pink focus-visible:ring-opacity-50
        ${sizeClasses[size]} 
        ${getVariantClasses()} 
        ${stateClasses}
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
      
      {/* Loading spinner */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-5 h-5 rounded-full border-2 border-white/20 border-t-white animate-spin"></div>
        </div>
      )}
      
      {/* Button content */}
      <span className={`relative flex items-center justify-center ${loading ? 'opacity-0' : 'opacity-100'}`}>
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