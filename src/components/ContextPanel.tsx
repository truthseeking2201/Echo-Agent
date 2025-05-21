import React from 'react';
import { motion } from 'framer-motion';
import { useEchoStore } from '@/store/echo';
import RiskSlider from './RiskSlider';
import ReactMarkdown from 'react-markdown';
import { durations, standardEasing } from '@/utils/motion';

interface ContextPanelProps {
  route: string;
}

/**
 * Dynamic context panel that changes content based on the current route
 * @example
 * <ContextPanel route="/dashboard" />
 */
export const ContextPanel: React.FC<ContextPanelProps> = ({ route }) => {
  const { 
    settings, 
    setRisk, 
    trades,
    signals,
    portfolio,
    whitelistAdd,
    whitelistRemove
  } = useEchoStore();
  
  // State for whitelist input
  const [newCaller, setNewCaller] = React.useState('');
  
  // Selected trade for details view
  const [selectedTradeId, setSelectedTradeId] = React.useState<string | null>(null);
  const selectedTrade = selectedTradeId ? trades.find(t => t.id === selectedTradeId) : null;
  const selectedSignal = selectedTrade ? signals.find(s => s.id === selectedTrade.signalId) : null;
  
  // Panel title based on route
  const panelTitle = 
    route === '/dashboard' ? 'Portfolio Stats' :
    route === '/signals' ? 'Signal Filters' :
    route === '/logs' ? (selectedTrade ? 'Trade Details' : 'Select a Trade') :
    route === '/settings' ? 'Risk Controls' :
    route === '/simulate' ? 'Simulation Controls' :
    'Context Panel';
  
  // Set selected trade ID (from parent component)
  React.useEffect(() => {
    if (route === '/logs' && trades.length > 0 && !selectedTradeId) {
      // Auto-select first trade on logs page if none selected
      setSelectedTradeId(trades[0].id);
    }
  }, [route, trades, selectedTradeId]);
  
  // Handler for whitelist form
  const handleAddCaller = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCaller && !settings.whitelist.includes(newCaller)) {
      whitelistAdd(newCaller);
      setNewCaller('');
    }
  };

  return (
    <div className="bg-surface-dark h-full overflow-auto">
      <div className="p-4">
        <motion.h2 
          className="text-lg font-medium text-white mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: durations.medium,
            ease: standardEasing
          }}
        >
          {panelTitle}
        </motion.h2>
        
        {/* Dashboard context: Portfolio stats */}
        {route === '/dashboard' && (
          <div className="space-y-4">
            <motion.div 
              className="glassmorphic p-4 rounded-card"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: durations.medium,
                ease: standardEasing,
                delay: 0.1
              }}
            >
              <h3 className="text-sm font-medium text-white/60 mb-2">Equity Curve</h3>
              <div className="text-2xl font-mono font-bold">
                {portfolio.length > 0 && (
                  <span className={portfolio[portfolio.length - 1].v >= 0 ? 'text-success' : 'text-error'}>
                    {portfolio[portfolio.length - 1].v.toFixed(2)}%
                  </span>
                )}
              </div>
              <p className="text-xs text-white/40 mt-1">Total Return</p>
            </motion.div>
            
            <motion.div 
              className="glassmorphic p-4 rounded-card"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: durations.medium,
                ease: standardEasing,
                delay: 0.2
              }}
            >
              <h3 className="text-sm font-medium text-white/60 mb-2">Win Rate</h3>
              <div className="text-2xl font-mono font-bold text-primary">
                {trades.length > 0 ? (
                  `${Math.round((trades.filter(t => t.pnlPercent > 0).length / trades.length) * 100)}%`
                ) : '0%'}
              </div>
              <p className="text-xs text-white/40 mt-1">Profitable Trades</p>
            </motion.div>
            
            <motion.div 
              className="glassmorphic p-4 rounded-card"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: durations.medium,
                ease: standardEasing,
                delay: 0.3
              }}
            >
              <h3 className="text-sm font-medium text-white/60 mb-2">Trade Volume</h3>
              <div className="text-2xl font-mono font-bold text-ink">
                {trades.length}
              </div>
              <p className="text-xs text-white/40 mt-1">Total Trades</p>
            </motion.div>
          </div>
        )}
        
        {/* Signals context: Filters */}
        {route === '/signals' && (
          <div className="space-y-4">
            <motion.div 
              className="glassmorphic p-4 rounded-card"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: durations.medium,
                ease: standardEasing,
                delay: 0.1
              }}
            >
              <h3 className="text-sm font-medium text-white/60 mb-2">Caller Whitelist</h3>
              
              <form onSubmit={handleAddCaller} className="flex mb-2">
                <input
                  type="text"
                  value={newCaller}
                  onChange={(e) => setNewCaller(e.target.value)}
                  placeholder="@username"
                  className="flex-grow px-3 py-1.5 bg-surface rounded-l-button border border-white/10 text-sm focus:outline-none focus:ring-1 focus:ring-ink"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-primary rounded-r-button text-white text-sm"
                >
                  Add
                </button>
              </form>
              
              <div className="mt-2 flex flex-wrap gap-2">
                {settings.whitelist.map((caller) => (
                  <div 
                    key={caller}
                    className="flex items-center space-x-1 px-2 py-1 bg-white/5 rounded-full text-xs"
                  >
                    <span>{caller}</span>
                    <button
                      type="button"
                      onClick={() => whitelistRemove(caller)}
                      className="ml-1 text-white/40 hover:text-white/80"
                      aria-label={`Remove ${caller}`}
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 4L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M4 4L12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                ))}
                
                {settings.whitelist.length === 0 && (
                  <p className="text-xs text-white/40">
                    No callers whitelisted. Add callers to filter signals.
                  </p>
                )}
              </div>
            </motion.div>
            
            <motion.div 
              className="glassmorphic p-4 rounded-card"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: durations.medium,
                ease: standardEasing,
                delay: 0.2
              }}
            >
              <h3 className="text-sm font-medium text-white/60 mb-2">Min Confidence</h3>
              <RiskSlider 
                value={50} // This would be a separate filter setting
                min={0}
                max={100}
                step={5}
                onChange={() => {}} // Implement filter by confidence
                label="Minimum Confidence"
              />
            </motion.div>
          </div>
        )}
        
        {/* Logs context: Trade details */}
        {route === '/logs' && selectedTrade && selectedSignal && (
          <div className="space-y-4">
            <motion.div 
              className="glassmorphic p-4 rounded-card"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: durations.medium,
                ease: standardEasing,
                delay: 0.1
              }}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center">
                  <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center mr-2">
                    <span className="text-sm font-medium text-primary">${selectedTrade.token[0]}</span>
                  </div>
                  <h3 className="text-lg font-medium text-white">
                    ${selectedTrade.token}
                  </h3>
                </div>
                <span className={`text-sm font-medium px-2 py-0.5 rounded-full ${
                  selectedTrade.side === 'BUY' ? 'bg-success/20 text-success' : 'bg-error/20 text-error'
                }`}>
                  {selectedTrade.side}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div>
                  <p className="text-xs text-white/60">Quantity</p>
                  <p className="text-sm font-mono">{selectedTrade.qty}</p>
                </div>
                <div>
                  <p className="text-xs text-white/60">Price</p>
                  <p className="text-sm font-mono">${selectedTrade.price.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs text-white/60">PnL</p>
                  <p className={`text-sm font-mono ${selectedTrade.pnlPercent >= 0 ? 'text-success' : 'text-error'}`}>
                    {selectedTrade.pnlPercent >= 0 ? '+' : ''}{selectedTrade.pnlPercent}%
                  </p>
                </div>
                <div>
                  <p className="text-xs text-white/60">Status</p>
                  <p className="text-sm font-mono">{selectedTrade.status}</p>
                </div>
              </div>
              
              <div className="mt-4">
                <p className="text-xs text-white/60 mb-1">Transaction</p>
                <p className="text-xs font-mono text-primary/80 break-all">
                  {selectedTrade.txHash}
                </p>
              </div>
            </motion.div>
            
            <motion.div 
              className="glassmorphic p-4 rounded-card"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: durations.medium,
                ease: standardEasing,
                delay: 0.2
              }}
            >
              <h3 className="text-sm font-medium text-white/60 mb-2">Signal Rationale</h3>
              <div className="text-xs prose prose-invert max-w-none">
                <ReactMarkdown>
                  {selectedSignal.rationaleMd}
                </ReactMarkdown>
              </div>
              <div className="mt-2 text-xs text-white/40">
                Signal from {selectedSignal.caller} with {selectedSignal.confidence}% confidence
              </div>
            </motion.div>
          </div>
        )}
        
        {/* Settings context: Risk controls */}
        {route === '/settings' && (
          <div className="space-y-4">
            <motion.div 
              className="glassmorphic p-4 rounded-card"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: durations.medium,
                ease: standardEasing,
                delay: 0.1
              }}
            >
              <h3 className="text-sm font-medium text-white/60 mb-2">Max Risk %</h3>
              <RiskSlider 
                value={settings.maxRiskPct}
                onChange={setRisk}
                description="Controls maximum exposure per position as a percentage of your portfolio."
              />
            </motion.div>
            
            <motion.div 
              className="glassmorphic p-4 rounded-card"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: durations.medium,
                ease: standardEasing,
                delay: 0.2
              }}
            >
              <h3 className="text-sm font-medium text-white/60 mb-2">Auto-Trade Settings</h3>
              
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm">Kill Switch</span>
                <div
                  onClick={() => useEchoStore.getState().togglePause()}
                  className="cursor-pointer"
                >
                  <KillSwitchToggle 
                    isPaused={settings.isPaused}
                    onToggle={() => null} // handled in the onClick above
                  />
                </div>
              </div>
              
              <p className="mt-2 text-xs text-white/40">
                When paused, Echo will not execute any trades automatically.
              </p>
            </motion.div>
          </div>
        )}
        
        {/* Simulate context */}
        {route === '/simulate' && (
          <div className="space-y-4">
            <motion.div 
              className="glassmorphic p-4 rounded-card"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: durations.medium,
                ease: standardEasing,
                delay: 0.1
              }}
            >
              <h3 className="text-sm font-medium text-white/60 mb-2">Simulation Mode</h3>
              <p className="text-xs text-white/60 mb-4">
                This interface allows you to run backtests and simulations to predict potential performance.
              </p>
              
              <div className="bg-primary/10 p-3 rounded-lg border border-primary/20">
                <p className="text-xs text-primary/80">
                  All simulations run with synthetic data for demo purposes only.
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

// Import KillSwitchToggle at the end to avoid circular references
import KillSwitchToggle from './KillSwitchToggle';

export default ContextPanel;