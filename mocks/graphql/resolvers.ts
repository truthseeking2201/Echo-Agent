import fs from 'fs';
import path from 'path';

// Define proper types for our data
export interface Signal {
  id: string;
  token: string;
  caller: string;
  confidence: number;
  createdAt: string;
  rationaleMd: string;
}

export interface Trade {
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
}

export interface PnLPoint {
  t: string;
  v: number;
}

export interface Settings {
  maxRiskPct: number;
  whitelist: string[];
  isPaused: boolean;
}

export interface SettingsInput {
  maxRiskPct?: number;
  whitelist?: string[];
  isPaused?: boolean;
}

// Helper to read mock data from JSON files with type enforcement
const readMockData = <T>(filename: string): T[] => {
  try {
    const filePath = path.join(process.cwd(), 'mocks/data', filename);
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data) as T[];
  } catch (error) {
    console.error(`Error reading mock data file ${filename}:`, error);
    return [];
  }
};

// In-memory data (will be updated during the session)
let signals: Signal[] = readMockData<Signal>('signals.json');
let trades: Trade[] = readMockData<Trade>('trades.json');
let portfolio: PnLPoint[] = readMockData<PnLPoint>('portfolio.json');
let settings: Settings = {
  maxRiskPct: 20,
  whitelist: [],
  isPaused: false
};

// Queue for "real-time" signal injection
let signalsQueue: Signal[] = [...signals];
signals = [];

// Initialize signals with first few items
if (signalsQueue.length > 0) {
  signals = signalsQueue.splice(0, 20);
}

// Define resolver types
interface Context { }

interface QueryResolvers {
  signals: (parent: any, args: { limit?: number, offset?: number }, context: Context) => Signal[];
  trades: (parent: any, args: { limit?: number, offset?: number }, context: Context) => Trade[];
  portfolio: (parent: any, args: {}, context: Context) => PnLPoint[];
  settings: (parent: any, args: {}, context: Context) => Settings;
}

interface MutationResolvers {
  mirrorTrade: (parent: any, args: { signalId: string }, context: Context) => Trade;
  setSettings: (parent: any, args: { input: SettingsInput }, context: Context) => Settings;
}

export const resolvers = {
  Query: {
    signals: (_: any, { limit = 20, offset = 0 }: { limit?: number, offset?: number }): Signal[] => {
      return signals.slice(offset, offset + limit);
    },
    trades: (_: any, { limit = 25, offset = 0 }: { limit?: number, offset?: number }): Trade[] => {
      return trades.slice(offset, offset + limit);
    },
    portfolio: (): PnLPoint[] => {
      return portfolio;
    },
    settings: (): Settings => {
      return settings;
    }
  },
  Mutation: {
    mirrorTrade: (_: any, { signalId }: { signalId: string }): Trade => {
      // Find the signal
      const signal = signals.find((s: Signal) => s.id === signalId);
      
      if (!signal) {
        throw new Error(`Signal not found with ID: ${signalId}`);
      }
      
      // Create a new trade based on the signal
      const newTrade: Trade = {
        id: `trd_${Date.now().toString(36)}`,
        token: signal.token,
        side: "BUY",
        qty: parseFloat((Math.random() * 10 + 1).toFixed(3)),
        price: parseFloat((Math.random() * 1000 + 100).toFixed(2)),
        pnlPercent: parseFloat((Math.random() * 15).toFixed(2)),
        txHash: "0xFA" + Math.random().toString(36).substring(2, 62),
        signalId: signal.id,
        ts: new Date().toISOString(),
        status: "FILLED"
      };
      
      // Add to the top of trades list
      trades = [newTrade, ...trades];
      
      return newTrade;
    },
    setSettings: (_: any, { input }: { input: SettingsInput }): Settings => {
      settings = {
        ...settings,
        ...input
      };
      
      return settings;
    }
  }
};

// Helper functions for the fake real-time data push
export const nextSignal = (): Signal | null => {
  if (signalsQueue.length > 0) {
    const nextSig: Signal | undefined = signalsQueue.shift();
    if (nextSig) {
      signals = [nextSig, ...signals];
      return nextSig;
    }
  }
  return null;
};

export const updatePortfolioPnL = (deltaPct = 1.0): PnLPoint | null => {
  if (portfolio.length > 0) {
    const lastPoint: PnLPoint = { ...portfolio[portfolio.length - 1] };
    const newPoint: PnLPoint = {
      t: new Date().toISOString(),
      v: parseFloat((lastPoint.v + deltaPct).toFixed(2))
    };
    portfolio = [...portfolio, newPoint];
    return newPoint;
  }
  return null;
};