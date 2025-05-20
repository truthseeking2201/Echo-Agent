import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { durations, standardEasing } from '@/utils/motion';

interface SideNavProps {
  onNavChange?: () => void;
}

/**
 * Side or bottom navigation component with responsive behavior
 * @example
 * <SideNav onNavChange={() => console.log('navigation changed')} />
 */
export const SideNav: React.FC<SideNavProps> = ({ onNavChange }) => {
  const router = useRouter();
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
  
  const navItems = [
    { 
      href: '/dashboard', 
      label: 'Dashboard', 
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="14" height="14" rx="2" />
          <rect x="7" y="7" width="6" height="6" rx="1" />
          <path d="M3 7H7" />
          <path d="M13 7H17" />
          <path d="M3 13H7" />
          <path d="M13 13H17" />
        </svg>
      )
    },
    { 
      href: '/signals', 
      label: 'Signals', 
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18.3333 10H15" />
          <path d="M5 10H1.66667" />
          <path d="M10 15V18.3333" />
          <path d="M10 1.66669V5.00002" />
          <path d="M15.4833 15.4833L13.3583 13.3583" />
          <path d="M6.64168 6.64169L4.51668 4.51669" />
          <path d="M15.4833 4.51669L13.3583 6.64169" />
          <path d="M6.64168 13.3583L4.51668 15.4833" />
          <circle cx="10" cy="10" r="3.33333" />
        </svg>
      )
    },
    { 
      href: '/logs', 
      label: 'Logs', 
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18.3333 10H15" />
          <path d="M3.33333 6.66669H6.66666" />
          <path d="M3.33333 10H6.66666" />
          <path d="M3.33333 13.3334H6.66666" />
          <rect x="10" y="3.33331" width="6.66667" height="6.66667" rx="1" />
          <rect x="10" y="13.3333" width="6.66667" height="3.33333" rx="1" />
        </svg>
      )
    },
    { 
      href: '/settings', 
      label: 'Settings', 
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8.325 2.31669C8.73 1.90169 9.35 1.66669 10 1.66669C10.65 1.66669 11.27 1.90169 11.675 2.31669C11.9617 2.61044 12.3467 2.78519 12.7592 2.80669C13.1716 2.8282 13.5716 2.69476 13.8833 2.43336C14.5183 1.91669 15.4333 1.94169 16.0258 2.53419C16.6183 3.12669 16.6433 4.04169 16.1267 4.67669C15.8653 4.98831 15.7318 5.38837 15.7533 5.80081C15.7748 6.21325 15.9496 6.59831 16.2433 6.88502C16.6583 7.28835 16.8933 7.90835 16.8933 8.55835C16.8933 9.20835 16.6583 9.82835 16.2433 10.2317C15.9496 10.5184 15.7748 10.9034 15.7533 11.3159C15.7318 11.7283 15.8653 12.1284 16.1267 12.44C16.6433 13.075 16.6183 13.99 16.0258 14.5825C15.4333 15.175 14.5183 15.2 13.8833 14.6834C13.5717 14.4219 13.1716 14.2885 12.7592 14.31C12.3467 14.3315 11.9617 14.5063 11.675 14.8C11.27 15.215 10.65 15.45 10 15.45C9.35 15.45 8.73 15.215 8.325 14.8C8.03831 14.5063 7.65325 14.3315 7.24081 14.31C6.82837 14.2885 6.42832 14.4219 6.11666 14.6834C5.48166 15.2 4.56666 15.175 3.97416 14.5825C3.38166 13.99 3.35666 13.075 3.87333 12.44C4.13471 12.1284 4.26815 11.7283 4.24665 11.3159C4.22514 10.9034 4.05039 10.5184 3.75666 10.2317C3.34166 9.82835 3.10666 9.20835 3.10666 8.55835C3.10666 7.90835 3.34166 7.28835 3.75666 6.88502C4.05039 6.59831 4.22514 6.21325 4.24665 5.80081C4.26815 5.38837 4.13471 4.98831 3.87333 4.67669C3.35666 4.04169 3.38166 3.12669 3.97416 2.53419C4.56666 1.94169 5.48166 1.91669 6.11666 2.43336C6.42836 2.69476 6.82837 2.8282 7.24081 2.80669C7.65325 2.78519 8.03831 2.61044 8.325 2.31669Z" />
          <circle cx="10" cy="8.33335" r="2.5" />
        </svg>
      )
    },
    { 
      href: '/simulate', 
      label: 'Simulate', 
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16.6666 5L10 8.33333L3.33331 5L10 1.66667L16.6666 5Z" />
          <path d="M16.6666 10L10 13.3333L3.33331 10" />
          <path d="M16.6666 15L10 18.3333L3.33331 15" />
        </svg>
      )
    },
  ];

  return (
    <nav 
      className={`
        ${isMobile 
          ? 'fixed bottom-0 left-0 right-0 h-14 border-t border-white/10' 
          : 'h-screen border-r border-white/10'
        } 
        bg-surface-dark
      `}
    >
      <div className={`
        ${isMobile 
          ? 'flex justify-around items-center h-full' 
          : 'flex flex-col h-full py-6 px-4'
        }
      `}>
        {/* Logo - only shown on desktop */}
        {!isMobile && (
          <div className="mb-8 flex items-center justify-center">
            <span className="text-xl font-display text-white">
              Echo
              <span className="text-primary">.</span>
            </span>
          </div>
        )}
        
        <div className={`
          ${isMobile 
            ? 'flex justify-around items-center w-full' 
            : 'flex flex-col space-y-2'
          }
        `}>
          {navItems.map((item) => {
            const isActive = router.pathname === item.href;
            
            return (
              <Link href={item.href} key={item.href}>
                <a
                  className={`
                    relative flex items-center rounded-button
                    ${isMobile 
                      ? 'flex-col py-1 px-3' 
                      : 'py-2 px-4 space-x-3'
                    }
                    ${isActive 
                      ? 'text-ink' 
                      : 'text-white/60 hover:text-white/80 hover:bg-white/5'}
                    transition-colors duration-fast
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-opacity-50
                  `}
                  onClick={onNavChange}
                  tabIndex={0}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <motion.div 
                      layoutId="activeNav"
                      className={`
                        absolute ${isMobile 
                          ? 'top-0 left-0 right-0 h-0.5' 
                          : 'left-0 top-2 bottom-2 w-0.5'
                        } 
                        bg-ink rounded-full
                      `}
                      transition={{ 
                        duration: durations.medium,
                        ease: standardEasing
                      }}
                    />
                  )}
                  
                  <div className={isActive ? 'text-ink' : ''}>
                    {item.icon}
                  </div>
                  <span className={isMobile ? 'text-xs mt-1' : ''}>
                    {item.label}
                  </span>
                </a>
              </Link>
            );
          })}
        </div>
        
        {!isMobile && (
          <div className="mt-auto pb-4 text-center">
            <div className="text-xs text-white/40">
              Echo Agent v2.0
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default SideNav;