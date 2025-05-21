import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import { useEchoStore } from '@/store/echo';
import { AnimatePresence } from 'framer-motion';
import { DrawerProvider } from '@/components/LayoutShell';
import { AutoTradeProvider } from '@/context/AutoTradeContext';

// We can't use next/font because this project uses NextJS 12
// Instead, we'll use traditional font imports in globals.css

// Create an Apollo client for the mock GraphQL server
const client = new ApolloClient({
  uri: '/api/mock/graphql',
  cache: new InMemoryCache()
});

// Set up fake "real-time" pushes for the demo
const setupFakeRealtime = () => {
  // Signal looper - inject a new signal every 7 seconds
  const signalLooper = setInterval(() => {
    // Always get the current state to prevent stale closures
    const store = useEchoStore.getState();
    
    // Only inject if not paused
    if (!store.settings.isPaused) {
      fetch('/api/mock/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `
            query GetSignals($offset: Int, $limit: Int) {
              signals(offset: 0, limit: 1) {
                id
                token
                caller
                confidence
                createdAt
                rationaleMd
              }
            }
          `,
          variables: { offset: 0, limit: 1 }
        })
      })
      .then(res => res.json())
      .then(result => {
        // Get latest store reference again to ensure we're using the most current state
        const currentStore = useEchoStore.getState();
        if (result.data && result.data.signals && result.data.signals.length > 0) {
          currentStore.injectSignal(result.data.signals[0]);
        }
      })
      .catch(console.error);
    }
  }, 7000);
  
  // PnL updater - update PnL every 3 seconds
  const pnlLooper = setInterval(() => {
    // Always get the current state to prevent stale closures
    const store = useEchoStore.getState();
    
    // Random delta between -0.25% and +0.75%
    const delta = (Math.random() * 2 - 0.5) * 0.5;
    store.updatePnL(delta);
  }, 3000);
  
  // Expose for debug
  if (typeof window !== 'undefined') {
    (window as any).demo = {
      nextSignal: () => {
        fetch('/api/mock/graphql', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: `
              query GetSignals($offset: Int, $limit: Int) {
                signals(offset: 0, limit: 1) {
                  id
                  token
                  caller
                  confidence
                  createdAt
                  rationaleMd
                }
              }
            `,
            variables: { offset: 0, limit: 1 }
          })
        })
        .then(res => res.json())
        .then(result => {
          // Get latest store reference again to ensure we're using the most current state
          const currentStore = useEchoStore.getState();
          if (result.data && result.data.signals && result.data.signals.length > 0) {
            currentStore.injectSignal(result.data.signals[0]);
          }
        })
        .catch(console.error);
      },
    };
  }
  
  return { signalLooper, pnlLooper };
};

/**
 * Main app entry point
 * Handles new routing to the 3 core navigation spaces:
 * 1. Overview (/) - unified dashboard
 * 2. Signals (/signals) - signal feed + detailed drawer 
 * 3. Settings (/settings) - configuration options
 */
function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  
  // Handle routing - redirect old paths to new structure
  useEffect(() => {
    const handleRouteChange = (url: string) => {
      // Redirect dashboard to home
      if (url === '/dashboard') {
        router.replace('/');
      }
      
      // Redirect simulate to home
      if (url === '/simulate') {
        router.replace('/');
      }
      
      // Redirect logs to signals
      if (url === '/logs') {
        router.replace('/signals');
      }
    };
    
    // Add event listener for route changes
    router.events.on('routeChangeStart', handleRouteChange);
    
    // Initial check - add a small delay to ensure proper handling
    setTimeout(() => {
      if (router.pathname === '/dashboard' || router.pathname === '/simulate' || router.pathname === '/logs') {
        const redirectTo = 
          router.pathname === '/dashboard' || router.pathname === '/simulate' ? '/' : '/signals';
        router.replace(redirectTo);
      }
    }, 100);
    
    // Cleanup
    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [router]);
  
  useEffect(() => {
    // Initial data load
    const loadInitialData = async () => {
      setLoading(true);
      const store = useEchoStore.getState();
      await Promise.all([
        store.loadPortfolio(),
        store.loadSignals(),
        store.loadTrades(),
        store.loadSettings()
      ]);
      setLoading(false);
    };
    
    loadInitialData();
    
    // Setup fake real-time updates
    const { signalLooper, pnlLooper } = setupFakeRealtime();
    
    // Cleanup - add safety check since setupFakeRealtime could fail in some edge cases
    return () => {
      if (signalLooper) clearInterval(signalLooper);
      if (pnlLooper) clearInterval(pnlLooper);
      
      // Also clear any window globals we set up to prevent memory leaks
      if (typeof window !== 'undefined' && (window as any).demo) {
        (window as any).demo = undefined;
      }
    };
  }, []);
  
  // Add base layer with cyber-themed grid background
  useEffect(() => {
    if (typeof document !== 'undefined' && !document.querySelector('.base-layer')) {
      const baseLayer = document.createElement('div');
      baseLayer.className = 'base-layer';
      document.body.appendChild(baseLayer);
      
      return () => {
        document.body.removeChild(baseLayer);
      };
    }
  }, []);

  return (
    <ApolloProvider client={client}>
      <AutoTradeProvider>
        <DrawerProvider>
          <AnimatePresence mode="wait">
            {loading ? (
              <div className="fixed inset-0 flex items-center justify-center bg-bg-900 z-50">
                <div className="text-primary font-display text-2xl">
                  Echo<span className="text-accent">.</span>
                </div>
              </div>
            ) : (
              <Component {...pageProps} key={router.pathname} />
            )}
          </AnimatePresence>
        </DrawerProvider>
      </AutoTradeProvider>
    </ApolloProvider>
  );
}

export default MyApp;