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
            {[...Array(15)].map((_, i) => (
              <div 
                key={i} 
                className="particle"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  width: `${Math.random() * 3 + 1}px`,
                  height: `${Math.random() * 3 + 1}px`,
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
              Echo <span className="gradient-text">Settings</span>
            </h1>
            <p className="text-white/70 mb-2 max-w-lg">
              Configure your trading preferences, risk parameters, and visual options to personalize your trading experience.
            </p>
            <div className="flex items-center">
              <div className={`pulsing-dot ${settings.isPaused ? 'bg-error' : 'pulsing-dot-success'}`}></div>
              <span className="text-sm font-mono text-white/60">
                Trading is currently {settings.isPaused ? 'Paused' : 'Active'}
              </span>
            </div>
          </div>
          
          <div className="bg-panel p-3 rounded-lg border border-white/10 shadow-glow flex items-center space-x-3">
            <button
              onClick={togglePause}
              className={`
                relative rounded-full w-14 h-7 flex items-center
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
                  x: settings.isPaused ? 4 : 33
                }}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 30
                }}
              />
            </button>
            <span className="text-sm font-medium">
              {settings.isPaused ? 'Trading Paused' : 'Trading Active'}
            </span>
          </div>
        </div>
      </motion.div>
      
      <div className="max-w-3xl mx-auto">
        {/* Accordion Sections */}
        <div className="space-y-6">
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
              className="w-full p-5 flex justify-between items-center focus:outline-none"
              onClick={() => toggleSection('risk-controls')}
            >
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-3 border border-primary/30">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z"></path>
                    <path d="M12 8v4l3 3"></path>
                  </svg>
                </div>
                <h2 className="text-lg font-medium text-left">Risk Controls</h2>
              </div>
              <div className={`transform transition-transform duration-fast ${expanded === 'risk-controls' ? 'rotate-180' : ''}`}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </button>
            
            {expanded === 'risk-controls' && (
              <motion.div 
                className="p-5 pt-0 border-t border-white/10"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: durations.medium, ease: standardEasing }}
              >
                <div className="mb-6 glassmorphic p-4">
                  <h3 className="text-base font-medium mb-2">Max Risk Percentage</h3>
                  <p className="text-white/60 text-sm mb-4">
                    Controls maximum exposure per position as a percentage of your portfolio.
                  </p>
                  
                  <div className="bg-white/5 p-3 rounded-lg border border-white/10 mb-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-white/70">Current Setting</span>
                      <span className="px-2 py-1 bg-primary/20 text-primary rounded text-sm font-mono font-bold">{settings.maxRiskPct}%</span>
                    </div>
                    <RiskSlider 
                      value={settings.maxRiskPct}
                      onChange={setRisk}
                      min={1}
                      max={40}
                      step={1}
                    />
                  </div>
                  
                  <div className="text-xs text-white/50">
                    {settings.maxRiskPct < 10 ? 'Conservative risk strategy. Safe but may limit potential returns.' :
                    settings.maxRiskPct < 20 ? 'Balanced risk strategy. Good for most traders.' :
                    'Aggressive risk strategy. Higher potential returns but greater downside risk.'}
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
              className="w-full p-5 flex justify-between items-center focus:outline-none"
              onClick={() => toggleSection('signal-filters')}
            >
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-3 border border-primary/30">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"></path>
                  </svg>
                </div>
                <h2 className="text-lg font-medium text-left">Signal Filters</h2>
              </div>
              <div className={`transform transition-transform duration-fast ${expanded === 'signal-filters' ? 'rotate-180' : ''}`}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </button>
            
            {expanded === 'signal-filters' && (
              <motion.div 
                className="p-5 pt-0 border-t border-white/10"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: durations.medium, ease: standardEasing }}
              >
                <div className="glassmorphic p-4">
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
                  
                  <div className="mt-4 flex flex-wrap gap-2 bg-white/5 p-3 rounded-lg border border-white/10">
                    {settings.whitelist.map((caller) => (
                      <div 
                        key={caller}
                        className="flex items-center space-x-1 px-3 py-1.5 bg-primary/10 border border-primary/30 rounded-full text-sm"
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
              className="w-full p-5 flex justify-between items-center focus:outline-none"
              onClick={() => toggleSection('visual-settings')}
            >
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-3 border border-primary/30">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                </div>
                <h2 className="text-lg font-medium text-left">Visual Settings</h2>
              </div>
              <div className={`transform transition-transform duration-fast ${expanded === 'visual-settings' ? 'rotate-180' : ''}`}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </button>
            
            {expanded === 'visual-settings' && (
              <motion.div 
                className="p-5 pt-0 border-t border-white/10"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: durations.medium, ease: standardEasing }}
              >
                <div className="glassmorphic p-4">
                  <h3 className="text-base font-medium mb-2">Visual Effects Intensity</h3>
                  <p className="text-white/60 text-sm mb-4">
                    Control how intense the visual effects are, from subtle to vibrant.
                  </p>
                  
                  <div className="flex flex-col space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-white/60">Subtle</span>
                      <span className="text-xs text-white/60">Vibrant</span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="2"
                      step="0.1"
                      defaultValue="1"
                      onChange={(e) => updateEnergyLevel(parseFloat(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="mt-6 grid grid-cols-2 gap-4">
                    <div className="bg-white/5 p-3 rounded border border-white/10 text-center">
                      <div className="pulsing-dot-primary pulsing-dot mx-auto mb-2 h-3 w-3"></div>
                      <div className="text-xs text-white/50">Animation Preview</div>
                    </div>
                    <div className="bg-white/5 p-3 rounded border border-white/10 text-center">
                      <div className="shadow-glow inline-block px-2 py-1 rounded">
                        <span className="text-primary">Glow Preview</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.section>
        </div>
      </div>
    </LayoutShell>
  );
};

export default Settings;