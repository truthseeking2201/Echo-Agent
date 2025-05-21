import React from 'react';
import { motion } from 'framer-motion';
import { durations, standardEasing } from '@/utils/motion';
import Tooltip from './Tooltip';

interface VaRGaugeProps {
  pct: number | null; // 0-100 or null if data not available
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
  // Only calculate if pct is not null
  if (pct === null) {
    return null;
  }
  
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

  // Early return handled above

  return (
    <div className="flex flex-col space-y-1" {...ariaProps}>
      <div className="flex justify-between text-xs text-white/60">
        <div className="flex items-center">
          <Tooltip 
            content="Value-at-Risk: worst expected loss (95% CI) over selected timeframe."
            position="bottom"
          >
            <div className="flex items-center">
              <span>{label}</span>
              <button 
                className="ml-1 text-white/40 hover:text-white/60 transition-colors focus:outline-none"
                aria-label="More information about Value-at-Risk"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 20 20" 
                  fill="currentColor" 
                  className="w-4 h-4"
                >
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </Tooltip>
        </div>
        {showValue && <span className="font-mono">{clampedPct}%</span>}
      </div>
      
      <Tooltip 
        content="Value-at-Risk: worst expected loss (95% CI) over selected timeframe."
        position="bottom"
      >
        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden cursor-help">
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
      </Tooltip>
    </div>
  );
};

export default VaRGauge;