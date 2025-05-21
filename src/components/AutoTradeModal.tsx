import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { standardEasing, durations, springEasing } from '@/utils/motion';
import Button from './Button';
import dynamic from 'next/dynamic';
import { useAutoTrade } from '@/context/AutoTradeContext';

// Dynamically import the AutoTradeAnimation with prefetch for better performance
const AutoTradeAnimation = dynamic(() => import('./AutoTradeAnimation'), {
  ssr: false,
  loading: () => <div className="h-40 w-full flex items-center justify-center"><div className="skeleton h-32 w-32 rounded-full"></div></div>
});


interface AutoTradeModalProps {
  isVisible: boolean;
  onClose: () => void;
  onProcessComplete: () => Promise<void>; // Renamed to reflect it's the actual trade processing
}

const AI_MESSAGES = [
  "Initializing AI Core...",
  "Scanning Market Volatility...",
  "Analyzing Signal Matrix...",
  "Cross-referencing Quantum Oracles...",
  "Optimizing Trade Parameters...",
  "Engaging Auto-Trade Protocol...",
  "Final Check: Reality Matrix Alignment...",
];

export const AutoTradeModal: React.FC<AutoTradeModalProps> = ({
  isVisible,
  onClose,
  onProcessComplete,
}) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [displayedMessage, setDisplayedMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0); // For cycling through processing messages
  const { enable } = useAutoTrade();

  const PROCESSING_MESSAGES = ["Calibrating Vectors...", "Executing Quantum Trade...", "Confirming Network Consensus..."];

  useEffect(() => {
    // Typing effect
    if (isVisible && !isProcessing && currentMessageIndex < AI_MESSAGES.length) {
      const targetMessage = AI_MESSAGES[currentMessageIndex];
      if (displayedMessage.length < targetMessage.length) {
        const timer = setTimeout(() => {
          setDisplayedMessage(targetMessage.substring(0, displayedMessage.length + 1));
        }, 30); // Faster typing speed
        return () => clearTimeout(timer);
      }
    }
  }, [isVisible, currentMessageIndex, displayedMessage, isProcessing]);

  useEffect(() => {
    let messageInterval: NodeJS.Timeout;
    // Message progression logic
    if (isVisible && !isProcessing && currentMessageIndex < AI_MESSAGES.length) {
      const currentTargetMessage = AI_MESSAGES[currentMessageIndex];
      if (displayedMessage === currentTargetMessage) {
        messageInterval = setTimeout(() => {
          setCurrentMessageIndex((prevIndex) => {
            if (prevIndex < AI_MESSAGES.length - 1) {
              setDisplayedMessage("");
              return prevIndex + 1;
            } else {
              setIsProcessing(true);
              // setDisplayedMessage("Executing Trade..."); // Initial processing message handled by effect below
              // Call onProcessComplete which will handle the auto-trade logic
              onProcessComplete()
                .catch((e) => console.error("Error during auto-trade process:", e))
                .finally(() => setTimeout(onClose, 300)); // Slightly shorter delay for modal close
              return prevIndex;
            }
          });
        }, 600); // Faster hold time (e.g., 600ms)
      }
    }
    return () => clearInterval(messageInterval);
  }, [isVisible, currentMessageIndex, displayedMessage, onProcessComplete, onClose, isProcessing]);

  useEffect(() => {
    // Cycle through PROCESSING_MESSAGES when isProcessing is true
    let processingInterval: NodeJS.Timeout;
    if (isVisible && isProcessing) {
      processingInterval = setInterval(() => {
        setProcessingStep(prevStep => (prevStep + 1) % PROCESSING_MESSAGES.length);
      }, 700); // Cycle processing messages faster
    }
    return () => clearInterval(processingInterval);
  }, [isVisible, isProcessing]);

  useEffect(() => {
    if (!isVisible) {
      setCurrentMessageIndex(0);
      setDisplayedMessage("");
      setIsProcessing(false);
      setProcessingStep(0);
    }
  }, [isVisible]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: durations.fast }}
        >
          <motion.div
            className="bg-surface p-8 rounded-xl shadow-2xl w-full max-w-md text-center neo-card backdrop-blur-[24px]" // Updated styles per UI revamp
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.25, ease: springEasing }} // 250ms cubic-spring per UI revamp
          >
            <div className="mb-6">
              {/* Replace GIF with Lottie animation */}
              <AutoTradeAnimation className="mb-4" />
              <h2 className="text-2xl font-display font-medium text-primary mb-2">
                Auto-Trading Engaged
              </h2>
              <p className="text-white/70">
                The AI is analyzing optimal entry points...
              </p>
            </div>

            <div className="h-12 flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.p
                  key={currentMessageIndex + (isProcessing ? '_processing' : '_typing')}
                  className="text-lg text-white font-mono"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, ease: standardEasing }} // Faster text transition
                >
                  {isProcessing ? PROCESSING_MESSAGES[processingStep] : displayedMessage}
                </motion.p>
              </AnimatePresence>
            </div>
            
            {isProcessing && (
                 <div className="mt-6 text-sm text-white/50">
                    Oracle Network Synchronizing...
                 </div>
            )}

            {!isProcessing && currentMessageIndex >= AI_MESSAGES.length -1 && (
                 <div className="mt-6 text-sm text-white/50">
                    Preparing to execute...
                 </div>
            )}
            
            {/* Optional: Add a cancel button if the process before onProcessComplete is long */}
            {/* For now, it auto-progresses */}
            {/* 
            {!isProcessing && (
              <div className="mt-8">
                <Button variant="ghost" onClick={onClose} withSound>
                  Cancel Auto-Trade
                </Button>
              </div>
            )}
            */}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AutoTradeModal; 