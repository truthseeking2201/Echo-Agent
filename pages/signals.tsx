import React, { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import { useEchoStore } from '@/store/echo';
import { motion, AnimatePresence } from 'framer-motion';
import { durations, standardEasing, staggerChildren } from '@/utils/motion';
import { LayoutShell, useDrawer } from '@/components/LayoutShell';
import SignalCard from '@/components/SignalCard';
import Button from '@/components/Button';
import TradesTable from '@/components/TradesTable';
import Toast, { ToastType } from '@/components/Toast';
import type { Signal } from '@/store/echo';

interface ToastState {
  visible: boolean;
  message: string;
  type: ToastType;
  action?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * Redesigned Signals page with masonry grid layout and drawer details panel
 * Combines Signals + Logs for better context retention
 */
const Signals: NextPage = () => {
  const { signals, trades, mirror, settings, loadSignals } = useEchoStore();
  const [toast, setToast] = useState<ToastState>({ visible: false, message: '', type: 'info' });
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSignalId, setSelectedSignalId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'backtest' | 'trades' | 'confirm_mirror'>('overview');
  const { openDrawer, closeDrawer } = useDrawer();
  
  // Load signals on initial render
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await loadSignals();
      setIsLoading(false);
    };
    
    fetchData();
  }, [loadSignals]);
  
  // Filter chips for signals
  const filterOptions = [
    { id: 'all', label: 'All' },
    { id: 'ai', label: 'AI' },
    { id: 'stable', label: 'Stable' },
    { id: 'highSharpe', label: 'High Sharpe' },
    { id: 'favourite', label: 'Favourites' }
  ];
  
  const [activeFilter, setActiveFilter] = useState('all');
  
  // Handle mirroring a signal
  const handleMirror = async (id: string) => {
    const signalForConfirmation = signals.find(s => s.id === id);

    try {
      setIsLoading(true);
      setToast({
        visible: true,
        message: 'Attempting to engage signal... Stand by.',
        type: 'info'
      });
      
      const trade = await mirror(id);
      
      setToast({
        visible: true,
        message: `Trade confirmed for ${trade.token}! Your portfolio is morphing.`,
        type: 'success'
      });
      closeDrawer();
      
    } catch (error) {
      console.error('Error mirroring trade:', error);
      setToast({
        visible: true,
        message: (error as Error).message || 'An unknown error occurred while mirroring.',
        type: 'error'
      });
      if (signalForConfirmation) {
        handleShowDetails(id, 'overview');
      } else {
        closeDrawer();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const confirmAndMirror = (signalToConfirm: Signal) => {
    handleShowDetails(signalToConfirm.id, 'confirm_mirror');
  };
  
  // Handle showing signal details in drawer
  const handleShowDetails = (signalId: string, targetTab?: 'overview' | 'backtest' | 'trades' | 'confirm_mirror') => {
    const signalToDisplay = signals.find(s => s.id === signalId);
    if (!signalToDisplay) {
      closeDrawer();
      return;
    }

    const tabToRender = targetTab || 'overview';

    if (activeTab !== tabToRender) {
      setActiveTab(tabToRender);
    }
    if (selectedSignalId !== signalId) {
      setSelectedSignalId(signalId);
    }
    
    const relatedTrades = trades.filter(t => t.signalId === signalToDisplay.id);
    
    openDrawer(
      <div className="space-y-6">
        {tabToRender !== 'confirm_mirror' && (
          <div className="flex border-b border-white/10 -mx-4 px-4">
            <button
              className={`py-3 px-4 text-sm font-medium ${tabToRender === 'overview' ? 'text-primary border-b-2 border-primary' : 'text-white/60 hover:text-white/80'}`}
              onClick={() => handleShowDetails(signalId, 'overview')}
            >
              Overview
            </button>
            <button
              className={`py-3 px-4 text-sm font-medium ${tabToRender === 'backtest' ? 'text-primary border-b-2 border-primary' : 'text-white/60 hover:text-white/80'}`}
              onClick={() => handleShowDetails(signalId, 'backtest')}
            >
              Back-test
            </button>
            <button
              className={`py-3 px-4 text-sm font-medium ${tabToRender === 'trades' ? 'text-primary border-b-2 border-primary' : 'text-white/60 hover:text-white/80'}`}
              onClick={() => handleShowDetails(signalId, 'trades')}
            >
              Trade Log
            </button>
          </div>
        )}
        
        <AnimatePresence mode="wait">
          {tabToRender === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                  <span className="text-lg font-mono font-medium text-primary">${signalToDisplay.token[0]}</span>
                </div>
                <div>
                  <h3 className="text-xl font-display tracking-tight text-white">
                    ${signalToDisplay.token}
                  </h3>
                  <p className="text-sm font-body text-white/60">{signalToDisplay.caller}</p>
                </div>
              </div>
              
              <div className="glassmorphic p-4">
                <h4 className="text-sm text-white/70 mb-2 font-medium">Signal Confidence</h4>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${signalToDisplay.confidence >= 70 ? 'bg-success' : signalToDisplay.confidence >= 50 ? 'bg-warning' : 'bg-error'}`}
                      style={{ width: `${signalToDisplay.confidence}%` }}
                    />
                  </div>
                  <span className={`text-sm font-mono font-medium ${signalToDisplay.confidence >= 70 ? 'text-success' : signalToDisplay.confidence >= 50 ? 'text-warning' : 'text-error'}`}>
                    {signalToDisplay.confidence}%
                  </span>
                </div>
              </div>
              
              <div className="glassmorphic p-4">
                <h4 className="text-sm text-white/70 mb-2 font-medium">Rationale</h4>
                <div className="prose prose-invert text-sm max-w-none">
                  {signalToDisplay.rationaleMd.split('\n').map((line, i) => (
                    <p key={i} className="mb-2">{line}</p>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-center">
                <Button
                  variant="gradient"
                  size="md"
                  onClick={() => confirmAndMirror(signalToDisplay)}
                  disabled={settings.isPaused}
                  fullWidth
                  withSound
                >
                  Mirror Trade
                </Button>
              </div>
            </motion.div>
          )}
          
          {tabToRender === 'backtest' && (
            <motion.div
              key="backtest"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div className="neo-card p-4">
                <h4 className="text-sm text-white/70 mb-4 font-medium">Back-test Performance</h4>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="glassmorphic p-3">
                    <div className="text-xs text-white/50 mb-1">Sharpe Ratio</div>
                    <div className="text-lg font-mono font-bold text-primary">1.87</div>
                  </div>
                  <div className="glassmorphic p-3">
                    <div className="text-xs text-white/50 mb-1">Win Rate</div>
                    <div className="text-lg font-mono font-bold text-success">68%</div>
                  </div>
                  <div className="glassmorphic p-3">
                    <div className="text-xs text-white/50 mb-1">Avg Return</div>
                    <div className="text-lg font-mono font-bold text-white">+3.2%</div>
                  </div>
                  <div className="glassmorphic p-3">
                    <div className="text-xs text-white/50 mb-1">Max Drawdown</div>
                    <div className="text-lg font-mono font-bold text-error">-12.4%</div>
                  </div>
                </div>
                
                <div className="h-40 flex items-center justify-center bg-white/5 rounded-lg">
                  <p className="text-sm text-white/40">Historical performance chart</p>
                </div>
              </div>
              
              <div className="flex justify-center">
                <Button
                  variant="gradient"
                  size="md"
                  onClick={() => confirmAndMirror(signalToDisplay)}
                  disabled={settings.isPaused}
                  fullWidth
                  withSound
                >
                  Mirror Trade
                </Button>
              </div>
            </motion.div>
          )}
          
          {tabToRender === 'trades' && (
            <motion.div
              key="trades"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div className="neo-card p-4">
                <h4 className="text-sm text-white/70 mb-4 font-medium">Trade History</h4>
                
                {relatedTrades.length > 0 ? (
                  <TradesTable trades={relatedTrades} />
                ) : (
                  <div className="glassmorphic p-4 text-center">
                    <p className="text-sm text-white/40">No signals yet—spin up your first AI strategy.</p>
                  </div>
                )}
              </div>
              
              <div className="flex justify-center">
                <Button
                  variant="gradient"
                  size="md"
                  onClick={() => confirmAndMirror(signalToDisplay)}
                  disabled={settings.isPaused}
                  fullWidth
                  withSound
                >
                  Mirror Trade
                </Button>
              </div>
            </motion.div>
          )}
          
          {tabToRender === 'confirm_mirror' && signalToDisplay && (
            <motion.div
              key="confirm_mirror"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6 p-4"
            >
              <h3 className="text-xl font-display tracking-tight text-white">Confirm Mirror Trade</h3>
              <p className="text-white/80">
                You are about to mirror a trade for token: <strong>{signalToDisplay.token}</strong>.
              </p>
              <p className="text-sm text-white/60">
                This will execute a trade based on the signal from {signalToDisplay.caller}.
                <br />
                Mock risk based on your settings (currently {settings.maxRiskPct}% of portfolio).
              </p>
              <div className="mt-6 flex flex-col space-y-3">
                <Button
                  variant="solid"
                  size="lg"
                  onClick={() => handleMirror(signalToDisplay.id)}
                  disabled={isLoading || settings.isPaused}
                  fullWidth
                  withSound
                >
                  {isLoading ? 'Processing...' : 'Confirm & Execute Trade'}
                </Button>
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={() => {
                    handleShowDetails(signalToDisplay.id, 'overview');
                  }}
                  disabled={isLoading}
                  fullWidth
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };
  
  // Filter signals based on whitelist and active filter
  const filteredSignals = React.useMemo(() => {
    let filteredSignals = settings.whitelist.length > 0
      ? signals.filter(signal => settings.whitelist.includes(signal.caller))
      : [...signals];
    
    // Apply additional filter if not on 'all'
    if (activeFilter !== 'all') {
      // This is a demo, so we'll just filter randomly based on the filter
      if (activeFilter === 'ai') {
        filteredSignals = filteredSignals.filter(s => s.caller.includes('AI') || Math.random() > 0.5);
      } else if (activeFilter === 'stable') {
        filteredSignals = filteredSignals.filter(s => s.token === 'ETH' || s.token === 'BTC' || s.token === 'USDC');
      } else if (activeFilter === 'highSharpe') {
        filteredSignals = filteredSignals.filter(s => s.confidence > 65);
      } else if (activeFilter === 'favourite') {
        filteredSignals = filteredSignals.filter(s => Math.random() > 0.7); // Random selection for demo
      }
    }
    
    return filteredSignals;
  }, [signals, settings.whitelist, activeFilter]);

  return (
    <LayoutShell title="Signals">
      {/* Filter chips */}
      <div className="mb-6 flex flex-wrap gap-2">
        {filterOptions.map(filter => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={`
              px-3 py-1.5 rounded-full text-sm transition-all duration-fast
              ${activeFilter === filter.id 
                ? 'bg-primary/20 text-primary shadow-glow' 
                : 'bg-panel text-white/60 hover:text-white/80'}
            `}
          >
            {filter.label}
          </button>
        ))}
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-[140px] w-full skeleton rounded-card"></div>
          ))}
        </div>
      ) : filteredSignals.length === 0 ? (
        <div className="glassmorphic p-8 rounded-card text-center">
          <p className="empty-state">
            {signals.length === 0 
              ? 'No signals yet—spin up your first AI strategy.' 
              : 'No signals match your filter criteria. Try another filter.'}
          </p>
        </div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          variants={staggerChildren(0.05)}
          initial="hidden"
          animate="visible"
        >
          {filteredSignals.map((signal, index) => (
            <motion.div
              key={signal.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { 
                  opacity: 1, 
                  y: 0,
                  transition: {
                    duration: durations.medium,
                    ease: standardEasing
                  }
                }
              }}
            >
              <SignalCard 
                signal={signal}
                onMirror={handleMirror}
                isPaused={settings.isPaused}
                showDetails={() => handleShowDetails(signal.id)}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
      
      {/* Toast */}
      {toast.visible && (
        <Toast
          msg={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, visible: false })}
          action={toast.action}
        />
      )}
    </LayoutShell>
  );
};

export default Signals;