import React, { useEffect } from 'react';
import { motion, useAnimationControls } from 'framer-motion';
import { durations, standardEasing } from '@/utils/motion';

interface PnLWidgetProps {
  value: number;
  delta: number;
}

/**
 * An animated PnL (Profit and Loss) widget that shows current value and recent change
 * @example
 * <PnLWidget value={12.34} delta={0.5} />
 */
export const PnLWidget: React.FC<PnLWidgetProps> = ({ value, delta }) => {
  const controls = useAnimationControls();
  
  // Update display value with animation when prop changes
  useEffect(() => {
    controls.start({
      opacity: 1,
      y: 0,
      transition: {
        duration: durations.medium,
        ease: standardEasing
      }
    });
  }, [value, controls]);

  // Format the number as +X.XX% or -X.XX%
  const formattedValue = value !== null && !isNaN(value) 
    ? `${value >= 0 ? '+' : ''}${value.toFixed(2)}%` 
    : '—';
    
  const formattedDelta = delta !== null && !isNaN(delta)
    ? `${delta >= 0 ? '+' : ''}${delta.toFixed(2)}%`
    : '—';

  // Determine colors based on value
  const valueColor = value >= 0 ? 'text-success' : 'text-error';
  const deltaColor = delta >= 0 ? 'text-success/80' : 'text-error/80';

  return (
    <div
      aria-live="polite"
      className="glassmorphic p-4"
    >
      <h3 className="text-sm font-medium text-white/60 mb-1">Total PnL</h3>
      
      <div className="flex items-baseline space-x-4">
        <motion.span
          className={`text-3xl font-mono font-bold odometer ${valueColor}`}
          key={value}
          initial={{ opacity: 0, y: -10 }}
          animate={controls}
        >
          {formattedValue}
        </motion.span>
        
        <span className={`text-sm font-medium ${deltaColor}`}>
          {formattedDelta} today
        </span>
      </div>
      
      {(value === null || isNaN(value)) && (
        <div className="mt-1 text-xs text-white/40">
          Data unavailable
        </div>
      )}
    </div>
  );
};

export default PnLWidget;