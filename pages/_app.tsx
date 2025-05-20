import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import { useEchoStore } from '@/store/echo';

// Create an Apollo client for the mock GraphQL server
const client = new ApolloClient({
  uri: '/api/mock/graphql',
  cache: new InMemoryCache()
});

// Set up fake "real-time" pushes for the demo
const setupFakeRealtime = () => {
  const store = useEchoStore.getState();
  
  // Signal looper - inject a new signal every 7 seconds
  const signalLooper = setInterval(() => {
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
        if (result.data && result.data.signals && result.data.signals.length > 0) {
          store.injectSignal(result.data.signals[0]);
        }
      })
      .catch(console.error);
    }
  }, 7000);
  
  // PnL updater - update PnL every 3 seconds
  const pnlLooper = setInterval(() => {
    // Random delta between -0.25% and +0.75%
    const delta = (Math.random() * 2 - 0.5) * 0.5;
    store.updatePnL(delta);
  }, 3000);
  
  // Expose for debug
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
        if (result.data && result.data.signals && result.data.signals.length > 0) {
          store.injectSignal(result.data.signals[0]);
        }
      })
      .catch(console.error);
    },
  };
  
  return { signalLooper, pnlLooper };
};

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // Initial data load
    const loadInitialData = async () => {
      const store = useEchoStore.getState();
      await Promise.all([
        store.loadPortfolio(),
        store.loadSignals(),
        store.loadTrades(),
        store.loadSettings()
      ]);
    };
    
    loadInitialData();
    
    // Setup fake real-time updates
    const { signalLooper, pnlLooper } = setupFakeRealtime();
    
    // Cleanup
    return () => {
      clearInterval(signalLooper);
      clearInterval(pnlLooper);
    };
  }, []);

  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}

export default MyApp;