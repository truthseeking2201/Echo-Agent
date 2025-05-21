import React, { useEffect, useState } from 'react';
import Alert from './Alert';
import { useEchoStore } from '@/store/echo';

/**
 * Banner that explains the purpose of Echo-Agent
 * Auto-dismisses after first wallet connection
 */
export const PurposeBanner: React.FC = () => {
  const { wallet } = useEchoStore();
  const [isVisible, setIsVisible] = useState(true);
  
  useEffect(() => {
    // Check if user has been onboarded
    const onboarded = localStorage.getItem('eaOnboarded');
    if (onboarded === 'true') {
      setIsVisible(false);
    }
  }, []);
  
  // When wallet connects, mark user as onboarded
  useEffect(() => {
    if (wallet.connected) {
      localStorage.setItem('eaOnboarded', 'true');
      setIsVisible(false);
    }
  }, [wallet.connected]);
  
  const handleClose = () => {
    setIsVisible(false);
  };
  
  if (!isVisible) return null;
  
  return (
    <Alert variant="info" className="mx-auto mb-6 max-w-5xl" onClose={handleClose}>
      Echo-Agent is an AI-driven liquidity vault on Sui.  
      Connect your wallet to simulate, mirror or auto-trade strategies in real time.
    </Alert>
  );
};

export default PurposeBanner;