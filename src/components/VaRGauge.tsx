import React from 'react';
import { motion } from 'framer-motion';
import { durations, standardEasing } from '@/utils/motion';

interface VaRGaugeProps {
  pct: number; // 0-100
  label?: string;
  showValue?: boolean;
}

/**
 * A visual gauge to represent Value-at-Risk percentage
 * @example
 * <VaRGauge pct={35} label="Risk Exposure" showValue={true} />
 */
export const VaRGauge: React.FC<VaRGaugeProps> = ({
  pct,
  label = 'VaR',
  showValue = true
}) => {
  // Clamp to valid range
  const clampedPct = Math.max(0, Math.min(100, pct));
  
  // Determine color based on risk level
  const color = 
    clampedPct < 30 ? 'bg-success' :
    clampedPct < 60 ? 'bg-warning' :
    'bg-error';

  // Add aria attributes for accessibility
  const ariaProps = {
    role: 'img',
    'aria-label': `${label}: ${clampedPct}%`,
    'aria-valuemin': 0,
    'aria-valuemax': 100,
    'aria-valuenow': clampedPct,
  };

  return (
    <div className="flex flex-col space-y-1" {...ariaProps}>
      <div className="flex justify-between text-xs text-white/60">
        <span>{label}</span>
        {showValue && <span className="font-mono">{clampedPct}%</span>}
      </div>
      
      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
        <motion.div 
          className={`h-full ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${clampedPct}%` }}
          transition={{ 
            duration: durations.medium,
            ease: standardEasing
          }}
        />
      </div>
    </div>
  );
};

export default VaRGauge;