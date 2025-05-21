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
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mr-3 border border-primary/30">
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
        {/* Enhanced glow overlay with dynamic intensity and AI-themed color */}
        <motion.div 
          className="absolute inset-0 pointer-events-none rounded-card"
          style={{ 
            background: `radial-gradient(circle at center, ${confidence >= 70 ? 'rgba(34, 229, 112,' : confidence >= 50 ? 'rgba(250, 220, 21,' : 'rgba(248, 120, 120,'} ${isHovered ? glowOpacity : 0.3}) 0%, rgba(0,0,0,0) 70%)`,
            opacity: isHovered ? 1 : 0.6,
            transition: 'opacity 0.3s ease-out'
          }}
        />
        
        {/* Add subtle AI scanner line effect */}
        <motion.div
          className="absolute inset-0 overflow-hidden pointer-events-none opacity-30"
          initial={{ opacity: 0 }}
          animate={isHovered ? { opacity: 0.5 } : { opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="w-full h-1 bg-ai-gradient"
            style={{ 
              background: 'linear-gradient(90deg, transparent, var(--c-ai-cyan), transparent)',
              boxShadow: '0 0 10px var(--c-ai-cyan)'
            }}
            animate={isHovered ? {
              y: ['0%', '100%', '0%'],
            } : {}}
            transition={isHovered ? {
              duration: 2,
              repeat: Infinity,
              ease: "linear",
            } : {}}
          />
        </motion.div>
        
        {/* Add subtle particle effects */}
        <div className="absolute inset-0 overflow-hidden opacity-30 pointer-events-none">
          <div className="particle-container">
            {[...Array(5)].map((_, i) => (
              <div 
                key={i} 
                className="particle"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  width: `${Math.random() * 3 + 1}px`,
                  height: `${Math.random() * 3 + 1}px`,
                  opacity: Math.random() * 0.5 + 0.3,
                  animationDuration: `${Math.random() * 5 + 10}s`,
                  animationDelay: `${Math.random() * 2}s`,
                  background: confidence >= 70 ? 'rgba(34, 229, 112, 0.8)' : 
                              confidence >= 50 ? 'rgba(250, 220, 21, 0.8)' : 
                              'rgba(248, 120, 120, 0.8)'
                }}
              />
            ))}
          </div>
        </div>
  
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
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mr-2 border border-primary/30 shadow-ai-glow">
                <span className="text-sm font-mono font-medium text-primary">${token[0]}</span>
              </div>
              <div>
                <h3 
                  id={`sig-${id}`}
                  className="text-base font-display tracking-tight text-white leading-tight"
                >
                  ${token}
                </h3>
                <div className="flex items-center">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary/80 mr-1.5 animate-pulse"></div>
                  <p className="text-xs font-body text-white/70">{caller}</p>
                </div>
              </div>
            </div>
            
            {/* Right side with confidence badge */}
            <div className="relative">
              <div className={`
                px-2 py-0.5 rounded-lg text-xs font-mono font-medium backdrop-blur-sm
                ${confidence >= 70 ? 'bg-success/20 text-success border border-success/30' : 
                confidence >= 50 ? 'bg-warning/20 text-warning border border-warning/30' : 
                'bg-error/20 text-error border border-error/30'}
              `}>
                {confidence}%
              </div>
            </div>
          </div>
          
          {/* Confidence gauge with animated fill and enhanced style */}
          <div className="mt-3 relative">
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm border border-white/5">
              <motion.div 
                className={`h-full ${getConfidenceColor()}`}
                initial={{ width: 0 }}
                animate={{ width: `${confidence}%` }}
                transition={{ 
                  duration: durations.medium,
                  ease: standardEasing
                }}
                style={{
                  boxShadow: confidence >= 70 ? '0 0 10px rgba(34, 229, 112, 0.5)' : 
                             confidence >= 50 ? '0 0 10px rgba(250, 220, 21, 0.5)' : 
                             '0 0 10px rgba(248, 120, 120, 0.5)'
                }}
              />
            </div>
          </div>
          
          {/* Preview text with AI-styled background */}
          <div className="mt-3 text-xs text-white/80 line-clamp-2 glassmorphic p-2">
            {previewText}
          </div>
          
          {/* Data row with enhanced styling */}
          <div className="mt-3 flex items-center justify-between pt-2 border-t border-white/10">
            <div className="text-xs text-white/50 font-mono">
              {formattedDate}
            </div>
            
            {/* Mirror trade button with enhanced styling */}
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                if (showDetails) {
                  showDetails();
                } else {
                  handleShowDetails();
                }
                if (!isPaused) {
                  onMirror(id);
                }
              }}
              disabled={isPaused}
              className={`
                text-white text-xs font-medium px-3 py-1.5 rounded-md border transition-colors duration-fast 
                backdrop-blur-sm
                ${isPaused ? 
                  'bg-white/5 border-white/10 text-white/40 cursor-not-allowed' : 
                  'bg-primary/10 border-primary/30 hover:bg-primary/20 shadow-ai-glow'}
              `}
              whileHover={{ scale: isPaused ? 1 : 1.05 }}
              whileTap={{ scale: isPaused ? 1 : 0.97 }}
            >
              <span className="flex items-center">
                <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.66 0H14a2 2 0 0 1 2 2v3.34l1 1L23 7v10"></path>
                </svg>
                Mirror
              </span>
            </motion.button>
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