import React from 'react';
import type { NextPage } from 'next';
import { useEchoStore } from '@/store/echo';
import Layout from '@/components/Layout';
import RiskSlider from '@/components/RiskSlider';
import KillSwitchToggle from '@/components/KillSwitchToggle';

const Settings: NextPage = () => {
  const { settings, setRisk, togglePause, whitelistAdd, whitelistRemove } = useEchoStore();
  const [newCaller, setNewCaller] = React.useState('');
  
  // Handler for whitelist form
  const handleAddCaller = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCaller && !settings.whitelist.includes(newCaller)) {
      whitelistAdd(newCaller);
      setNewCaller('');
    }
  };
  
  return (
    <Layout title="Settings">
      <div className="max-w-3xl mx-auto">
        <div className="space-y-8">
          {/* Risk Controls Section */}
          <section>
            <h2 className="text-xl font-medium mb-4">Risk Controls</h2>
            
            <div className="bg-surface-card rounded-lg p-6">
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Max Risk Percentage</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Controls maximum exposure per position as a percentage of your portfolio.
                </p>
                
                <RiskSlider 
                  value={settings.maxRiskPct}
                  onChange={setRisk}
                />
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Kill Switch</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Immediately pause all auto-trading activity. When paused, Echo will not execute any trades.
                </p>
                
                <KillSwitchToggle 
                  isPaused={settings.isPaused}
                  onToggle={togglePause}
                />
              </div>
            </div>
          </section>
          
          {/* Signal Filter Section */}
          <section>
            <h2 className="text-xl font-medium mb-4">Signal Filters</h2>
            
            <div className="bg-surface-card rounded-lg p-6">
              <h3 className="text-lg font-medium mb-2">Caller Whitelist</h3>
              <p className="text-gray-400 text-sm mb-4">
                Only process signals from these callers. Leave empty to consider all signals.
              </p>
              
              <form onSubmit={handleAddCaller} className="flex mb-4">
                <input
                  type="text"
                  value={newCaller}
                  onChange={(e) => setNewCaller(e.target.value)}
                  placeholder="@username"
                  className="flex-grow px-3 py-2 bg-surface rounded-l-md border border-gray-700 text-sm focus:outline-none focus:ring-1 focus:ring-electric-ink"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary rounded-r-md text-white text-sm font-medium hover:bg-primary-dark transition-colors"
                >
                  Add
                </button>
              </form>
              
              <div className="mt-4 flex flex-wrap gap-2">
                {settings.whitelist.map((caller) => (
                  <div 
                    key={caller}
                    className="flex items-center space-x-1 px-3 py-1 bg-surface rounded-md text-sm"
                  >
                    <span>{caller}</span>
                    <button
                      type="button"
                      onClick={() => whitelistRemove(caller)}
                      className="ml-2 text-gray-400 hover:text-red-400"
                      aria-label={`Remove ${caller} from whitelist`}
                    >
                      ×
                    </button>
                  </div>
                ))}
                
                {settings.whitelist.length === 0 && (
                  <p className="text-sm text-gray-500">
                    No callers whitelisted. Echo will consider signals from all sources.
                  </p>
                )}
              </div>
            </div>
          </section>
          
          {/* Notification Settings (future expansion) */}
          <section>
            <h2 className="text-xl font-medium mb-4">Demo Information</h2>
            
            <div className="bg-surface-card rounded-lg p-6">
              <div className="flex items-center justify-center p-3 bg-purple-500/20 rounded-md mb-4">
                <span className="text-purple-300 text-sm font-medium">DEMO MODE ACTIVE</span>
              </div>
              
              <p className="text-gray-400 text-sm mb-2">
                This is a demonstration with synthetic data. No real funds are at risk.
              </p>
              <p className="text-gray-400 text-sm">
                All transactions, signals, and portfolio data are simulated for demonstration purposes.
              </p>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;