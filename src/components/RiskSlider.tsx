import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { durations, standardEasing } from '@/utils/motion';

interface RiskSliderProps {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
  label?: string;
  description?: string;
}

/**
 * A slider component for adjusting risk settings
 * @example
 * <RiskSlider 
 *   value={50} 
 *   min={0} 
 *   max={100} 
 *   step={5} 
 *   onChange={(val) => console.log(val)} 
 *   label="Risk Level"
 * />
 */
export const RiskSlider: React.FC<RiskSliderProps> = ({
  value,
  min = 0,
  max = 100,
  step = 5,
  onChange,
  label = 'Risk Level',
  description
}) => {
  const id = React.useId();
  const [isDragging, setIsDragging] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(Number(e.target.value));
  };
  
  // Determine color based on risk level
  const sliderColor = 
    value < 30 ? '#22C55E' :
    value < 60 ? '#FACC15' :
    '#F87171';
  
  // Calculate background gradient for track
  const percentage = ((value - min) / (max - min)) * 100;
  const style = {
    background: `linear-gradient(to right, ${sliderColor} 0%, ${sliderColor} ${percentage}%, rgba(255, 255, 255, 0.1) ${percentage}%, rgba(255, 255, 255, 0.1) 100%)`
  };

  return (
    <div className="w-full">
      <div className="flex justify-between mb-2">
        <label htmlFor={id} className="block text-sm font-medium text-white/80">
          {label}
        </label>
        <motion.div
          animate={{ opacity: isDragging ? 1 : 0.8 }}
          transition={{ duration: durations.fast, ease: standardEasing }}
          className="flex items-center justify-center"
        >
          <span 
            className={`
              text-sm font-mono
              ${value < 30 ? 'text-success' : value < 60 ? 'text-warning' : 'text-error'}
            `}
          >
            {value}%
          </span>
        </motion.div>
      </div>
      
      <div className="relative">
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onTouchStart={() => setIsDragging(true)}
          onTouchEnd={() => setIsDragging(false)}
          className="w-full h-1.5 rounded-lg appearance-none cursor-pointer"
          style={style}
        />
        
        {isDragging && (
          <motion.div
            className="absolute -top-8 left-0 bg-surface-dark shadow-glow rounded-lg px-2 py-1 text-sm font-mono pointer-events-none"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            style={{ 
              left: `calc(${percentage}% - 16px)`,
              transform: 'translateX(-50%)',
              color: sliderColor
            }}
          >
            {value}%
          </motion.div>
        )}
      </div>
      
      <div className="flex justify-between text-xs text-white/60 mt-1">
        <span>Safer</span>
        <span>Aggressive</span>
      </div>
      
      {description && (
        <p className="mt-2 text-xs text-white/60">
          {description}
        </p>
      )}
    </div>
  );
};

export default RiskSlider;