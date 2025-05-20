import path from 'path';
import fs from 'fs';
import { generateSignals } from './gen_signals';
import { generateTrades } from './gen_trades';
import { generatePortfolio } from './gen_portfolio';
import { generateCandles } from './gen_candles';

// Ensure data directory exists
const dataDir = path.join(process.cwd(), 'mocks/data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Generate all mock data
console.log('Generating mock data...');

// 1. Generate signals first
const signals = generateSignals(200);
const signalsPath = path.join(dataDir, 'signals.json');
fs.writeFileSync(signalsPath, JSON.stringify(signals, null, 2));
console.log(`Generated ${signals.length} signals to ${signalsPath}`);

// 2. Generate trades based on signals
const trades = generateTrades(500, signals.length);
const tradesPath = path.join(dataDir, 'trades.json');
fs.writeFileSync(tradesPath, JSON.stringify(trades, null, 2));
console.log(`Generated ${trades.length} trades to ${tradesPath}`);

// 3. Generate portfolio history
const portfolio = generatePortfolio(365);
const portfolioPath = path.join(dataDir, 'portfolio.json');
fs.writeFileSync(portfolioPath, JSON.stringify(portfolio, null, 2));
console.log(`Generated ${portfolio.length} portfolio points to ${portfolioPath}`);

// 4. Generate candles
const TOKEN_PRICES = {
  "ETH": 4000,
  "BTC": 60000,
  "SOL": 150,
  "AVAX": 35,
  "MATIC": 1.2,
  "LINK": 18,
  "DOT": 25,
  "UNI": 8,
  "AAVE": 100,
  "PEPE": 0.0000012,
  "SHIB": 0.00003,
  "DOGE": 0.12,
  "ADA": 0.5,
  "XRP": 0.8,
  "BNB": 450
};

const allCandles: Record<string, any[]> = {};
// Generate candles for each token
for (const token of Object.keys(TOKEN_PRICES)) {
  allCandles[token] = generateCandles(token, 365, '1d');
}

const candlesPath = path.join(dataDir, 'candles.json');
fs.writeFileSync(candlesPath, JSON.stringify(allCandles, null, 2));
console.log(`Generated candles for ${Object.keys(allCandles).length} tokens to ${candlesPath}`);

console.log('All mock data generated successfully!');