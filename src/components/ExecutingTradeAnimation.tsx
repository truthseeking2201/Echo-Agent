import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion'; // Import motion
import { RocketLaunchIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

interface Message {
  text: string;
  delay: number; // Overall delay before next action (typing + hold)
  hold: number; // Time to display the message after typing
}

const initialMessages: Message[] = [
  { text: "Establishing secure link...", delay: 30, hold: 700 },
  { text: "Analyzing market vectors...", delay: 30, hold: 800 },
  { text: "Engaging quantum entanglement...", delay: 30, hold: 900 }, 
];

const processingMessages: string[] = [
  "Accessing quantum channel...",
  "Calibrating neural matrix...",
  "AI core synchronization...",
  "Validating trade parameters...",
  "Optimizing execution path...",
  "Final predictive analysis...",
];

interface ExecutingTradeAnimationProps {
  onAnimationComplete: (success: boolean) => void;
  executeTrade: () => Promise<boolean>;
}

const TYPING_SPEED_FACTOR = 20; // Lower is faster typing per char

const ExecutingTradeAnimation: React.FC<ExecutingTradeAnimationProps> = ({ onAnimationComplete, executeTrade }) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [showIcon, setShowIcon] = useState<'rocket' | 'success' | 'error' | null>('rocket');
  const [isExecuting, setIsExecuting] = useState(false);
  const [currentProcessingMessageIx, setCurrentProcessingMessageIx] = useState(0);
  const [showProcessingPhase, setShowProcessingPhase] = useState(false);
  const [hasStartedExecution, setHasStartedExecution] = useState(false);

  useEffect(() => {
    let typingInterval: NodeJS.Timeout;
    let holdTimeout: NodeJS.Timeout;
    let processingTimeout: NodeJS.Timeout;
    let executionTimeout: NodeJS.Timeout;

    if (showProcessingPhase) {
      if (currentProcessingMessageIx < processingMessages.length * 2) { // Cycle through processing messages twice
        setDisplayedText(processingMessages[currentProcessingMessageIx % processingMessages.length]);
        setShowIcon(null); // Hide rocket during rapid processing
        setIsExecuting(true); // Keep bars active
        processingTimeout = setTimeout(() => {
          setCurrentProcessingMessageIx(prev => prev + 1);
        }, 250); // Very fast cycle for processing messages
      } else if (!hasStartedExecution) {
        // Done with processing messages, now execute
        setHasStartedExecution(true);
        setIsExecuting(true);
        setShowIcon(null);
        setDisplayedText("Executing Trade...");
        
        // Add a small delay before starting actual execution
        executionTimeout = setTimeout(() => {
          executeTrade()
            .then(success => {
              setIsExecuting(false);
              setShowIcon(success ? 'success' : 'error');
              setDisplayedText(success ? "Trade Successful!" : "Trade Failed!");
              setTimeout(() => onAnimationComplete(success), 2000);
            })
            .catch(error => {
              console.error("Error executing trade:", error);
              setIsExecuting(false);
              setShowIcon('error');
              setDisplayedText("Trade Failed!");
              setTimeout(() => onAnimationComplete(false), 2000);
            });
        }, 500);
      }
    } else if (currentMessageIndex < initialMessages.length) {
      const currentMessage = initialMessages[currentMessageIndex];
      setDisplayedText('');
      setShowIcon('rocket');
      setIsExecuting(false);
      let charIndex = 0;
      
      typingInterval = setInterval(() => {
        if (charIndex < currentMessage.text.length) {
          const char = currentMessage.text[charIndex];
          if (char !== undefined) {
            setDisplayedText((prev) => prev + char);
          }
          charIndex++;
        } else {
          clearInterval(typingInterval);
          holdTimeout = setTimeout(() => {
            if (currentMessageIndex === initialMessages.length - 1) {
              setShowProcessingPhase(true); // Move to processing phase
            } else {
              setCurrentMessageIndex((prevIndex) => prevIndex + 1);
            }
          }, currentMessage.hold);
        }
      }, currentMessage.delay / TYPING_SPEED_FACTOR); 
    }

    return () => {
      clearInterval(typingInterval);
      clearTimeout(holdTimeout);
      clearTimeout(processingTimeout);
      clearTimeout(executionTimeout);
    };
  }, [currentMessageIndex, executeTrade, onAnimationComplete, showProcessingPhase, currentProcessingMessageIx, hasStartedExecution]);

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-bg-900 rounded-lg text-white min-h-[250px]">
      {showIcon === 'rocket' && (
        <RocketLaunchIcon className="w-12 h-12 text-purple-400 mb-5 animate-pulse" />
      )}
      {showIcon === 'success' && (
        <CheckCircleIcon className="w-12 h-12 text-green-400 mb-5" />
      )}
      {showIcon === 'error' && (
        <XCircleIcon className="w-12 h-12 text-red-400 mb-5" />
      )}
      <p className={`text-lg font-medium text-center mb-5 min-h-[48px] flex items-center justify-center ${ (isExecuting || showProcessingPhase) && !showIcon ? 'text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-orange-500' : 'text-white'}`}>
        {displayedText || "Initializing..."}
      </p>
      {(isExecuting || (showProcessingPhase && currentProcessingMessageIx < processingMessages.length *2)) && !showIcon && (
        <div className="flex justify-center space-x-1.5 mb-5">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="w-2.5 h-8 bg-primary rounded-full" // Slightly smaller bars
              animate={{
                scaleY: [1, 1.7, 1, 0.6, 1.3, 1],
                opacity: [0.5, 0.9, 0.5, 0.3, 0.8, 0.5],
              }}
              transition={{
                duration: 1.0, // Faster animation for bars
                repeat: Infinity,
                delay: i * 0.1,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ExecutingTradeAnimation;
