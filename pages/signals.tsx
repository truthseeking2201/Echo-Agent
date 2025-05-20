import React, { useState } from 'react';
import type { NextPage } from 'next';
import { useEchoStore } from '@/store/echo';
import { motion } from 'framer-motion';
import { durations, standardEasing } from '@/utils/motion';
import Layout from '@/components/Layout';
import SignalCard from '@/components/SignalCard';
import Toast, { ToastType } from '@/components/Toast';

interface ToastState {
  visible: boolean;
  message: string;
  type: ToastType;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const Signals: NextPage = () => {
  const { signals, mirror, settings } = useEchoStore();
  const [toast, setToast] = useState<ToastState>({ visible: false, message: '', type: 'info' });
  const [isLoading, setIsLoading] = useState(false);
  
  // Handle mirroring a signal
  const handleMirror = async (id: string) => {
    try {
      setIsLoading(true);
      setToast({
        visible: true,
        message: 'Submitting transaction...',
        type: 'info'
      });
      
      const trade = await mirror(id);
      
      // Show success toast
      setToast({
        visible: true,
        message: `Transaction confirmed`,
        type: 'success',
        action: {
          label: 'View in Logs',
          onClick: () => window.location.href = '/logs'
        }
      });
    } catch (error) {
      console.error('Error mirroring trade:', error);
      
      // Show error toast
      setToast({
        visible: true,
        message: `Error: ${(error as Error).message || 'Failed to mirror trade'}`,
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Filter signals based on whitelist
  const filteredSignals = settings.whitelist.length > 0
    ? signals.filter(signal => settings.whitelist.includes(signal.caller))
    : signals;

  return (
    <Layout title="Signals">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <motion.h2 
            className="text-xl font-medium text-white"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: durations.medium,
              ease: standardEasing
            }}
          >
            Live Signal Feed
          </motion.h2>
          
          <div className="text-sm text-white/60">
            {settings.whitelist.length > 0 ? (
              <span>Filtered by {settings.whitelist.join(', ')}</span>
            ) : (
              <span>Showing all signals</span>
            )}
          </div>
        </div>
        
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-[100px] w-full skeleton rounded-card"></div>
            ))}
          </div>
        ) : filteredSignals.length === 0 ? (
          <div className="glassmorphic p-8 rounded-card text-center">
            <p className="text-white/40">
              {signals.length === 0 
                ? 'No signals available yet. Please wait for incoming signals.' 
                : 'No signals match your filter criteria. Adjust filters in the sidebar.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredSignals.map((signal, index) => (
              <motion.div
                key={signal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: durations.medium,
                  ease: standardEasing,
                  delay: 0.05 * Math.min(index, 5) // Stagger up to 5 items
                }}
              >
                <SignalCard 
                  signal={signal}
                  onMirror={handleMirror}
                  isPaused={settings.isPaused}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
      
      {/* Toast */}
      {toast.visible && (
        <Toast
          msg={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, visible: false })}
          action={toast.action}
        />
      )}
    </Layout>
  );
};

export default Signals;