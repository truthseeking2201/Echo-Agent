import React from 'react';
import { motion } from 'framer-motion';
import { durations } from '@/utils/motion';

interface KillSwitchToggleProps {
  isPaused: boolean;
  onToggle: () => void;
  label?: string;
}

/**
 * Enhanced toggle switch with advanced animation effects based on the UI revamp spec
 * Used for enabling/disabling the Echo-Agent auto-trading feature
 * 
 * Off: Track bg-800; thumb grey 500
 * On: Track gradient-ai 40% opacity + glow; thumb white; slow breathing glow (2s)
 * 
 * @example
 * <KillSwitchToggle 
 *   isPaused={false} 
 *   onToggle={() => setIsPaused(!isPaused)} 
 *   label="Trading Active"
 * />
 */
export const KillSwitchToggle: React.FC<KillSwitchToggleProps> = ({
  isPaused,
  onToggle,
  label
}) => {
  const isActive = !isPaused;
  
  return (
    <div className="flex items-center space-x-3">
      {label && (
        <span className="text-caption font-medium text-white/80">
          {label}
        </span>
      )}
      
      <button
        type="button"
        role="switch"
        aria-checked={isActive}
        onClick={onToggle}
        className={`
          relative inline-flex h-7 w-14 items-center rounded-full p-1
          transition-colors duration-route
          ${isActive ? 'bg-black' : 'bg-bg-800'}
          focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-pink focus-visible:ring-opacity-75
        `}
      >
        <span className="sr-only">{isPaused ? "Resume trading" : "Pause trading"}</span>
        
        {/* Track Glow - visible when toggle is ON */}
        {isActive && (
          <div className="absolute inset-0 rounded-full overflow-hidden">
            <div className="absolute inset-0 opacity-40 bg-gradient-ai animate-pulse-glow"></div>
          </div>
        )}
        
        {/* Track Border */}
        <div className={`
          absolute inset-0 rounded-full 
          ${isActive ? 'border border-primary' : 'border border-gray-700'}
        `}></div>
        
        {/* Thumb with slow breathing glow when active */}
        <motion.span
          className={`
            inline-block h-5 w-5 transform rounded-full shadow-md
            ${isActive ? 'bg-white' : 'bg-gray-500'}
            relative z-10
          `}
          initial={false}
          animate={{
            x: isActive ? 21 : 0
          }}
          transition={{
            type: "spring",
            stiffness: 240,
            damping: 30
          }}
        >
          {/* Breathing glow effect for active state */}
          {isActive && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: [0.5, 0.8, 0.5], 
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                repeatType: "mirror" 
              }}
              className="absolute inset-0 rounded-full bg-primary blur-[2px] transform origin-center"
            />
          )}
        </motion.span>
      </button>
      
      {isPaused && (
        <span className="text-xs px-2 py-1 rounded-full bg-error/20 text-error font-medium">
          PAUSED
        </span>
      )}
    </div>
  );
};

export default KillSwitchToggle;