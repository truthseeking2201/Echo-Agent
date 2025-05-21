import React, { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import { useEchoStore, Signal } from '@/store/echo';
import { motion, AnimatePresence } from 'framer-motion';
import { durations, standardEasing, staggerChildren } from '@/utils/motion';
import { LayoutShell, useDrawer } from '@/components/LayoutShell';
import SignalCard from '@/components/SignalCard';
import Button from '@/components/Button';
import TradesTable from '@/components/TradesTable';
import Toast, { ToastType } from '@/components/Toast';
import ExecutingTradeAnimation from "@/components/ExecutingTradeAnimation";

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
  const [activeTab, setActiveTab] = useState<'overview' | 'backtest' | 'trades' | 'confirm_mirror' | 'executing_trade'>('overview');
  const { openDrawer, closeDrawer } = useDrawer();
  const [searchQuery, setSearchQuery] = useState("");
  
  const fadeInUp = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: durations.fast,
        ease: standardEasing
      }
    }
  };
  
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
    { id: 'all', label: 'All Signals', icon: '🔍' },
    { id: 'ai', label: 'AI Generated', icon: '🤖' },
    { id: 'stable', label: 'Stable Assets', icon: '🛡️' },
    { id: 'highSharpe', label: 'High Sharpe', icon: '📈' },
    { id: 'favourite', label: 'Favorites', icon: '⭐' }
  ];
  
  const [activeFilter, setActiveFilter] = useState('all');
  
  // Renamed from handleMirror for clarity when passed to animation component
  const executeMirrorTradeLogic = async (id: string): Promise<boolean> => {
    const signalForToast = signals.find(s => s.id === id);
    setIsLoading(true); 
    try {
      const trade = await mirror(id);
      setToast({
        visible: true,
        message: `Trade confirmed for ${trade.token}! Portfolio updated. 🚀`,
        type: 'success'
      });
      closeDrawer(); // Close drawer on success
      setSelectedSignalId(null);
      setActiveTab('overview');
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Error mirroring trade:', error);
      setToast({
        visible: true,
        message: (error as Error).message || 'An unknown error occurred while mirroring.',
        type: 'error',
        action: signalForToast ? { label: 'Retry', onClick: () => executeMirrorTradeLogic(id) } : undefined
      });
      setIsLoading(false);
      return false;
    }
  };

  const handleConfirmAndExecute = () => {
    const currentSignal = signals.find(s => s.id === selectedSignalId);
    if (currentSignal) {
      // setActiveTab('executing_trade'); // This is implicit by calling handleShowDetails with targetTab
      handleShowDetails(currentSignal, 'executing_trade');
    }
  };

  const onTradeAnimationComplete = (success: boolean) => {
    if (success) {
      handleCloseDrawer(); // Use the new consistent way to close drawer
    } else {
      const currentSignal = signals.find(s => s.id === selectedSignalId);
      if (currentSignal) {
        handleShowDetails(currentSignal, 'confirm_mirror');
      } else {
        handleCloseDrawer();
      }
    }
  };

  const handleCloseDrawer = () => {
    closeDrawer();
    setSelectedSignalId(null);
    setActiveTab('overview');
  };
  
  const confirmAndMirror = (signalToConfirm: Signal) => {
    handleShowDetails(signalToConfirm, 'confirm_mirror');
  };
  
  // Handle showing signal details in drawer
  const handleShowDetails = (signal: Signal, targetTab?: 'overview' | 'backtest' | 'trades' | 'confirm_mirror' | 'executing_trade') => {
    const tabToRender = targetTab || 'overview';

    // Set selectedSignalId and activeTab before opening the drawer
    setSelectedSignalId(signal.id);
    setActiveTab(tabToRender);
    
    const relatedTrades = trades.filter(t => t.signalId === signal.id);
    
    openDrawer(
      <div className="space-y-6">
        {(tabToRender !== 'confirm_mirror' && tabToRender !== 'executing_trade') && (
          <div className="flex border-b border-white/10 -mx-4 px-4">
            <button
              className={`py-3 px-4 text-sm font-medium relative ${tabToRender === 'overview' ? 'text-primary' : 'text-white/60 hover:text-white/80'}`}
              onClick={() => handleShowDetails(signal, 'overview')}
            >
              {tabToRender === 'overview' && (
                <motion.div 
                  layoutId="drawer-tab-indicator" 
                  className="absolute bottom-0 left-0 w-full h-0.5 bg-primary" 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                />
              )}
              Overview
            </button>
            <button
              className={`py-3 px-4 text-sm font-medium relative ${tabToRender === 'backtest' ? 'text-primary' : 'text-white/60 hover:text-white/80'}`}
              onClick={() => handleShowDetails(signal, 'backtest')}
            >
              {tabToRender === 'backtest' && (
                <motion.div 
                  layoutId="drawer-tab-indicator" 
                  className="absolute bottom-0 left-0 w-full h-0.5 bg-primary" 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                />
              )}
              Back-test
            </button>
            <button
              className={`py-3 px-4 text-sm font-medium relative ${tabToRender === 'trades' ? 'text-primary' : 'text-white/60 hover:text-white/80'}`}
              onClick={() => handleShowDetails(signal, 'trades')}
            >
              {tabToRender === 'trades' && (
                <motion.div 
                  layoutId="drawer-tab-indicator" 
                  className="absolute bottom-0 left-0 w-full h-0.5 bg-primary" 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                />
              )}
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
              <div className="flex items-center bg-panel p-4 rounded-lg border border-white/10">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mr-4 border border-primary/30 shadow-glow">
                  <span className="text-xl font-mono font-medium text-primary">${signal.token[0]}</span>
                </div>
                <div>
                  <h3 className="text-xl font-display tracking-tight text-white mb-1">
                    ${signal.token}
                  </h3>
                  <div className="flex items-center">
                    <div className="pulsing-dot pulsing-dot-primary"></div>
                    <p className="text-sm font-body text-white/80">{signal.caller}</p>
                  </div>
                </div>
              </div>
              
              <div className="glassmorphic p-4">
                <h4 className="text-sm text-white/70 mb-3 font-medium flex items-center">
                  <svg className="w-4 h-4 mr-2 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 20V10" />
                    <path d="M18 14l-6-6-6 6" />
                  </svg>
                  Signal Confidence
                </h4>
                <div className="flex items-center space-x-2 mb-1">
                  <div className="flex-1 h-3 bg-white/5 rounded-full overflow-hidden backdrop-blur-sm">
                    <motion.div 
                      className={`h-full ${signal.confidence >= 70 ? 'bg-success' : signal.confidence >= 50 ? 'bg-warning' : 'bg-error'}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${signal.confidence}%` }}
                      transition={{ 
                        duration: durations.medium,
                        ease: standardEasing
                      }}
                    />
                  </div>
                  <div className={`
                    px-2 py-1 rounded text-xs font-mono font-medium 
                    ${signal.confidence >= 70 ? 'bg-success/20 text-success border border-success/30' : 
                    signal.confidence >= 50 ? 'bg-warning/20 text-warning border border-warning/30' : 
                    'bg-error/20 text-error border border-error/30'}
                  `}>
                    {signal.confidence}%
                  </div>
                </div>
                <div className="text-xs text-white/50 mt-2">
                  {signal.confidence >= 70 ? 'High confidence signal - recommended for mirroring' : 
                   signal.confidence >= 50 ? 'Moderate confidence - consider with caution' : 
                   'Low confidence - higher risk opportunity'}
                </div>
              </div>
              
              <div className="glassmorphic p-4">
                <h4 className="text-sm text-white/70 mb-3 font-medium flex items-center">
                  <svg className="w-4 h-4 mr-2 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <path d="M14 2v6h6" />
                    <path d="M16 13H8" />
                    <path d="M16 17H8" />
                    <path d="M10 9H8" />
                  </svg>
                  Rationale
                </h4>
                <div className="prose prose-invert text-sm max-w-none bg-white/5 p-3 rounded-lg border border-white/10">
                  {signal.rationaleMd.split('\n').map((line, i) => (
                    <p key={i} className="mb-2">{line}</p>
                  ))}
                </div>
              </div>
              
              <div className="mt-4 flex justify-end">
                <Button
                  variant="gradient"
                  size="lg"
                  onClick={() => confirmAndMirror(signal)}
                  disabled={settings.isPaused}
                  fullWidth
                  withSound
                >
                  <div className="flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 18l6-6-6-6" />
                      <path d="M8 6l-6 6 6 6" />
                    </svg>
                    Mirror Trade
                  </div>
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
                  onClick={() => confirmAndMirror(signal)}
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
                  onClick={() => confirmAndMirror(signal)}
                  disabled={settings.isPaused}
                  fullWidth
                  withSound
                >
                  Mirror Trade
                </Button>
              </div>
            </motion.div>
          )}
          
          {tabToRender === 'confirm_mirror' && signal && (
            <motion.div
              key="confirm_mirror"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6 p-6"
            >
              <h3 className="text-xl font-display tracking-tight text-white">Confirm Mirror Trade</h3>
              <p className="text-white/80">
                You are about to mirror a trade for token: <strong>{signal.token}</strong>.
              </p>
              <p className="text-sm text-white/60">
                This will execute a trade based on the signal from {signal.caller}.
                <br />
                Mock risk based on your settings (currently {settings.maxRiskPct}% of portfolio).
              </p>
               <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-md">
                <p className="text-xs text-yellow-300">
                  <span className="font-bold">Important:</span> Mirror trading involves risks. Past performance is not indicative of future results. Ensure you understand the strategy before proceeding.
                </p>
              </div>
              <div className="flex space-x-3">
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={() => {
                    handleShowDetails(signal, 'overview');
                  }}
                  disabled={isLoading}
                  fullWidth
                >
                  Cancel
                </Button>
                <Button
                  variant="gradient"
                  size="lg"
                  onClick={handleConfirmAndExecute} 
                  disabled={isLoading || settings.isPaused}
                  fullWidth
                  withSound
                >
                  {settings.isPaused ? "Trading Paused" : "Confirm & Execute Trade"}
                </Button>
              </div>
            </motion.div>
          )}
          
          {tabToRender === 'executing_trade' && signal && (
             <motion.div
                key="executing_trade"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="p-0" // Remove padding for the animation component to control its own
              >
                <ExecutingTradeAnimation
                  executeTrade={() => executeMirrorTradeLogic(signal.id)}
                  onAnimationComplete={onTradeAnimationComplete}
                />
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
    
    // Apply search query filter if it exists
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filteredSignals = filteredSignals.filter(
        s => s.token.toLowerCase().includes(query) || 
             s.caller.toLowerCase().includes(query) ||
             s.rationaleMd.toLowerCase().includes(query)
      );
    }
    
    return filteredSignals;
  }, [signals, settings.whitelist, activeFilter, searchQuery]);

  return (
    <LayoutShell title="Signals">
      {/* Hero section */}
      <motion.div 
        className="mb-8 relative overflow-hidden neo-card p-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: standardEasing }}
      >
        {/* Background particles */}
        <div className="absolute inset-0 z-0 overflow-hidden opacity-30">
          <div className="particle-container">
            {[...Array(20)].map((_, i) => (
              <div 
                key={i} 
                className="particle"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  width: `${Math.random() * 4 + 1}px`,
                  height: `${Math.random() * 4 + 1}px`,
                  opacity: Math.random() * 0.5 + 0.3,
                  animationDuration: `${Math.random() * 5 + 10}s`,
                  background: 'rgba(0, 229, 238, 0.8)'
                }}
              />
            ))}
          </div>
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-display font-semibold mb-2 text-white">
              Trading <span className="gradient-text">Signals</span>
            </h1>
            <p className="text-white/70 mb-4 max-w-lg">
              Advanced market signals from our AI models and trusted experts. Mirror trades with a single click.
            </p>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider text-white/50">Intelligence powered by</span>
              <div className="flex items-center">
                <div className="h-6 px-2 rounded-full flex items-center text-xs font-semibold bg-primary/20 text-primary border border-primary/30">
                  <span className="font-mono">Echo ML</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-panel p-3 rounded-lg border border-white/10 shadow-glow max-w-xs w-full">
            <div className="text-sm text-white/70 mb-2">Current Stats</div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-2 bg-white/5 rounded">
                <div className="text-xs text-white/50">Total Signals</div>
                <div className="text-xl font-mono font-bold">{signals.length}</div>
              </div>
              <div className="p-2 bg-white/5 rounded">
                <div className="text-xs text-white/50">Success Rate</div>
                <div className="text-xl font-mono font-bold text-success">87%</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Filter bar with search */}
      <motion.div 
        className="mb-6 p-2 bg-panel rounded-lg shadow-glow border border-white/10"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: standardEasing }}
      >
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search input */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <svg className="w-4 h-4 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search signals by token, caller, or description..."
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white/80 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {/* Filter pills */}
          <div className="flex flex-wrap gap-2">
            {filterOptions.map(filter => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`
                  px-3 py-2 rounded-lg text-sm transition-all duration-fast flex items-center gap-1.5
                  ${activeFilter === filter.id 
                    ? 'bg-primary/20 text-primary border border-primary/30 shadow-glow' 
                    : 'bg-white/5 border border-white/10 text-white/60 hover:text-white/80 hover:bg-white/10'}
                `}
              >
                <span>{filter.icon}</span>
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </motion.div>
      
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
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={staggerChildren(0.05)}
          initial="hidden"
          animate="visible"
        >
          {filteredSignals.map((signal) => (
            <motion.div key={signal.id} variants={fadeInUp} layout>
              <SignalCard 
                signal={signal}
                onMirror={(signalId) => {
                  const sig = signals.find(s => s.id === signalId);
                  if (sig) confirmAndMirror(sig);
                }}
                isPaused={settings.isPaused}
                showDetails={() => handleShowDetails(signal)}
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