import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CpuChipIcon, CheckCircleIcon, PresentationChartLineIcon } from '@heroicons/react/24/outline';

interface Message {
  text: string;
  delayFactor: number; // Multiplied by baseDelay for typing
  hold: number;       // Time to display the message after typing
}

const BASE_TYPING_DELAY = 20;

const initialMessages: Message[] = [
  { text: "Initializing Monte Carlo simulation...", delayFactor: 1, hold: 800 },
  { text: "Loading historical market data...", delayFactor: 1, hold: 1000 },
  { text: "Booting up hyper-dimensional model...", delayFactor: 0.8, hold: 1200 },
];

const processingMessages: string[] = [
  "Crunching terabytes of data...",
  "Simulating 1,000,000+ scenarios...",
  "Calculating probability matrix...",
  "Calibrating risk parameters...",
  "Generating predictive outcomes...",
  "Finalizing distribution analysis...",
];

interface SimulationModalProps {
  onSimulationComplete: () => void; // Called after animation & actual simulation finishes
  runSimulationLogic: () => void; // The actual simulation function
  isOpen: boolean; // To control modal visibility from parent (optional, can be internal)
}

const SimulationModal: React.FC<SimulationModalProps> = ({ 
  onSimulationComplete,
  runSimulationLogic,
  isOpen // We might not strictly need isOpen if modal controls its own lifecycle after trigger
}) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [currentPhase, setCurrentPhase] = useState<'initial' | 'processing' | 'executing' | 'done'>('initial');
  const [currentProcessingMessageIx, setCurrentProcessingMessageIx] = useState(0);
  const [showIcon, setShowIcon] = useState<'cpu' | 'chart' | 'success' | null>('cpu');

  useEffect(() => {
    if (!isOpen) return; // If parent controls visibility and closes it, stop effects

    let typingInterval: NodeJS.Timeout;
    let phaseTimeout: NodeJS.Timeout;

    if (currentPhase === 'initial' && currentMessageIndex < initialMessages.length) {
      const message = initialMessages[currentMessageIndex];
      setDisplayedText('');
      setShowIcon('cpu');
      let charIndex = 0;
      typingInterval = setInterval(() => {
        if (charIndex < message.text.length) {
          const char = message.text[charIndex];
          if (char !== undefined) setDisplayedText((prev) => prev + char);
          charIndex++;
        } else {
          clearInterval(typingInterval);
          phaseTimeout = setTimeout(() => {
            if (currentMessageIndex === initialMessages.length - 1) {
              setCurrentPhase('processing');
            } else {
              setCurrentMessageIndex(prev => prev + 1);
            }
          }, message.hold);
        }
      }, BASE_TYPING_DELAY * message.delayFactor);
    } else if (currentPhase === 'processing') {
      if (currentProcessingMessageIx < processingMessages.length * 2) { // Cycle twice
        setDisplayedText(processingMessages[currentProcessingMessageIx % processingMessages.length]);
        setShowIcon('chart'); 
        phaseTimeout = setTimeout(() => {
          setCurrentProcessingMessageIx(prev => prev + 1);
        }, 350); // Slightly slower than trade exec, more thoughtful
      } else {
        setCurrentPhase('executing');
      }
    } else if (currentPhase === 'executing') {
      setDisplayedText("Finalizing Simulation Results...");
      setShowIcon('success');
      runSimulationLogic(); // Run the actual simulation passed from parent
      // The simulation logic itself might have a timeout, so we call onSimulationComplete from parent
      // Or, if simulation is quick, we can call it here after a delay.
      // For now, assume parent handles calling onSimulationComplete after its logic is done.
      // To ensure modal closes, we can set a timeout here if needed or rely on parent state.
      phaseTimeout = setTimeout(() => {
        // This timeout is just for modal to show final message briefly
        onSimulationComplete(); 
        setCurrentPhase('done');
      }, 1500); 
    }

    return () => {
      clearInterval(typingInterval);
      clearTimeout(phaseTimeout);
    };
  // Add isOpen to dependency array if it's used to re-trigger effects
  }, [isOpen, currentPhase, currentMessageIndex, currentProcessingMessageIx, runSimulationLogic, onSimulationComplete]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-bg-900/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <motion.div 
        className="bg-panel rounded-xl p-6 sm:p-8 shadow-xl w-full max-w-md flex flex-col items-center min-h-[280px] justify-center border border-white/10"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3, ease: standardEasing }}
      >
        {showIcon === 'cpu' && (
          <CpuChipIcon className="w-14 h-14 text-primary mb-5 animate-pulse" />
        )}
        {showIcon === 'chart' && (
          <PresentationChartLineIcon className="w-14 h-14 text-purple-400 mb-5 animate-pulse" />
        )}
        {showIcon === 'success' && (
          <CheckCircleIcon className="w-14 h-14 text-green-400 mb-5" />
        )}
        <p className={`text-lg font-medium text-center mb-5 min-h-[50px] flex items-center justify-center 
          ${(currentPhase === 'processing' || currentPhase === 'executing') && showIcon !== 'success' 
            ? 'text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-pink-500' 
            : 'text-white'}`}>
          {displayedText}
        </p>
        {(currentPhase === 'processing' || (currentPhase === 'executing' && showIcon !== 'success')) && (
          <div className="flex justify-center space-x-1.5 mb-5">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="w-2.5 h-8 bg-primary/70 rounded-full"
                animate={{
                  scaleY: [1, 1.7, 1, 0.6, 1.3, 1],
                  opacity: [0.5, 0.9, 0.5, 0.3, 0.8, 0.5],
                }}
                transition={{
                  duration: 1.0,
                  repeat: Infinity,
                  delay: i * 0.1,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

// Helper for standard easing, assuming it's defined elsewhere or define here if not.
const standardEasing = [0.4, 0, 0.2, 1];

export default SimulationModal; 