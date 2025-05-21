import React from 'react';
import type { NextPage } from 'next';
import { useEchoStore } from '@/store/echo';
import { motion } from 'framer-motion';
import { LayoutShell } from '@/components/LayoutShell';
import RiskSlider from '@/components/RiskSlider';
import Button from '@/components/Button';
import { durations, standardEasing, fadeInUp } from '@/utils/motion';

/**
 * Redesigned Settings page with accordions and streamlined UX
 * Settings isolated from other pages to ensure lower friction
 */
const Settings: NextPage = () => {
  const { settings, setRisk, togglePause, whitelistAdd, whitelistRemove } = useEchoStore();
  const [newCaller, setNewCaller] = React.useState('');
  const [expanded, setExpanded] = React.useState<string | null>('risk-controls');
  
  // Handler for whitelist form
  const handleAddCaller = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCaller && !settings.whitelist.includes(newCaller)) {
      whitelistAdd(newCaller);
      setNewCaller('');
    }
  };
  
  // Toggle accordion sections
  const toggleSection = (section: string) => {
    if (expanded === section) {
      setExpanded(null);
    } else {
      setExpanded(section);
    }
  };
  
  // Helper for energy level slider (theme intensity)
  const updateEnergyLevel = (value: number) => {
    // Update CSS variable
    document.documentElement.style.setProperty('--energy-level', value.toString());
  };
  
  return (
    <LayoutShell title="Settings">
      <div className="max-w-3xl mx-auto">
        {/* Accordion Sections */}
        <div className="space-y-4">
          {/* Risk Controls Section */}
          <motion.section 
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{
              duration: durations.medium,
              ease: standardEasing,
              delay: 0.1
            }}
            className="neo-card overflow-hidden"
          >
            <button
              className="w-full p-4 flex justify-between items-center focus:outline-none"
              onClick={() => toggleSection('risk-controls')}
            >
              <h2 className="text-lg font-medium text-left">Risk Controls</h2>
              <div className={`transform transition-transform duration-fast ${expanded === 'risk-controls' ? 'rotate-180' : ''}`}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </button>
            
            {expanded === 'risk-controls' && (
              <motion.div 
                className="p-4 pt-0 border-t border-white/10"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: durations.medium, ease: standardEasing }}
              >
                <div className="mb-6">
                  <h3 className="text-base font-medium mb-2">Max Risk Percentage</h3>
                  <p className="text-white/60 text-sm mb-4">
                    Controls maximum exposure per position as a percentage of your portfolio.
                  </p>
                  
                  <RiskSlider 
                    value={settings.maxRiskPct}
                    onChange={setRisk}
                    min={1}
                    max={40}
                    step={1}
                  />
                </div>
                
                <div>
                  <h3 className="text-base font-medium mb-2">Kill Switch</h3>
                  <p className="text-white/60 text-sm mb-4">
                    Immediately pause all auto-trading. When paused, Echo will not execute any trades.
                  </p>
                  
                  <div className="flex items-center">
                    <button
                      onClick={togglePause}
                      className={`
                        relative rounded-full w-12 h-6 flex items-center
                        transition-colors duration-fast
                        ${settings.isPaused ? 'bg-error/30' : 'bg-success/30'}
                      `}
                      aria-label={settings.isPaused ? "Resume trading" : "Pause trading"}
                    >
                      <motion.div 
                        className={`
                          absolute w-5 h-5 rounded-full shadow-md
                          ${settings.isPaused ? 'bg-error' : 'bg-success'}
                        `}
                        animate={{ 
                          x: settings.isPaused ? 2 : 25
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 30
                        }}
                      />
                    </button>
                    <span className="ml-3 text-sm">
                      {settings.isPaused ? 'Trading Paused' : 'Trading Active'}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.section>
          
          {/* Signal Filter Section */}
          <motion.section 
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{
              duration: durations.medium,
              ease: standardEasing,
              delay: 0.2
            }}
            className="neo-card overflow-hidden"
          >
            <button
              className="w-full p-4 flex justify-between items-center focus:outline-none"
              onClick={() => toggleSection('signal-filters')}
            >
              <h2 className="text-lg font-medium text-left">Signal Filters</h2>
              <div className={`transform transition-transform duration-fast ${expanded === 'signal-filters' ? 'rotate-180' : ''}`}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </button>
            
            {expanded === 'signal-filters' && (
              <motion.div 
                className="p-4 pt-0 border-t border-white/10"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: durations.medium, ease: standardEasing }}
              >
                <div>
                  <h3 className="text-base font-medium mb-2">Caller Whitelist</h3>
                  <p className="text-white/60 text-sm mb-4">
                    Only process signals from these callers. Leave empty to consider all signals.
                  </p>
                  
                  <form onSubmit={handleAddCaller} className="flex mb-4">
                    <input
                      type="text"
                      value={newCaller}
                      onChange={(e) => setNewCaller(e.target.value)}
                      placeholder="@username"
                      className="flex-grow px-3 py-2 bg-panel rounded-l-button border border-white/10 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <Button
                      type="submit"
                      variant="gradient"
                      className="rounded-l-none"
                    >
                      Add
                    </Button>
                  </form>
                  
                  <div className="mt-4 flex flex-wrap gap-2">
                    {settings.whitelist.map((caller) => (
                      <div 
                        key={caller}
                        className="flex items-center space-x-1 px-3 py-1.5 bg-panel rounded-full text-sm"
                      >
                        <span>{caller}</span>
                        <button
                          type="button"
                          onClick={() => whitelistRemove(caller)}
                          className="ml-2 text-white/40 hover:text-error-400"
                          aria-label={`Remove ${caller} from whitelist`}
                        >
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 4L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M4 4L12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                      </div>
                    ))}
                    
                    {settings.whitelist.length === 0 && (
                      <p className="text-sm text-white/40">
                        No callers whitelisted. Echo will consider signals from all sources.
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </motion.section>
          
          {/* Visual Settings Section */}
          <motion.section 
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{
              duration: durations.medium,
              ease: standardEasing,
              delay: 0.3
            }}
            className="neo-card overflow-hidden"
          >
            <button
              className="w-full p-4 flex justify-between items-center focus:outline-none"
              onClick={() => toggleSection('visual-settings')}
            >
              <h2 className="text-lg font-medium text-left">Visual Settings</h2>
              <div className={`transform transition-transform duration-fast ${expanded === 'visual-settings' ? 'rotate-180' : ''}`}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </button>
            
            {expanded === 'visual-settings' && (
              <motion.div 
                className="p-4 pt-0 border-t border-white/10"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: durations.medium, ease: standardEasing }}
              >
                <div>
                  <h3 className="text-base font-medium mb-2">Neon Intensity</h3>
                  <p className="text-white/60 text-sm mb-4">
                    Adjust the energy level of neon effects throughout the interface.
                  </p>
                  
                  <div className="mb-6">
                    <div className="relative">
                      <input
                        type="range"
                        min={0.5}
                        max={2}
                        step={0.1}
                        defaultValue={1}
                        onChange={(e) => updateEnergyLevel(parseFloat(e.target.value))}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-white/40 mt-1">
                        <span>Subtle</span>
                        <span>Normal</span>
                        <span>Intense</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex space-x-2">
                      <div className="p-4 flex-1 neo-card shadow-neon flex items-center justify-center">
                        <span className="text-primary">Preview</span>
                      </div>
                      <div className="p-4 flex-1 neo-card shadow-neon-accent flex items-center justify-center">
                        <span className="text-accent">Preview</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.section>
          
          {/* Demo Information Section */}
          <motion.section 
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{
              duration: durations.medium,
              ease: standardEasing,
              delay: 0.4
            }}
            className="neo-card overflow-hidden"
          >
            <button
              className="w-full p-4 flex justify-between items-center focus:outline-none"
              onClick={() => toggleSection('demo-info')}
            >
              <h2 className="text-lg font-medium text-left">Demo Information</h2>
              <div className={`transform transition-transform duration-fast ${expanded === 'demo-info' ? 'rotate-180' : ''}`}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </button>
            
            {expanded === 'demo-info' && (
              <motion.div 
                className="p-4 pt-0 border-t border-white/10"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: durations.medium, ease: standardEasing }}
              >
                <div className="flex items-center justify-center p-3 bg-purple-500/20 rounded-lg mb-4">
                  <span className="text-purple-300 text-sm font-medium">DEMO MODE ACTIVE</span>
                </div>
                
                <p className="text-white/60 text-sm mb-2">
                  This is a demonstration with synthetic data. No real funds are at risk.
                </p>
                <p className="text-white/60 text-sm">
                  All transactions, signals, and portfolio data are simulated for demonstration purposes.
                </p>
              </motion.div>
            )}
          </motion.section>
        </div>
      </div>
    </LayoutShell>
  );
};

export default Settings;