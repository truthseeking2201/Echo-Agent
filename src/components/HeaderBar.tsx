import React from 'react';
import { motion } from 'framer-motion';
import KillSwitchToggle from './KillSwitchToggle';
import { useEchoStore } from '@/store/echo';
import { durations, standardEasing } from '@/utils/motion';

interface HeaderBarProps {
  title: string;
  toggleContext?: () => void;
  contextVisible?: boolean;
}

/**
 * Header bar with title, wallet info, and kill switch
 * @example
 * <HeaderBar title="Dashboard" toggleContext={() => setContextVisible(!contextVisible)} />
 */
export const HeaderBar: React.FC<HeaderBarProps> = ({
  title,
  toggleContext,
  contextVisible = true
}) => {
  const { settings, togglePause, wallet, connectWallet } = useEchoStore();
  
  return (
    <header className="sticky top-0 z-10 bg-surface-dark/80 backdrop-blur-sm border-b border-white/10 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <motion.h1 
            className="text-xl font-medium text-white"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: durations.medium,
              ease: standardEasing
            }}
          >
            {title}
          </motion.h1>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Wallet chip */}
          <div 
            className={`
              flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm transition-colors duration-fast
              ${wallet.connected ? 'bg-surface-dark' : 'bg-primary/20 hover:bg-primary/30 cursor-pointer'}
            `}
            onClick={wallet.connected ? undefined : connectWallet}
          >
            <div className={`h-2 w-2 rounded-full ${wallet.connected ? 'bg-success' : 'bg-error'}`}></div>
            <span className="font-mono">
              {wallet.connected 
                ? `${wallet.addr?.substring(0, 6)}...` 
                : 'Connect'
              }
            </span>
          </div>
          
          {/* Kill switch */}
          <KillSwitchToggle 
            isPaused={settings.isPaused}
            onToggle={togglePause}
          />
          
          {/* Context panel toggle (on tablet) */}
          {toggleContext && (
            <button
              type="button"
              onClick={toggleContext}
              className="p-2 rounded-full hover:bg-white/5 text-white/60 hover:text-white/80 transition-colors duration-fast focus:outline-none focus-visible:ring-2 focus-visible:ring-ink"
              aria-label={contextVisible ? "Hide context panel" : "Show context panel"}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                {contextVisible ? (
                  <>
                    <path d="M13.3333 5L6.66667 10L13.3333 15" />
                  </>
                ) : (
                  <>
                    <path d="M6.66667 5L13.3333 10L6.66667 15" />
                  </>
                )}
              </svg>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default HeaderBar;