import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { rand, randRange, normalDist, clamp } from './random';

// Define types for Token and Signal
type Token = keyof typeof TOKEN_PRICES;

interface Signal {
  id: string;
  token: Token;
  // Add other relevant properties from your signal objects if they exist
  // For example:
  // type: string;
  // rationale: string;
  // timestamp: string;
}

// Generate base token prices (for simulation)
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

export function generateTrades(count = 500, signalCount = 200) {
  const trades = [];
  const BASE_TS = Date.now() - (count * 15 * 60 * 1000); // Starting timestamp
  
  for (let i = 0; i < count; i++) {
    const side = i < 150 ? "BUY" : (rand() < 0.6 ? "BUY" : "SELL"); // More buys than sells
    
    // Link to a random signal
    const signalId = `sig_${String(Math.floor(rand() * signalCount)).padStart(4, '0')}`;
    
    // Read signals file to get the token
    const signalsPath = path.join(process.cwd(), 'mocks/data/signals.json');
    let token = Object.keys(TOKEN_PRICES)[Math.floor(rand() * Object.keys(TOKEN_PRICES).length)];
    
    if (fs.existsSync(signalsPath)) {
      try {
        const signals: Signal[] = JSON.parse(fs.readFileSync(signalsPath, 'utf8'));
        const signal = signals.find((s: Signal) => s.id === signalId);
        if (signal) {
          token = signal.token;
        }
      } catch (e) {
        // If error reading signals, use random token (already set)
      }
    }
    
    // Base price with some noise
    const basePrice = TOKEN_PRICES[token as Token] || 10;
    const price = basePrice * (1 + randRange(-0.02, 0.02));
    
    // Random quantity that looks realistic for the token price
    const qty = token === "BTC" ? randRange(0.01, 0.5) : 
                token === "ETH" ? randRange(0.1, 5) :
                basePrice > 100 ? randRange(0.5, 10) :
                basePrice > 10 ? randRange(5, 50) :
                basePrice > 1 ? randRange(10, 200) :
                basePrice > 0.1 ? randRange(100, 1000) :
                basePrice > 0.001 ? randRange(1000, 10000) :
                randRange(100000, 10000000);
    
    // Generate PnL - normal distribution centered at +2% with stddev of 4%
    const pnlPercent = clamp(normalDist(0.02, 0.04), -0.10, 0.15);
    
    // Generate realistic status based on PnL
    let status = "FILLED";
    if (pnlPercent >= 0.12) status = "TP"; // Take profit
    if (pnlPercent <= -0.08) status = "SL"; // Stop loss
    
    const trade = {
      id: `trd_${String(i).padStart(4, '0')}`,
      token,
      side,
      qty: parseFloat(qty.toFixed(6)),
      price: parseFloat(price.toFixed(6)),
      pnlPercent: parseFloat((pnlPercent * 100).toFixed(2)),
      txHash: "0xFA" + crypto.randomBytes(30).toString("hex").substring(0, 60),
      signalId,
      ts: new Date(BASE_TS + i * 15 * 60 * 1000).toISOString(), // 15 minutes apart
      status
    };
    
    trades.push(trade);
  }
  
  return trades;
}

// Execute if directly run
if (require.main === module) {
  const trades = generateTrades();
  const outputPath = path.join(process.cwd(), 'mocks/data/trades.json');
  fs.writeFileSync(outputPath, JSON.stringify(trades, null, 2));
  console.log(`Generated ${trades.length} trades to ${outputPath}`);
}