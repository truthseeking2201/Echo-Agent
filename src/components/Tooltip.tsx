import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number; // Delay in ms
  className?: string;
}

/**
 * Tooltip component with customizable position and delay
 * 
 * @example
 * <Tooltip content="This is a tooltip" position="top">
 *   <button>Hover me</button>
 * </Tooltip>
 */
export const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  position = 'top',
  delay = 300,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ 
    x: 0, 
    y: 0 
  });
  
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
  
  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
      
      // Calculate position based on trigger element
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        const tooltipX = rect.left + rect.width / 2;
        let tooltipY;
        
        switch (position) {
          case 'bottom':
            tooltipY = rect.bottom + 8;
            break;
          case 'top':
          default:
            tooltipY = rect.top - 8;
            break;
        }
        
        setTooltipPosition({ x: tooltipX, y: tooltipY });
      }
    }, delay);
  };
  
  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsVisible(false);
  };
  
  // Position-specific styles
  const getPositionClasses = () => {
    switch (position) {
      case 'bottom':
        return 'top-2 transform -translate-x-1/2 translate-y-full';
      case 'top':
      default:
        return 'bottom-2 transform -translate-x-1/2 -translate-y-full';
    }
  };
  
  return (
    <div
      ref={triggerRef}
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
    >
      {children}
      
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className={`fixed z-50 px-3 py-2 text-sm text-white rounded-md bg-bg-800 border border-white/10 backdrop-blur-glass max-w-xs shadow-lg ${getPositionClasses()} ${className}`}
            style={{
              left: tooltipPosition.x,
              top: position === 'bottom' ? tooltipPosition.y : undefined,
              bottom: position === 'top' ? window.innerHeight - tooltipPosition.y : undefined,
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.15 }}
          >
            {content}
            
            <div 
              className={`absolute w-0 h-0 border-l-[6px] border-r-[6px] border-transparent
                ${position === 'bottom' ? 'border-b-[6px] border-b-bg-800 -top-[6px] left-1/2 -translate-x-1/2' : ''}
                ${position === 'top' ? 'border-t-[6px] border-t-bg-800 -bottom-[6px] left-1/2 -translate-x-1/2' : ''}
              `}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Tooltip;