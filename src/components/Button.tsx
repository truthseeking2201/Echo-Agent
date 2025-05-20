import React from 'react';
import { motion } from 'framer-motion';
import { standardEasing, durations } from '@/utils/motion';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'ghost';
  size?: 'sm' | 'md';
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  tabIndex?: number;
  ariaLabel?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

/**
 * Button component following the design system
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
  className = '',
  type = 'button',
  tabIndex,
  ariaLabel,
  icon,
  iconPosition = 'left',
  ...props
}) => {
  // Main button styles
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-button focus:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-opacity-50";
  
  // Size variants
  const sizeClasses = {
    sm: "py-1.5 px-3 text-sm gap-1.5",
    md: "py-2 px-4 text-base gap-2",
  };
  
  // Visual variants
  const variantClasses = {
    primary: "bg-gradient-to-r from-primary to-primary/80 text-white shadow-sm hover:shadow-glow",
    ghost: "bg-transparent text-white/80 hover:bg-white/5",
  };
  
  // Disabled state
  const disabledClasses = disabled ? "opacity-60 cursor-not-allowed pointer-events-none" : "";

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileTap={!disabled ? { scale: 0.98 } : undefined}
      transition={{
        duration: durations.fast,
        ease: standardEasing
      }}
      className={`
        ${baseStyles}
        ${sizeClasses[size]} 
        ${variantClasses[variant]} 
        ${disabledClasses}
        ${className}
      `}
      tabIndex={tabIndex}
      aria-label={ariaLabel}
      {...props}
    >
      {icon && iconPosition === 'left' && (
        <span className="flex-shrink-0">{icon}</span>
      )}
      {children}
      {icon && iconPosition === 'right' && (
        <span className="flex-shrink-0">{icon}</span>
      )}
    </motion.button>
  );
};

export default Button;