import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import SideNav from './SideNav';
import HeaderBar from './HeaderBar';
import ContextPanel from './ContextPanel';
import { slideInRight, durations, standardEasing } from '@/utils/motion';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

/**
 * Main application layout with responsive grid
 * @example
 * <Layout title="Dashboard">
 *   <p>Page content</p>
 * </Layout>
 */
export const Layout: React.FC<LayoutProps> = ({ 
  children,
  title = 'Echo Agent'
}) => {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [contextVisible, setContextVisible] = useState(true);
  
  // Update responsive state based on screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 767);
      setIsTablet(window.innerWidth >= 768 && window.innerWidth <= 1023);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // Toggle context panel
  const toggleContext = () => {
    setContextVisible(!contextVisible);
  };
  
  // Determine grid layout based on screen size
  const layoutClass = isMobile 
    ? 'grid-cols-1' 
    : isTablet 
      ? 'grid-cols-tablet' 
      : 'grid-cols-desktop';
  
  // Motion variants for mobile drawer
  const drawerVariants = {
    hidden: {
      y: '100%',
      transition: {
        duration: durations.medium,
        ease: standardEasing
      }
    },
    visible: {
      y: 0,
      transition: {
        duration: durations.medium,
        ease: standardEasing
      }
    }
  };
  
  return (
    <div className="min-h-screen bg-body text-white">
      {/* Fixed top badge for DEMO MODE */}
      <div 
        className="fixed top-3 right-3 z-50 px-2 py-1 text-xs font-bold rounded-md bg-purple-500 text-white shadow-glow"
        title="Synthetic data, no real funds exchanged"
      >
        DEMO DATA
      </div>
      
      <div className={`grid ${layoutClass} gap-grid-gap h-screen`}>
        {/* Side navigation */}
        {!isMobile && (
          <div className="h-screen">
            <SideNav />
          </div>
        )}
        
        {/* Main content area */}
        <div className="flex flex-col h-screen overflow-hidden">
          <HeaderBar 
            title={title}
            toggleContext={isTablet ? toggleContext : undefined}
            contextVisible={contextVisible}
          />
          
          <main className="flex-grow p-6 overflow-auto">
            <motion.div
              key={router.pathname}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ 
                duration: durations.medium,
                ease: standardEasing
              }}
            >
              {children}
            </motion.div>
          </main>
          
          {/* Mobile navigation */}
          {isMobile && (
            <div className="h-14">
              <SideNav />
            </div>
          )}
        </div>
        
        {/* Context panel - desktop or tablet */}
        {(!isTablet || (isTablet && contextVisible)) && !isMobile && (
          <motion.div 
            className="h-screen overflow-auto"
            initial={isTablet ? { opacity: 0, x: 50 } : { opacity: 1 }}
            animate={isTablet ? { opacity: 1, x: 0 } : { opacity: 1 }}
            transition={{
              duration: durations.medium,
              ease: standardEasing
            }}
          >
            <ContextPanel route={router.pathname} />
          </motion.div>
        )}
        
        {/* Mobile drawer for context panel */}
        <AnimatePresence>
          {isMobile && contextVisible && (
            <>
              <motion.div 
                className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: durations.medium }}
                onClick={() => setContextVisible(false)}
              />
              
              <motion.div 
                className="fixed inset-x-0 bottom-0 z-50 rounded-t-2xl bg-surface-dark max-h-[70vh] overflow-auto"
                variants={drawerVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                {/* Drag handle */}
                <div className="flex justify-center py-2">
                  <div className="w-10 h-1 rounded-full bg-white/20" />
                </div>
                
                <ContextPanel route={router.pathname} />
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Layout;