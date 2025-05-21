import React from 'react';
import { motion } from 'framer-motion';
import { durations, standardEasing } from '@/utils/motion';

interface KillSwitchToggleProps {
  isPaused: boolean;
  onToggle: () => void;
  label?: string;
}

/**
 * A toggle switch for pausing/resuming trading
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
  return (
    <div className="flex items-center space-x-3">
      {label && (
        <span className="text-sm font-medium text-white/80">
          {label}
        </span>
      )}
      
      <button
        type="button"
        role="switch"
        aria-checked={!isPaused}
        onClick={onToggle}
        className={`
          relative inline-flex h-5 w-9 items-center rounded-full
          transition-colors duration-slow
          ${isPaused ? 'bg-white/20' : 'bg-success'}
          focus:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-opacity-50
        `}
      >
        <span className="sr-only">{isPaused ? "Resume trading" : "Pause trading"}</span>
        
        <motion.span
          className={`
            inline-block h-4 w-4 transform rounded-full 
            bg-white shadow-md
          `}
          initial={false}
          animate={{
            x: isPaused ? 4 : 16
          }}
          transition={{
            type: "spring",
            stiffness: 240,
            damping: 30,
            duration: durations.slow
          }}
        />
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