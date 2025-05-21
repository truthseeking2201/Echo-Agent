import React from 'react';
import { motion } from 'framer-motion';
import { useAutoTrade } from '../context/AutoTradeContext';

interface AutoTradeBadgeProps {
  className?: string;
}

/**
 * Badge that indicates active auto-trade status
 * Pulsing gradient dot + text "AUTO-TRADE ON"
 */
export const AutoTradeBadge: React.FC<AutoTradeBadgeProps> = ({ className = '' }) => {
  const { enabled } = useAutoTrade();
  
  if (!enabled) return null;
  
  return (
    <div 
      className={`flex items-center gap-2 py-1 px-3 rounded-full bg-primary/10 border border-primary/30 ${className}`}
      data-testid="autotrade-badge"
    >
      <motion.div 
        className="w-2 h-2 rounded-full bg-gradient-ai"
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.6, 1, 0.6]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <span className="text-xs font-medium text-primary">AUTO-TRADE ON</span>
    </div>
  );
};

export default AutoTradeBadge;