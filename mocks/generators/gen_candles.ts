import fs from 'fs';
import path from 'path';
import { randRange, normalDist } from './random';

// Generate base token prices (same as in trades generator)
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

// Define Token type
type Token = keyof typeof TOKEN_PRICES;

type Candle = {
  time: string;  // ISO timestamp
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

export function generateCandles(token: string, count = 365, interval = '1d') {
  const candles: Candle[] = [];
  const start = new Date();
  start.setDate(start.getDate() - count); // Start 'count' intervals ago
  
  // Get base price or default to 100
  let price = TOKEN_PRICES[token as Token] || 100;
  
  for (let i = 0; i < count; i++) {
    // Generate timestamp
    const date = new Date(start);
    
    if (interval === '1d') {
      date.setDate(date.getDate() + i);
    } else if (interval === '1h') {
      date.setHours(date.getHours() + i);
    } else if (interval === '15m') {
      date.setMinutes(date.getMinutes() + i * 15);
    }
    
    // Daily price change - normal distribution with slight upward bias
    const priceChange = normalDist(0.001, 0.02);
    price = price * (1 + priceChange);
    
    // Candle open price is close of previous candle or initial price
    const open = i === 0 ? price : candles[i-1].close;
    const close = price;
    
    // High and low based on volatility
    const volatility = Math.abs(normalDist(0, 0.02)) + 0.01; // Min 1% range
    const high = Math.max(open, close) * (1 + volatility/2);
    const low = Math.min(open, close) * (1 - volatility/2);
    
    // Volume - higher on bigger price moves
    const baseVolume = token === "BTC" ? 5000 : 
                      token === "ETH" ? 20000 :
                      price > 100 ? 50000 :
                      price > 10 ? 200000 :
                      price > 1 ? 500000 :
                      price > 0.1 ? 2000000 :
                      price > 0.001 ? 10000000 :
                      100000000;
    
    const volume = baseVolume * (1 + Math.abs(priceChange) * 10);
    
    candles.push({
      time: date.toISOString(),
      open: parseFloat(open.toFixed(6)),
      high: parseFloat(high.toFixed(6)),
      low: parseFloat(low.toFixed(6)),
      close: parseFloat(close.toFixed(6)),
      volume: Math.round(volume)
    });
  }
  
  return candles;
}

// Execute if directly run
if (require.main === module) {
  const allCandles: Record<string, Candle[]> = {};
  
  // Generate candles for each token
  for (const token of Object.keys(TOKEN_PRICES) as Token[]) {
    allCandles[token] = generateCandles(token);
  }
  
  const outputPath = path.join(process.cwd(), 'mocks/data/candles.json');
  fs.writeFileSync(outputPath, JSON.stringify(allCandles, null, 2));
  console.log(`Generated candles for ${Object.keys(allCandles).length} tokens to ${outputPath}`);
}