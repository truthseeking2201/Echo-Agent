import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { durations, standardEasing } from '@/utils/motion';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  msg: string;
  type?: ToastType;
  onClose?: () => void;
  duration?: number; // milliseconds
  action?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * Toast notification component with auto-dismiss
 * @example
 * <Toast 
 *   msg="Transaction confirmed!" 
 *   type="success"
 *   duration={5000}
 *   onClose={() => setShowToast(false)}
 *   action={{ label: "View", onClick: () => navigate('/logs') }}
 * />
 */
export const Toast: React.FC<ToastProps> = ({
  msg,
  type = 'info',
  onClose,
  duration = 5000,
  action
}) => {
  const [visible, setVisible] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => {
        onClose?.();
      }, 300); // Wait for exit animation
    }, duration);
    
    return () => clearTimeout(timer);
  }, [duration, onClose]);
  
  // Type-specific styles
  const typeStyles = {
    success: 'border-l-4 border-success bg-success/10',
    error: 'border-l-4 border-error bg-error/10',
    info: 'border-l-4 border-primary bg-primary/10',
  };
  
  // Type-specific icons
  const icons = {
    success: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 18.3333C14.6024 18.3333 18.3334 14.6023 18.3334 9.99996C18.3334 5.39759 14.6024 1.66663 10 1.66663C5.39765 1.66663 1.66669 5.39759 1.66669 9.99996C1.66669 14.6023 5.39765 18.3333 10 18.3333Z" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M6.66669 10L9.16669 12.5L13.3334 7.5" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    error: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 18.3333C14.6024 18.3333 18.3334 14.6023 18.3334 9.99996C18.3334 5.39759 14.6024 1.66663 10 1.66663C5.39765 1.66663 1.66669 5.39759 1.66669 9.99996C1.66669 14.6023 5.39765 18.3333 10 18.3333Z" stroke="#F87171" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12.5 7.5L7.5 12.5" stroke="#F87171" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M7.5 7.5L12.5 12.5" stroke="#F87171" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    info: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 18.3333C14.6024 18.3333 18.3334 14.6023 18.3334 9.99996C18.3334 5.39759 14.6024 1.66663 10 1.66663C5.39765 1.66663 1.66669 5.39759 1.66669 9.99996C1.66669 14.6023 5.39765 18.3333 10 18.3333Z" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M10 6.66663V9.99996" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M10 13.3334H10.0083" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="alert"
          className={`fixed bottom-6 right-6 z-50 flex items-center shadow-glow rounded-button backdrop-blur-sm ${typeStyles[type]}`}
          initial={{ opacity: 0, x: 100, y: 0 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: 100, y: 0 }}
          transition={{
            duration: durations.medium,
            ease: standardEasing
          }}
        >
          <div className="flex items-center p-3 pl-4">
            <div className="flex-shrink-0 mr-3">
              {icons[type]}
            </div>
            
            <div className="mr-2">
              <div className="text-sm font-medium text-white">
                {msg}
              </div>
              
              {action && (
                <button
                  type="button"
                  onClick={action.onClick}
                  className="mt-1 text-sm font-medium text-primary hover:text-primary/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-opacity-50"
                >
                  {action.label}
                </button>
              )}
            </div>
          </div>
          
          <div className="h-full flex items-center pr-3">
            <button
              type="button"
              className="ml-auto p-1 rounded-full text-white/60 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-opacity-50"
              onClick={() => setVisible(false)}
              aria-label="Close"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4 4L12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;