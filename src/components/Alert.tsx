import React from 'react';
import { motion } from 'framer-motion';

export type AlertVariant = 'info' | 'success' | 'warning' | 'error';

interface AlertProps {
  children: React.ReactNode;
  variant?: AlertVariant;
  className?: string;
  onClose?: () => void;
}

/**
 * Alert component for displaying important messages
 * 
 * @example
 * <Alert variant="info" className="mb-4">
 *   This is an informational alert message.
 * </Alert>
 */
export const Alert: React.FC<AlertProps> = ({
  children,
  variant = 'info',
  className = '',
  onClose
}) => {
  // Variant-specific styles
  const variantStyles = {
    info: 'border-primary bg-primary/10',
    success: 'border-success bg-success/10',
    warning: 'border-warning bg-warning/10',
    error: 'border-error bg-error/10',
  };
  
  // Variant-specific icons
  const icons = {
    info: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 18.3333C14.6024 18.3333 18.3334 14.6023 18.3334 9.99996C18.3334 5.39759 14.6024 1.66663 10 1.66663C5.39765 1.66663 1.66669 5.39759 1.66669 9.99996C1.66669 14.6023 5.39765 18.3333 10 18.3333Z" stroke="#00E5EE" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M10 6.66663V9.99996" stroke="#00E5EE" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M10 13.3334H10.0083" stroke="#00E5EE" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    success: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 18.3333C14.6024 18.3333 18.3334 14.6023 18.3334 9.99996C18.3334 5.39759 14.6024 1.66663 10 1.66663C5.39765 1.66663 1.66669 5.39759 1.66669 9.99996C1.66669 14.6023 5.39765 18.3333 10 18.3333Z" stroke="#22E570" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M6.66669 10L9.16669 12.5L13.3334 7.5" stroke="#22E570" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    warning: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 18.3333C14.6024 18.3333 18.3334 14.6023 18.3334 9.99996C18.3334 5.39759 14.6024 1.66663 10 1.66663C5.39765 1.66663 1.66669 5.39759 1.66669 9.99996C1.66669 14.6023 5.39765 18.3333 10 18.3333Z" stroke="#FADC15" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M10 6.66663V9.99996" stroke="#FADC15" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M10 13.3334H10.0083" stroke="#FADC15" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    error: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 18.3333C14.6024 18.3333 18.3334 14.6023 18.3334 9.99996C18.3334 5.39759 14.6024 1.66663 10 1.66663C5.39765 1.66663 1.66669 5.39759 1.66669 9.99996C1.66669 14.6023 5.39765 18.3333 10 18.3333Z" stroke="#F87878" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12.5 7.5L7.5 12.5" stroke="#F87878" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M7.5 7.5L12.5 12.5" stroke="#F87878" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  };

  return (
    <motion.div
      role="alert"
      className={`flex items-center rounded-button neo-card border ${variantStyles[variant]} ${className}`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1],
      }}
    >
      <div className="flex items-center p-4">
        <div className="flex-shrink-0 mr-3">
          {icons[variant]}
        </div>
        
        <div className="flex-1">
          <div className="text-sm font-medium text-white">
            {children}
          </div>
        </div>
      </div>
      
      {onClose && (
        <div className="flex items-center pr-4">
          <button
            type="button"
            className="p-1 rounded-full text-white/60 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            onClick={onClose}
            aria-label="Close"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 4L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M4 4L12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default Alert;