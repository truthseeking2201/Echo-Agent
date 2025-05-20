import create from 'zustand';
import { persist } from 'zustand/middleware';

// Types from our schema
export type Signal = {
  id: string;
  token: string;
  caller: string;
  confidence: number;
  createdAt: string;
  rationaleMd: string;
};

export type Trade = {
  id: string;
  token: string;
  side: 'BUY' | 'SELL';
  qty: number;
  price: number;
  pnlPercent: number;
  txHash: string;
  signalId: string;
  ts: string;
  status: 'FILLED' | 'SL' | 'TP';
};

export type PnLPoint = {
  t: string;
  v: number;
};

export interface EchoState {
  // State
  wallet: { addr: string | null; connected: boolean };
  portfolio: PnLPoint[];
  signals: Signal[];
  trades: Trade[];
  settings: {
    maxRiskPct: number; // 0-100
    whitelist: string[]; // caller handles
    isPaused: boolean;
  };
  
  // Actions
  connectWallet: () => void;
  mirror: (signalId: string) => Promise<Trade>;
  togglePause: () => void;
  setRisk: (n: number) => void;
  whitelistAdd: (h: string) => void;
  whitelistRemove: (h: string) => void;
  
  // Data loading
  loadSignals: (offset?: number, limit?: number) => Promise<void>;
  loadTrades: (offset?: number, limit?: number) => Promise<void>;
  loadPortfolio: () => Promise<void>;
  loadSettings: () => Promise<void>;
  
  // Demo helpers
  injectSignal: (signal: Signal) => void;
  updatePnL: (delta: number) => void;
}

export const useEchoStore = create<EchoState>(
  persist(
    (set, get) => ({
      // Initial state
      wallet: { addr: null, connected: false },
      portfolio: [],
      signals: [],
      trades: [],
      settings: {
        maxRiskPct: 20,
        whitelist: [],
        isPaused: false
      },
      
      // Actions
      connectWallet: async () => {
        // Mock wallet connection
        set({ wallet: { addr: '0xDEMO...', connected: true } });
      },
      
      mirror: async (signalId) => {
        try {
          // Call the GraphQL endpoint
          const response = await fetch('/api/mock/graphql', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              query: `
                mutation MirrorTrade($signalId: ID!) {
                  mirrorTrade(signalId: $signalId) {
                    id
                    token
                    side
                    qty
                    price
                    pnlPercent
                    txHash
                    signalId
                    ts
                    status
                  }
                }
              `,
              variables: { signalId }
            })
          });
          
          const result = await response.json();
          
          if (result.errors) {
            throw new Error(result.errors[0].message);
          }
          
          const newTrade = result.data.mirrorTrade;
          
          // Update the trades list
          set((state) => ({
            trades: [newTrade, ...state.trades]
          }));
          
          return newTrade;
        } catch (error) {
          console.error('Error mirroring trade:', error);
          throw error;
        }
      },
      
      togglePause: () => {
        set((state) => ({
          settings: {
            ...state.settings,
            isPaused: !state.settings.isPaused
          }
        }));
      },
      
      setRisk: async (n) => {
        // Update locally
        set((state) => ({
          settings: {
            ...state.settings,
            maxRiskPct: n
          }
        }));
        
        // Sync with server
        try {
          await fetch('/api/mock/graphql', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              query: `
                mutation SetSettings($input: SettingsInput!) {
                  setSettings(input: $input) {
                    maxRiskPct
                    whitelist
                    isPaused
                  }
                }
              `,
              variables: { 
                input: { 
                  maxRiskPct: n 
                } 
              }
            })
          });
        } catch (error) {
          console.error('Error updating risk settings:', error);
        }
      },
      
      whitelistAdd: (h) => {
        set((state) => ({
          settings: {
            ...state.settings,
            whitelist: [...state.settings.whitelist, h]
          }
        }));
      },
      
      whitelistRemove: (h) => {
        set((state) => ({
          settings: {
            ...state.settings,
            whitelist: state.settings.whitelist.filter(item => item !== h)
          }
        }));
      },
      
      // Data loading functions
      loadSignals: async (offset = 0, limit = 20) => {
        try {
          const response = await fetch('/api/mock/graphql', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              query: `
                query GetSignals($offset: Int, $limit: Int) {
                  signals(offset: $offset, limit: $limit) {
                    id
                    token
                    caller
                    confidence
                    createdAt
                    rationaleMd
                  }
                }
              `,
              variables: { offset, limit }
            })
          });
          
          const result = await response.json();
          
          if (result.data && result.data.signals) {
            set({ signals: result.data.signals });
          }
        } catch (error) {
          console.error('Error loading signals:', error);
        }
      },
      
      loadTrades: async (offset = 0, limit = 25) => {
        try {
          const response = await fetch('/api/mock/graphql', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              query: `
                query GetTrades($offset: Int, $limit: Int) {
                  trades(offset: $offset, limit: $limit) {
                    id
                    token
                    side
                    qty
                    price
                    pnlPercent
                    txHash
                    signalId
                    ts
                    status
                  }
                }
              `,
              variables: { offset, limit }
            })
          });
          
          const result = await response.json();
          
          if (result.data && result.data.trades) {
            set({ trades: result.data.trades });
          }
        } catch (error) {
          console.error('Error loading trades:', error);
        }
      },
      
      loadPortfolio: async () => {
        try {
          const response = await fetch('/api/mock/graphql', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              query: `
                query GetPortfolio {
                  portfolio {
                    t
                    v
                  }
                }
              `
            })
          });
          
          const result = await response.json();
          
          if (result.data && result.data.portfolio) {
            set({ portfolio: result.data.portfolio });
          }
        } catch (error) {
          console.error('Error loading portfolio:', error);
        }
      },
      
      loadSettings: async () => {
        try {
          const response = await fetch('/api/mock/graphql', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              query: `
                query GetSettings {
                  settings {
                    maxRiskPct
                    whitelist
                    isPaused
                  }
                }
              `
            })
          });
          
          const result = await response.json();
          
          if (result.data && result.data.settings) {
            set({ settings: result.data.settings });
          }
        } catch (error) {
          console.error('Error loading settings:', error);
        }
      },
      
      // Demo helpers
      injectSignal: (signal) => {
        set((state) => ({
          signals: [signal, ...state.signals]
        }));
      },
      
      updatePnL: (delta) => {
        set((state) => {
          if (state.portfolio.length === 0) return { portfolio: [] };
          
          const lastPoint = state.portfolio[state.portfolio.length - 1];
          const newPoint = {
            t: new Date().toISOString(),
            v: parseFloat((lastPoint.v + delta).toFixed(2))
          };
          
          return {
            portfolio: [...state.portfolio, newPoint]
          };
        });
      }
    }),
    {
      name: 'echo-storage',
      getStorage: () => localStorage,
      partialize: (state) => ({
        settings: state.settings  // Only persist settings
      })
    }
  )
);