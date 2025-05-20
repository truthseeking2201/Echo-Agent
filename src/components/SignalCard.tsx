import React from 'react';
import { motion } from 'framer-motion';
import Button from './Button';
import type { Signal } from '@/store/echo';
import { cardHover } from '@/utils/motion';

interface SignalCardProps {
  signal: Signal;
  onMirror: (id: string) => void;
  isPaused?: boolean;
}

/**
 * Card displaying signal information with mirror action button
 * @example
 * <SignalCard 
 *   signal={signalData} 
 *   onMirror={(id) => handleMirror(id)} 
 * />
 */
export const SignalCard: React.FC<SignalCardProps> = ({
  signal,
  onMirror,
  isPaused = false
}) => {
  const { id, token, caller, confidence, createdAt, rationaleMd } = signal;
  
  // Format date
  const date = new Date(createdAt);
  const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  })}`;
  
  // Determine confidence color
  const confidenceColor = 
    confidence >= 70 ? 'bg-success' :
    confidence >= 50 ? 'bg-warning' :
    'bg-error';
    
  // Extract a preview from the markdown content (truncate to 1 line max)
  const previewText = React.useMemo(() => {
    const textOnly = rationaleMd
      .replace(/#+\s/g, '') // Remove headings
      .replace(/\*\*/g, '') // Remove bold
      .replace(/\n\n/g, ' ') // Replace double newlines with space
      .substring(0, 65); // Limit to 65 chars
    
    return textOnly.length < 65 ? textOnly : `${textOnly}...`;
  }, [rationaleMd]);

  return (
    <motion.div
      className="neo-card p-4 w-full h-full max-h-[100px]"
      initial="rest"
      whileHover="hover"
      whileTap="tap"
      variants={cardHover}
    >
      {/* Token/Caller header row */}
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center">
          <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center mr-2">
            <span className="text-sm font-medium text-primary">${token[0]}</span>
          </div>
          <div>
            <h3 
              id={`sig-${id}`}
              className="text-base font-medium text-white leading-tight"
            >
              ${token}
            </h3>
            <p className="text-xs text-white/60">{caller}</p>
          </div>
        </div>
        
        {/* Right side */}
        <div className="flex items-center">
          <span className={confidence >= 70 ? 'text-success' : confidence >= 50 ? 'text-warning' : 'text-error'}>
            {confidence}%
          </span>
            
          <div className="ml-3">
            <Button
              variant="primary"
              size="sm"
              onClick={() => onMirror(id)}
              disabled={isPaused}
              aria-disabled={isPaused}
              aria-labelledby={`sig-${id}`}
            >
              Mirror
            </Button>
          </div>
        </div>
      </div>
      
      {/* Confidence gauge */}
      <div className="mt-2">
        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div 
            className={`h-full ${confidenceColor}`}
            style={{ width: `${confidence}%` }}
          />
        </div>
      </div>
      
      {/* Content preview */}
      <div className="mt-2 text-xs text-white/70 truncate">
        {previewText}
      </div>
      
      {/* Footer with date */}
      <div className="mt-1 text-xs text-white/40">
        {formattedDate}
      </div>
    </motion.div>
  );
};

export default SignalCard;