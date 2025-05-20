import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import Button from './Button';
import type { Signal } from '@/store/echo';
import { durations, standardEasing } from '@/utils/motion';
import { useDrawer } from './LayoutShell';

interface SignalCardProps {
  signal: Signal;
  onMirror: (id: string) => void;
  isPaused?: boolean;
  showDetails?: () => void;
}

/**
 * Enhanced SignalCard with parallax tilt effect and cyber-alchemy design
 * Cards feel like NFTs, on-chain data pulses on hover
 * @example
 * <SignalCard 
 *   signal={signalData} 
 *   onMirror={(id) => handleMirror(id)} 
 * />
 */
export const SignalCard: React.FC<SignalCardProps> = ({
  signal,
  onMirror,
  isPaused = false,
  showDetails
}) => {
  const { id, token, caller, confidence, createdAt, rationaleMd } = signal;
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const { openDrawer } = useDrawer();
  
  // Format date
  const date = new Date(createdAt);
  const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  })}`;
  
  // Determine confidence color
  const getConfidenceColor = () => {
    if (confidence >= 70) return 'bg-success';
    if (confidence >= 50) return 'bg-warning';
    return 'bg-error';
  };
  
  // Determine confidence text color
  const getConfidenceTextColor = () => {
    if (confidence >= 70) return 'text-success';
    if (confidence >= 50) return 'text-warning';
    return 'text-error';
  };
    
  // Extract a preview from the markdown content (truncate to 1 line max)
  const previewText = React.useMemo(() => {
    const textOnly = rationaleMd
      .replace(/#+\s/g, '') // Remove headings
      .replace(/\*\*/g, '') // Remove bold
      .replace(/\n\n/g, ' ') // Replace double newlines with space
      .substring(0, 65); // Limit to 65 chars
    
    return textOnly.length < 65 ? textOnly : `${textOnly}...`;
  }, [rationaleMd]);

  // Advanced parallax tilt effect with spring physics - subtle 3D presence
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  
  // Add spring physics for smoother, more natural movement
  const springRotateX = useSpring(rotateX, { stiffness: 300, damping: 30 });
  const springRotateY = useSpring(rotateY, { stiffness: 300, damping: 30 });
  
  // Parallax for inner elements - different depths for 3D effect
  const innerX = useTransform(springRotateX, [-4, 4], [-8, 8]);
  const innerY = useTransform(springRotateY, [-4, 4], [-8, 8]);
  
  // Additional glow strength increases with hover
  const [glowOpacity, setGlowOpacity] = useState(0.3);
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    // Calculate rotation based on mouse distance from center (-4 to 4 degrees)
    const rotateXVal = ((mouseY - centerY) / (rect.height / 2)) * -2;
    const rotateYVal = ((mouseX - centerX) / (rect.width / 2)) * 2;
    
    rotateX.set(rotateXVal);
    rotateY.set(rotateYVal);
    
    // Increase glow opacity based on mouse proximity to center
    const distanceFromCenter = Math.sqrt(
      Math.pow(mouseX - centerX, 2) + Math.pow(mouseY - centerY, 2)
    );
    const maxDistance = Math.sqrt(Math.pow(rect.width / 2, 2) + Math.pow(rect.height / 2, 2));
    const normalizedDistance = distanceFromCenter / maxDistance;
    
    // Glow becomes stronger at edges (0.3 to 0.8)
    setGlowOpacity(0.3 + normalizedDistance * 0.5);
  };
  
  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    setGlowOpacity(0.3);
    setIsHovered(false);
  };
  
  const handleMouseEnter = () => {
    setIsHovered(true);
  };
  
  // Handle showing details in a drawer
  const handleShowDetails = () => {
    if (showDetails) {
      showDetails();
    } else {
      // Default implementation using drawer context
      openDrawer(
        <div className="space-y-6">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mr-3">
              <span className="text-lg font-mono font-medium text-primary">${token[0]}</span>
            </div>
            <div>
              <h3 className="text-xl font-display tracking-tight text-white">
                ${token}
              </h3>
              <p className="text-sm font-body text-white/60">{caller}</p>
            </div>
          </div>
          
          <div className="glassmorphic p-4">
            <h4 className="text-sm text-white/70 mb-2 font-medium">Signal Confidence</h4>
            <div className="flex items-center space-x-2">
              <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${getConfidenceColor()}`}
                  style={{ width: `${confidence}%` }}
                />
              </div>
              <span className={`text-sm font-mono font-medium ${getConfidenceTextColor()}`}>
                {confidence}%
              </span>
            </div>
          </div>
          
          <div className="glassmorphic p-4">
            <h4 className="text-sm text-white/70 mb-2 font-medium">Rationale</h4>
            <div className="prose prose-invert text-sm max-w-none">
              {rationaleMd.split('\n').map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </div>
          
          <div className="flex justify-center">
            <Button
              variant="gradient"
              size="md"
              onClick={() => onMirror(id)}
              disabled={isPaused}
              fullWidth
              withSound
            >
              Mirror Trade
            </Button>
          </div>
        </div>
      );
    }
  };

  return (
    <div onClick={handleShowDetails} className="cursor-pointer">
      <motion.div
        ref={cardRef}
        className="neo-card p-4 w-full relative overflow-hidden"
        initial="rest"
        whileHover="hover"
        whileTap="tap"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleMouseEnter}
        style={{ 
          transformStyle: 'preserve-3d',
          transform: `perspective(1000px) rotateX(${springRotateX}deg) rotateY(${springRotateY}deg)`
        }}
        transition={{
          transform: { duration: 0.2, ease: "easeOut" }
        }}
      >
        {/* Glow overlay with dynamic intensity */}
        <motion.div 
          className="absolute inset-0 pointer-events-none rounded-card"
          style={{ 
            background: `radial-gradient(circle at center, ${confidence >= 70 ? 'rgba(34, 229, 112,' : confidence >= 50 ? 'rgba(250, 220, 21,' : 'rgba(248, 120, 120,'} ${isHovered ? glowOpacity : 0.3}) 0%, rgba(0,0,0,0) 70%)`,
            opacity: isHovered ? 1 : 0.6,
            transition: 'opacity 0.3s ease-out'
          }}
        />
  
        {/* Card content with inner parallax */}
        <motion.div 
          className="relative z-10"
          style={{ 
            transform: `translateX(${innerX}px) translateY(${innerY}px)` 
          }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          {/* Token/Caller header row */}
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-2">
                <span className="text-sm font-mono font-medium text-primary">${token[0]}</span>
              </div>
              <div>
                <h3 
                  id={`sig-${id}`}
                  className="text-base font-display tracking-tight text-white leading-tight"
                >
                  ${token}
                </h3>
                <p className="text-xs font-body text-white/60">{caller}</p>
              </div>
            </div>
            
            {/* Right side */}
            <div>
              <span className={`text-sm font-mono font-medium ${getConfidenceTextColor()}`}>
                {confidence}%
              </span>
            </div>
          </div>
          
          {/* Confidence gauge with animated fill */}
          <div className="mt-2 relative">
            <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                className={`h-full ${getConfidenceColor()}`}
                initial={{ width: 0 }}
                animate={{ width: `${confidence}%` }}
                transition={{ 
                  duration: 0.6,
                  ease: standardEasing
                }}
              />
            </div>
          </div>
          
          {/* Content preview */}
          <div className="mt-3 text-xs text-white/70 line-clamp-2">
            {previewText}
          </div>
          
          {/* Footer with date and show details button */}
          <div className="mt-3 flex justify-between items-center">
            <span className="text-xs font-mono text-white/40">
              {formattedDate}
            </span>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                if (e) e.stopPropagation();
                onMirror(id);
              }}
              disabled={isPaused}
              aria-disabled={isPaused}
              aria-labelledby={`sig-${id}`}
            >
              Mirror
            </Button>
          </div>
        </motion.div>
      </motion.div>
      
      {/* Animated highlight on hover - appears outside the card */}
      <motion.div
        className="w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full mt-1 opacity-0"
        animate={{
          opacity: isHovered ? 0.7 : 0,
          scaleX: isHovered ? 1 : 0.5
        }}
        transition={{
          duration: durations.medium,
          ease: standardEasing
        }}
      />
    </div>
  );
};

export default SignalCard;