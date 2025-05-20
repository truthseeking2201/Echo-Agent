import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { durations, standardEasing } from '@/utils/motion';
import { useEchoStore } from '@/store/echo';

// Export a context for accessing drawer functionality from child components
export const DrawerContext = React.createContext<{
  openDrawer: (content: React.ReactNode) => void;
  closeDrawer: () => void;
}>({
  openDrawer: () => {},
  closeDrawer: () => {},
});

// Hook for using the drawer
export const useDrawer = () => {
  return useContext(DrawerContext);
};

interface LayoutShellProps {
  children: React.ReactNode;
  title?: string;
}

/**
 * New LayoutShell with streamlined 3-page navigation structure:
 * - Overview (/)
 * - Signals (/signals)
 * - Settings (/settings)
 */
export const LayoutShell: React.FC<LayoutShellProps> = ({ 
  children,
  title = 'Echo Agent'
}) => {
  const router = useRouter();
  const { wallet, connectWallet, settings, togglePause } = useEchoStore();
  const [isMobile, setIsMobile] = useState(false);
  const { openDrawer, closeDrawer } = useDrawer();
  
  // Update responsive state based on screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 767);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // Navigation items with new 3-page structure
  const navItems = [
    { 
      href: '/', 
      label: 'Overview', 
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <rect x="7" y="7" width="10" height="10" rx="1" />
        </svg>
      )
    },
    { 
      href: '/signals', 
      label: 'Signals', 
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18.3333 12H15" />
          <path d="M9 12H5.66667" />
          <path d="M12 15V18.3333" />
          <path d="M12 5.66669V9.00002" />
          <circle cx="12" cy="12" r="3.33333" />
        </svg>
      )
    },
    { 
      href: '/settings', 
      label: 'Settings', 
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" />
          <path d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5843 19.73 16.82L19.79 16.88C19.976 17.0657 20.1235 17.2863 20.2241 17.5291C20.3248 17.7719 20.3766 18.0322 20.3766 18.295C20.3766 18.5578 20.3248 18.8181 20.2241 19.0609C20.1235 19.3037 19.976 19.5243 19.79 19.71C19.6043 19.896 19.3837 20.0435 19.1409 20.1441C18.8981 20.2448 18.6378 20.2966 18.375 20.2966C18.1122 20.2966 17.8519 20.2448 17.6091 20.1441C17.3663 20.0435 17.1457 19.896 16.96 19.71L16.9 19.65C16.6643 19.4195 16.365 19.2648 16.0406 19.206C15.7162 19.1472 15.3816 19.1869 15.08 19.32C14.7842 19.4468 14.532 19.6572 14.3543 19.9255C14.1766 20.1938 14.0813 20.5082 14.08 20.83V21C14.08 21.5304 13.8693 22.0391 13.4942 22.4142C13.1191 22.7893 12.6104 23 12.08 23C11.5496 23 11.0409 22.7893 10.6658 22.4142C10.2907 22.0391 10.08 21.5304 10.08 21V20.91C10.0723 20.579 9.96512 20.258 9.77251 19.9887C9.5799 19.7194 9.31074 19.5143 9 19.4C8.69838 19.2669 8.36381 19.2272 8.03941 19.286C7.71502 19.3448 7.41568 19.4995 7.18 19.73L7.12 19.79C6.93425 19.976 6.71368 20.1235 6.47088 20.2241C6.22808 20.3248 5.96783 20.3766 5.705 20.3766C5.44217 20.3766 5.18192 20.3248 4.93912 20.2241C4.69632 20.1235 4.47575 19.976 4.29 19.79C4.10405 19.6043 3.95653 19.3837 3.85588 19.1409C3.75523 18.8981 3.70343 18.6378 3.70343 18.375C3.70343 18.1122 3.75523 17.8519 3.85588 17.6091C3.95653 17.3663 4.10405 17.1457 4.29 16.96L4.35 16.9C4.58054 16.6643 4.73519 16.365 4.794 16.0406C4.85282 15.7162 4.81312 15.3816 4.68 15.08C4.55324 14.7842 4.34276 14.532 4.07447 14.3543C3.80618 14.1766 3.49179 14.0813 3.17 14.08H3C2.46957 14.08 1.96086 13.8693 1.58579 13.4942C1.21071 13.1191 1 12.6104 1 12.08C1 11.5496 1.21071 11.0409 1.58579 10.6658C1.96086 10.2907 2.46957 10.08 3 10.08H3.09C3.42099 10.0723 3.742 9.96512 4.0113 9.77251C4.28059 9.5799 4.48572 9.31074 4.6 9C4.73312 8.69838 4.77282 8.36381 4.714 8.03941C4.65519 7.71502 4.50054 7.41568 4.27 7.18L4.21 7.12C4.02405 6.93425 3.87653 6.71368 3.77588 6.47088C3.67523 6.22808 3.62343 5.96783 3.62343 5.705C3.62343 5.44217 3.67523 5.18192 3.77588 4.93912C3.87653 4.69632 4.02405 4.47575 4.21 4.29C4.39575 4.10405 4.61632 3.95653 4.85912 3.85588C5.10192 3.75523 5.36217 3.70343 5.625 3.70343C5.88783 3.70343 6.14808 3.75523 6.39088 3.85588C6.63368 3.95653 6.85425 4.10405 7.04 4.29L7.1 4.35C7.33568 4.58054 7.63502 4.73519 7.95941 4.794C8.28381 4.85282 8.61838 4.81312 8.92 4.68H9C9.29577 4.55324 9.54802 4.34276 9.72569 4.07447C9.90337 3.80618 9.99872 3.49179 10 3.17V3C10 2.46957 10.2107 1.96086 10.5858 1.58579C10.9609 1.21071 11.4696 1 12 1C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V3.09C14.0013 3.41179 14.0966 3.72618 14.2743 3.99447C14.452 4.26276 14.7042 4.47324 15 4.6C15.3016 4.73312 15.6362 4.77282 15.9606 4.714C16.285 4.65519 16.5843 4.50054 16.82 4.27L16.88 4.21C17.0657 4.02405 17.2863 3.87653 17.5291 3.77588C17.7719 3.67523 18.0322 3.62343 18.295 3.62343C18.5578 3.62343 18.8181 3.67523 19.0609 3.77588C19.3037 3.87653 19.5243 4.02405 19.71 4.21C19.896 4.39575 20.0435 4.61632 20.1441 4.85912C20.2448 5.10192 20.2966 5.36217 20.2966 5.625C20.2966 5.88783 20.2448 6.14808 20.1441 6.39088C20.0435 6.63368 19.896 6.85425 19.71 7.04L19.65 7.1C19.4195 7.33568 19.2648 7.63502 19.206 7.95941C19.1472 8.28381 19.1869 8.61838 19.32 8.92V9C19.4468 9.29577 19.6572 9.54802 19.9255 9.72569C20.1938 9.90337 20.5082 9.99872 20.83 10H21C21.5304 10 22.0391 10.2107 22.4142 10.5858C22.7893 10.9609 23 11.4696 23 12C23 12.5304 22.7893 13.0391 22.4142 13.4142C22.0391 13.7893 21.5304 14 21 14H20.91C20.5882 14.0013 20.2738 14.0966 20.0055 14.2743C19.7372 14.452 19.5268 14.7042 19.4 15Z" />
        </svg>
      )
    }
  ];
  
  return (
    <div className="min-h-screen bg-bg-900 text-white relative overflow-hidden">
      {/* Matrix grid background - layer 1 */}
      <div className="base-layer"></div>
      
      {/* Fixed top badge for DEMO MODE */}
      <div 
        className="fixed top-3 right-3 z-50 px-2 py-1 text-xs font-bold rounded-md bg-purple-500 text-white shadow-glow"
        title="Synthetic data, no real funds exchanged"
      >
        DEMO DATA
      </div>
      
      {/* Top Navigation Bar - simplified with only 3 tabs */}
      <header className="sticky top-0 z-40 bg-bg-900/80 backdrop-blur-glass border-b border-white/10">
        <div className="max-w-content px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <span className="text-xl font-display font-medium text-white">
              Echo<span className="text-primary">.</span>
            </span>
          </div>
          
          {/* Navigation on desktop */}
          {!isMobile && (
            <nav className="flex-1 flex justify-center">
              <ul className="flex space-x-8">
                {navItems.map((item) => {
                  const isActive = 
                    router.pathname === item.href ||
                    (item.href === '/' && router.pathname === '/dashboard');
                    
                  return (
                    <li key={item.href}>
                      <Link href={item.href}>
                        <a className={`relative flex items-center py-2 px-3 
                          ${isActive 
                            ? 'text-primary' 
                            : 'text-white/60 hover:text-white/90'}
                          transition-colors duration-fast
                        `}>
                          {isActive && (
                            <motion.div 
                              layoutId="nav-indicator" 
                              className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full"
                              transition={{ 
                                duration: durations.medium,
                                ease: standardEasing
                              }}
                            />
                          )}
                          <span>{item.label}</span>
                        </a>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          )}
          
          {/* Wallet connection */}
          <div className="flex items-center space-x-4">
            <div 
              className={`
                flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm transition-colors duration-fast
                ${wallet.connected ? 'bg-panel' : 'bg-primary/20 hover:bg-primary/30 cursor-pointer'}
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
            
            {/* Kill switch always visible */}
            <button
              onClick={togglePause}
              className={`
                relative rounded-full w-10 h-5 flex items-center
                transition-colors duration-fast
                ${settings.isPaused ? 'bg-error/30' : 'bg-success/30'}
              `}
              aria-label={settings.isPaused ? "Resume trading" : "Pause trading"}
            >
              <motion.div 
                className={`
                  absolute w-4 h-4 rounded-full shadow-md
                  ${settings.isPaused ? 'bg-error' : 'bg-success'}
                `}
                animate={{ 
                  x: settings.isPaused ? 5 : 21
                }}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 30
                }}
              />
            </button>
          </div>
        </div>
      </header>
      
      {/* Mobile navigation - bottom tabs */}
      {isMobile && (
        <nav className="fixed bottom-0 left-0 right-0 z-40 bg-bg-900/95 backdrop-blur-glass border-t border-white/10">
          <ul className="flex justify-around items-center h-14">
            {navItems.map((item) => {
              const isActive = 
                router.pathname === item.href ||
                (item.href === '/' && router.pathname === '/dashboard');
                
              return (
                <li key={item.href}>
                  <Link href={item.href}>
                    <a 
                      className={`
                        flex flex-col items-center justify-center px-4 py-2
                        ${isActive ? 'text-primary' : 'text-white/60'}
                      `}
                    >
                      <div className="w-6 h-6">
                        {item.icon}
                      </div>
                      <span className="text-xs mt-1">{item.label}</span>
                      
                      {isActive && (
                        <motion.div 
                          layoutId="nav-indicator-mobile" 
                          className="absolute top-0 w-8 h-0.5 bg-primary rounded-full"
                          transition={{ 
                            duration: durations.medium,
                            ease: standardEasing
                          }}
                        />
                      )}
                    </a>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
      
      {/* Main Content Area */}
      <main className={`
        relative z-10 px-4 pb-20 pt-6 overflow-x-hidden 
        ${isMobile ? 'mb-14' : ''}
      `}>
        <div className="max-w-content mx-auto">
          <motion.div
            key={router.pathname}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ 
              duration: durations.slow,
              ease: [.43, .13, .23, .96] // Spring easing
            }}
            className="relative"
          >
            {title && (
              <motion.h1 
                className="text-2xl md:text-3xl font-display font-medium mb-6"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: durations.medium,
                  ease: standardEasing,
                  delay: 0.1
                }}
              >
                {title}
              </motion.h1>
            )}
            
            {children}
          </motion.div>
        </div>
      </main>
      
      {/* Drawer is now implemented in the DrawerProvider component */}
    </div>
  );
};

export const DrawerProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerContent, setDrawerContent] = useState<React.ReactNode | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  
  // Update responsive state based on screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 767);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  const openDrawer = (content: React.ReactNode) => {
    setDrawerContent(content);
    setDrawerOpen(true);
  };
  
  const closeDrawer = () => {
    setDrawerOpen(false);
    setTimeout(() => {
      setDrawerContent(null);
    }, 600);
  };
  
  return (
    <DrawerContext.Provider value={{ openDrawer, closeDrawer }}>
      {children}
      
      {/* Drawer Implementation */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: durations.medium }}
              onClick={closeDrawer}
            />
            
            {/* Drawer panel */}
            <motion.div 
              className={`
                fixed z-50 bg-bg-900/95 backdrop-blur-glass border-l border-white/10 overflow-auto
                ${isMobile ? 'inset-y-0 right-0 w-full' : 'inset-y-0 right-0 w-[40%]'}
              `}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ 
                duration: durations.slow,
                ease: [.43, .13, .23, .96] // Spring easing
              }}
            >
              {/* Close button and drawer header */}
              <div className="sticky top-0 z-10 flex justify-between items-center p-4 bg-bg-900/80 backdrop-blur-glass border-b border-white/10">
                <h2 className="text-lg font-medium">Details</h2>
                <button
                  onClick={closeDrawer}
                  className="w-8 h-8 flex items-center justify-center text-white/60 hover:text-white"
                  aria-label="Close drawer"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M5 5L15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
              
              {/* Drawer content */}
              <div className="p-4">
                {drawerContent}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </DrawerContext.Provider>
  );
};

export default LayoutShell;