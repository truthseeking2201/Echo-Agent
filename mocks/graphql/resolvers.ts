import fs from 'fs';
import path from 'path';

// Helper to read mock data from JSON files
const readMockData = (filename: string) => {
  try {
    const filePath = path.join(process.cwd(), 'mocks/data', filename);
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading mock data file ${filename}:`, error);
    return [];
  }
};

// In-memory data (will be updated during the session)
let signals = readMockData('signals.json');
let trades = readMockData('trades.json');
let portfolio = readMockData('portfolio.json');
let settings = {
  maxRiskPct: 20,
  whitelist: [],
  isPaused: false
};

// Queue for "real-time" signal injection
let signalsQueue = [...signals];
signals = [];

// Initialize signals with first few items
if (signalsQueue.length > 0) {
  signals = signalsQueue.splice(0, 20);
}

export const resolvers = {
  Query: {
    signals: (_, { limit = 20, offset = 0 }) => {
      return signals.slice(offset, offset + limit);
    },
    trades: (_, { limit = 25, offset = 0 }) => {
      return trades.slice(offset, offset + limit);
    },
    portfolio: () => {
      return portfolio;
    },
    settings: () => {
      return settings;
    }
  },
  Mutation: {
    mirrorTrade: (_, { signalId }) => {
      // Find the signal
      const signal = signals.find(s => s.id === signalId);
      
      if (!signal) {
        throw new Error(`Signal not found with ID: ${signalId}`);
      }
      
      // Create a new trade based on the signal
      const newTrade = {
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
    setSettings: (_, { input }) => {
      settings = {
        ...settings,
        ...input
      };
      
      return settings;
    }
  }
};

// Helper functions for the fake real-time data push
export const nextSignal = () => {
  if (signalsQueue.length > 0) {
    const nextSig = signalsQueue.shift();
    if (nextSig) {
      signals = [nextSig, ...signals];
      return nextSig;
    }
  }
  return null;
};

export const updatePortfolioPnL = (deltaPct = 1.0) => {
  if (portfolio.length > 0) {
    const lastPoint = { ...portfolio[portfolio.length - 1] };
    const newPoint = {
      t: new Date().toISOString(),
      v: parseFloat((lastPoint.v + deltaPct).toFixed(2))
    };
    portfolio = [...portfolio, newPoint];
    return newPoint;
  }
  return null;
};