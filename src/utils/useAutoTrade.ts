import { useState } from 'react';
import { useEchoStore } from '@/store/echo';
import { ToastType } from '@/components/Toast';

interface ToastState {
  visible: boolean;
  message: string;
  type: ToastType;
}

interface UseAutoTradeResult {
  toast: ToastState;
  handleAutoTrade: () => Promise<void>;
  closeToast: () => void;
}

/**
 * Custom hook for handling auto-trade functionality
 * Consolidates logic used across both dashboard and index pages
 */
export const useAutoTrade = (): UseAutoTradeResult => {
  const { connectWallet, mirror, wallet } = useEchoStore();
  const [toast, setToast] = useState<ToastState>({ visible: false, message: '', type: 'info' });

  const handleAutoTrade = async (): Promise<void> => {
    // Check wallet connection
    if (!wallet.connected) {
      connectWallet();
      return;
    }
    
    // Get latest signals state
    const store = useEchoStore.getState();
    
    // If no signals yet, show a toast
    if (store.signals.length === 0) {
      setToast({
        visible: true,
        message: 'Waiting for signals...',
        type: 'info'
      });
      return;
    }
    
    // Take the first signal and mirror it
    const signal = store.signals[0];
    
    try {
      setToast({
        visible: true,
        message: `Submitting trade for $${signal.token}...`,
        type: 'info'
      });
      
      const trade = await mirror(signal.id);
      
      // Show success toast
      setToast({
        visible: true,
        message: `Signal locked, profit potential engaged 🚀`,
        type: 'success'
      });
    } catch (error) {
      console.error('Error mirroring trade:', error);
      
      // Show error toast with the actual error message
      setToast({
        visible: true,
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`,
        type: 'error'
      });
    }
  };

  const closeToast = () => {
    setToast({ ...toast, visible: false });
  };

  return {
    toast,
    handleAutoTrade,
    closeToast
  };
};

export default useAutoTrade;