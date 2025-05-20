import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import { useEchoStore } from '@/store/echo';
import { LayoutShell } from '@/components/LayoutShell';
import PortfolioPanel from '@/components/PortfolioPanel';
import VaRGauge from '@/components/VaRGauge';
import RiskSlider from '@/components/RiskSlider';
import TradesTable from '@/components/TradesTable';
import Button from '@/components/Button';
import { motion } from 'framer-motion';
import { durations, standardEasing, fadeInUp } from '@/utils/motion';
import { normalDist, clamp } from '../mocks/generators/random';
import Toast, { ToastType } from '@/components/Toast';
import useAutoTrade from '@/utils/useAutoTrade';

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
  
  return (
    <LayoutShell title="Overview">
      {/* Balance Banner */}
      <motion.div 
        className="neo-card p-4 mb-6 sticky top-0 z-30"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: durations.medium,
          ease: standardEasing
        }}
      >
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-white/60 text-sm">Balance</h3>
            <div className="text-xl font-mono font-bold">$25,481.62</div>
          </div>
          <Button
            variant="gradient"
            onClick={handleAutoTrade}
            disabled={settings.isPaused || !wallet.connected}
            withSound
          >
            {wallet.connected 
              ? settings.isPaused 
                ? 'Trading Paused' 
                : 'Auto-Trade' 
              : 'Connect Wallet'
            }
          </Button>
        </div>
      </motion.div>
      
      {/* KPI Row 1 */}
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
          className="neo-card p-4"
        >
          <h3 className="text-sm font-medium text-white/70 mb-3">Risk Exposure</h3>
          <div className="flex justify-center">
            <VaRGauge pct={settings.maxRiskPct} />
          </div>
          <div className="mt-4">
            <RiskSlider 
              value={settings.maxRiskPct}
              onChange={setRisk}
              min={1}
              max={40}
              step={1}
            />
          </div>
        </motion.div>
      </div>
      
      {/* Row 2: Simulation Card */}
      <motion.div 
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        transition={{
          duration: durations.medium,
          ease: standardEasing,
          delay: 0.3
        }}
        className="mb-6"
      >
        <div className="neo-card overflow-hidden">
          <div className="flex border-b border-white/10">
            <button
              className={`py-3 px-4 text-sm font-medium ${activeTab === 'portfolio' ? 'text-primary border-b-2 border-primary' : 'text-white/60 hover:text-white/80'}`}
              onClick={() => setActiveTab('portfolio')}
            >
              Quick Simulate
            </button>
          </div>
          
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Select Token
                </label>
                <div className="relative">
                  <select
                    value={tokenToSimulate}
                    onChange={(e) => setTokenToSimulate(e.target.value)}
                    className="w-full px-3 py-2 bg-panel rounded-button border border-white/10 text-sm focus:outline-none focus:ring-1 focus:ring-primary appearance-none"
                  >
                    {SAMPLE_TOKENS.map((t) => (
                      <option key={t} value={t}>${t}</option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 9L2 4H10L6 9Z" fill="white" fillOpacity="0.5"/>
                    </svg>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Position Size: {positionPct}%
                </label>
                <input
                  type="range"
                  min={1}
                  max={40}
                  step={1}
                  value={positionPct}
                  onChange={(e) => setPositionPct(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              {simulationResult && (
                <div className="flex space-x-4">
                  <div>
                    <span className="text-xs text-white/60">Expected P&L</span>
                    <div className={`text-lg font-mono font-bold ${simulationResult.expectedPnL >= 0 ? 'text-success' : 'text-error'}`}>
                      {simulationResult.expectedPnL.toFixed(2)}%
                    </div>
                  </div>
                  <div>
                    <span className="text-xs text-white/60">Win Probability</span>
                    <div className="text-lg font-mono font-bold text-primary">
                      {simulationResult.winProbability.toFixed(1)}%
                    </div>
                  </div>
                </div>
              )}
              
              <Button
                variant="gradient"
                size="md"
                onClick={runSimulation}
                disabled={isSimulating}
                className="ml-auto"
              >
                {isSimulating ? 'Simulating...' : 'Run Simulation'}
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Row 3: Recent Trades */}
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        transition={{
          duration: durations.medium,
          ease: standardEasing,
          delay: 0.4
        }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Recent Trades</h2>
        </div>
        
        <TradesTable trades={trades} limit={5} />
      </motion.div>
      
      {/* Toast Notifications */}
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
          onClose={() => setSimulationToast({ ...simulationToast, visible: false })}
        />
      )}
    </LayoutShell>
  );
};

export default Overview;