import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import { useEchoStore } from '@/store/echo';
import { LayoutShell } from '@/components/LayoutShell';
import PortfolioPanel from '@/components/PortfolioPanel';
import VaRGauge from '@/components/VaRGauge';
import RiskSlider from '@/components/RiskSlider';
import TradesTable from '@/components/TradesTable';
import Button from '@/components/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { durations, standardEasing, fadeInUp } from '@/utils/motion';
import { normalDist, clamp } from '../mocks/generators/random';
import Toast, { ToastType } from '@/components/Toast';
import useAutoTrade from '@/utils/useAutoTrade';
import { AutoTradeModal } from '@/components/AutoTradeModal';

type AutoTradeEngagedStateType = 'idle' | 'processing' | 'active' | 'failed';

interface SimulationToastState {
  visible: boolean;
  message: string;
  type: ToastType;
}

/**
 * New Overview page (Home)
 * Combines dashboard features and quick-simulate widget in a single view
 * Implements the streamlined information architecture from the design guide
 */
const Overview: NextPage = () => {
  const { portfolio, trades, settings, connectWallet, wallet, setRisk, loadSignals } = useEchoStore();
  const { toast: autoTradeToast, handleAutoTrade, closeToast: closeAutoTradeToast } = useAutoTrade();
  const [simulationToast, setSimulationToast] = useState<SimulationToastState>({ visible: false, message: '', type: 'info' });
  const [isAutoTradeModalVisible, setIsAutoTradeModalVisible] = useState(false);
  const [autoTradeEngagedState, setAutoTradeEngagedState] = useState<AutoTradeEngagedStateType>('idle');
  const [activeTab, setActiveTab] = useState<'portfolio' | 'simulate'>('portfolio');
  const [tokenToSimulate, setTokenToSimulate] = useState('ETH');
  const [positionPct, setPositionPct] = useState(settings.maxRiskPct || 10);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState<{
    expectedPnL: number;
    winProbability: number;
  } | null>(null);
  
  // Connect wallet automatically when page loads
  useEffect(() => {
    if (!wallet.connected) {
      connectWallet();
    }
    
    // Load signals to ensure we have latest data
    loadSignals();
  }, [connectWallet, wallet.connected, loadSignals]);
  
  // Run a quick Monte Carlo simulation
  const runSimulation = () => {
    setIsSimulating(true);
    
    // Update risk setting if different
    if (positionPct !== settings.maxRiskPct) {
      setRisk(positionPct);
    }
    
    // Simulate in next tick to allow UI to update
    setTimeout(() => {
      // Number of simulations
      const numSims = 1000;
      
      // Simulation parameters based on token
      const params = {
        mean: tokenToSimulate === 'BTC' ? 0.025 : tokenToSimulate === 'ETH' ? 0.02 : 0.015,
        stdDev: tokenToSimulate === 'BTC' ? 0.05 : tokenToSimulate === 'ETH' ? 0.04 : 0.06
      };
      
      // Generate random PnL values
      let totalReturn = 0;
      let winsCount = 0;
      
      for (let i = 0; i < numSims; i++) {
        // Generate return following normal distribution
        const returnPct = normalDist(params.mean, params.stdDev);
        
        // Apply position sizing
        const scaledReturn = returnPct * (positionPct / 100);
        
        // Clamp extreme values
        const clampedReturn = clamp(scaledReturn, -0.3, 0.5);
        
        totalReturn += clampedReturn;
        
        if (clampedReturn > 0) winsCount++;
      }
      
      // Calculate expected PnL and win probability
      const expectedPnL = totalReturn / numSims * 100; // Convert to percentage
      const winProbability = winsCount / numSims * 100;
      
      setSimulationResult({
        expectedPnL,
        winProbability
      });
      
      setIsSimulating(false);
      
      // Show success toast
      setSimulationToast({
        visible: true,
        message: `Simulation complete. Expected return: ${expectedPnL.toFixed(2)}%`,
        type: 'success'
      });
    }, 1000);
  };
  
  // Sample tokens for the simulation
  const SAMPLE_TOKENS = ["ETH", "BTC", "SOL", "AVAX", "MATIC", "LINK", "PEPE"];
  
  const triggerAutoTradeWithModal = async () => {
    if (settings.isPaused || !wallet.connected || autoTradeEngagedState === 'active' || autoTradeEngagedState === 'processing') return;
    setAutoTradeEngagedState('processing'); // Set state to processing when modal is shown
    setIsAutoTradeModalVisible(true);
  };

  const deactivateAutoTrade = () => {
    setAutoTradeEngagedState('idle');
    // Optionally, inform the user with a toast
    // This assumes useAutoTrade might expose a generic way to show toasts or we add another toast state here
    // For now, just changing state. A toast can be added if `useAutoTrade` is expanded or another state var created.
    setSimulationToast({ // Assuming we might reuse autoTradeToast state for simplicity or add a new one
        visible: true,
        message: "Auto-Trading has been deactivated.",
        type: "info",
    });
  };

  const handleAutoTradeButtonClick = () => {
    if (autoTradeEngagedState === 'active') {
      deactivateAutoTrade();
    } else {
      triggerAutoTradeWithModal();
    }
  };

  const handleModalProcessComplete = async () => {
    try {
      const success = await handleAutoTrade(); // Execute the original auto-trade logic
      if (success) {
        setAutoTradeEngagedState('active');
      } else {
        setAutoTradeEngagedState('failed'); // Could also be 'idle' if 'failed' is too strong
      }
    } catch (e) {
      setAutoTradeEngagedState('failed');
    }
    // Modal will close itself. The toast from useAutoTrade will provide specific feedback.
  };

  const closeAutoTradeModal = () => {
    setIsAutoTradeModalVisible(false);
    // Only reset to idle if it was closed while still in the initial processing stage
    // and not yet completed to active/failed by onProcessComplete.
    if (autoTradeEngagedState === 'processing') {
        setAutoTradeEngagedState('idle');
    }
    // Do not clear autoTradeToast here, as it might be showing success/failure from handleAutoTrade
  };

  const getAutoTradeButtonContent = () => {
    const textClasses = "mr-2";
    let text = "";
    if (!wallet.connected) return <span className={textClasses}>Connect Wallet</span>; // Ensure JSX consistency
    if (settings.isPaused) return <span className={textClasses}>Trading Paused</span>;
    switch (autoTradeEngagedState) {
      case 'processing':
        text = 'AI Processing...';
        break;
      case 'active':
        return (
          <span className="flex items-center justify-center">
            <motion.div 
              className="w-2 h-2 bg-success rounded-full mr-2"
              animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
            />
            <span className={textClasses}>Auto-Trading Active (Click to Disable)</span>
          </span>
        );
      case 'failed':
        text = 'Retry Auto-Trade';
        break;
      case 'idle':
      default:
        text = 'Enable Auto-Trade';
    }
    return <span className={textClasses}>{text}</span>;
  };

  return (
    <LayoutShell title="Overview">
      {/* Hero Section */}
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
              Trading <span className="gradient-text">Dashboard</span>
            </h1>
            <p className="text-white/70 mb-4 max-w-lg">
              Monitor your portfolio, automate trading with AI, and run simulations to maximize your returns.
            </p>
            <div className="flex items-center">
              <div className="pulsing-dot pulsing-dot-primary"></div>
              <span className="text-sm font-mono text-white/60">
                {wallet.connected ? 'Wallet connected' : 'Connect wallet to start trading'}
              </span>
            </div>
          </div>
          
          <div className="flex flex-col space-y-3">
            <div className="bg-panel p-3 rounded-lg border border-white/10 shadow-glow text-center">
              <div className="text-sm text-white/70 mb-1">Account Balance</div>
              <div className="text-2xl font-mono font-bold">$25,481.62</div>
            </div>
            
            <Button
              variant="gradient"
              onClick={handleAutoTradeButtonClick}
              disabled={settings.isPaused || !wallet.connected || autoTradeEngagedState === 'processing'}
              withSound
              className={autoTradeEngagedState === 'active' ? '!bg-success/20 border-success/50 hover:!bg-success/30' : ''}
            >
              {getAutoTradeButtonContent()}
            </Button>
          </div>
        </div>
      </motion.div>
      
      {/* Main Content Tabs */}
      <motion.div 
        className="mb-6 border-b border-white/10"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className="flex space-x-6">
          <button
            onClick={() => setActiveTab('portfolio')}
            className={`py-3 px-1 text-sm font-medium relative ${activeTab === 'portfolio' ? 'text-primary' : 'text-white/60 hover:text-white/80'}`}
          >
            {activeTab === 'portfolio' && (
              <motion.div 
                layoutId="tab-indicator" 
                className="absolute bottom-0 left-0 w-full h-0.5 bg-primary" 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              />
            )}
            Portfolio Analysis
          </button>
          <button
            onClick={() => setActiveTab('simulate')}
            className={`py-3 px-1 text-sm font-medium relative ${activeTab === 'simulate' ? 'text-primary' : 'text-white/60 hover:text-white/80'}`}
          >
            {activeTab === 'simulate' && (
              <motion.div 
                layoutId="tab-indicator" 
                className="absolute bottom-0 left-0 w-full h-0.5 bg-primary" 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              />
            )}
            Quick Simulation
          </button>
        </div>
      </motion.div>
      
      {/* Portfolio Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'portfolio' && (
          <motion.div
            key="portfolio"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {/* KPI Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <motion.div 
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                transition={{
                  duration: durations.medium,
                  ease: standardEasing,
                  delay: 0.1
                }}
                className="col-span-2"
              >
                <PortfolioPanel data={portfolio} showControls={true} isLoading={portfolio.length === 0} />
              </motion.div>
              
              <motion.div 
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                transition={{
                  duration: durations.medium,
                  ease: standardEasing,
                  delay: 0.2
                }}
              >
                <VaRGauge pct={settings.maxRiskPct} />
              </motion.div>
            </div>
            
            {/* Recent Trades */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{
                duration: durations.medium,
                ease: standardEasing,
                delay: 0.3
              }}
            >
              <div className="neo-card p-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-white">Recent Trades</h2>
                  <div className="flex items-center">
                    <div className="pulsing-dot pulsing-dot-success"></div>
                    <span className="text-sm text-white/70">Live updating</span>
                  </div>
                </div>
                
                {trades.length === 0 ? (
                  <div className="glassmorphic p-8 text-center">
                    <p className="empty-state">No trades yet—mirror a signal or enable Auto-Trade to get started.</p>
                  </div>
                ) : (
                  <TradesTable trades={trades.slice(0, 5)} />
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
        
        {activeTab === 'simulate' && (
          <motion.div
            key="simulate"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            <div className="neo-card p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Quick Trade Simulation</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-white/70 mb-2">Select Token</label>
                    <div className="grid grid-cols-4 gap-2">
                      {SAMPLE_TOKENS.map((token) => (
                        <button
                          key={token}
                          onClick={() => setTokenToSimulate(token)}
                          className={`
                            py-2 px-4 text-sm font-mono rounded-lg border transition-all duration-fast
                            ${tokenToSimulate === token 
                              ? 'border-primary/50 bg-primary/10 text-primary' 
                              : 'border-white/10 bg-white/5 text-white/60 hover:text-white/80 hover:bg-white/10'}
                          `}
                        >
                          {token}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm text-white/70 mb-2">Position Size (% of Portfolio)</label>
                    <RiskSlider
                      value={positionPct}
                      onChange={setPositionPct}
                      min={1}
                      max={50}
                      step={1}
                    />
                  </div>
                  
                  <Button
                    variant="gradient"
                    onClick={runSimulation}
                    disabled={isSimulating}
                    withSound
                  >
                    {isSimulating ? 'Simulating...' : 'Run Simulation'}
                  </Button>
                </div>
                
                <div className="glassmorphic p-4">
                  <h3 className="text-sm text-white/70 mb-4 font-medium">Simulation Results</h3>
                  
                  {simulationResult ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 rounded bg-white/5 border border-white/10">
                          <div className="text-xs text-white/50 mb-1">Expected Return</div>
                          <div className={`text-xl font-mono font-bold ${simulationResult.expectedPnL >= 0 ? 'text-success' : 'text-error'}`}>
                            {simulationResult.expectedPnL >= 0 ? '+' : ''}{simulationResult.expectedPnL.toFixed(2)}%
                          </div>
                        </div>
                        <div className="p-3 rounded bg-white/5 border border-white/10">
                          <div className="text-xs text-white/50 mb-1">Win Probability</div>
                          <div className="text-xl font-mono font-bold text-primary">
                            {simulationResult.winProbability.toFixed(1)}%
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-3 rounded bg-white/5 border border-white/10">
                        <div className="text-xs text-white/50 mb-2">Recommendation</div>
                        <div className="text-sm text-white/80">
                          {simulationResult.expectedPnL > 5 
                            ? `This ${tokenToSimulate} trade has a high expected return. Consider executing with the current position size.`
                            : simulationResult.expectedPnL > 0
                              ? `This ${tokenToSimulate} trade has a positive expected return but isn't exceptional. Consider running with a smaller position.`
                              : `This ${tokenToSimulate} trade has a negative expected return. Consider looking for a different opportunity.`
                          }
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="h-40 flex items-center justify-center">
                      <p className="text-sm text-white/40">Run a simulation to see results</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Auto-Trade Modal */}
      {isAutoTradeModalVisible && (
        <AutoTradeModal
          isVisible={true}
          onClose={closeAutoTradeModal}
          onProcessComplete={handleModalProcessComplete}
        />
      )}
      
      {/* Toast messages */}
      {autoTradeToast.visible && (
        <Toast
          msg={autoTradeToast.message}
          type={autoTradeToast.type}
          onClose={closeAutoTradeToast}
        />
      )}
      
      {simulationToast.visible && (
        <Toast
          msg={simulationToast.message}
          type={simulationToast.type}
          onClose={() => setSimulationToast({...simulationToast, visible: false})}
        />
      )}
    </LayoutShell>
  );
};

export default Overview;