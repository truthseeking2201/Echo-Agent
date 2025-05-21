import fs from 'fs';
import path from 'path';
import { rand, randRange, triangularDist } from './random';

// Sample tokens
const SAMPLE_TOKENS = [
  "ETH", "BTC", "SOL", "AVAX", "MATIC", 
  "LINK", "DOT", "UNI", "AAVE", "PEPE",
  "SHIB", "DOGE", "ADA", "XRP", "BNB"
];

// Sample callers (influencers)
const SAMPLE_CALLERS = [
  "@SmartDeFi", "@CryptoWizard", "@ChainGuru", "@BlockExpert", "@TokenSage",
  "@AlphaHunter", "@OnChainAnalyst", "@DefiMaster", "@TechTrader", "@TokenVision"
];

export function generateSignals(count = 200) {
  const signals = [];
  const BASE_TS = Date.now() - (count * 7 * 60 * 1000); // Starting timestamp
  
  for (let i = 0; i < count; i++) {
    const tokenIndex = Math.floor(rand() * SAMPLE_TOKENS.length);
    const token = SAMPLE_TOKENS[tokenIndex];
    
    // Read token-specific rationale or use default
    let rationaleMd = '';
    const templatePath = path.join(process.cwd(), 'mocks/templates', `${token}.md`);
    
    if (fs.existsSync(templatePath)) {
      rationaleMd = fs.readFileSync(templatePath, 'utf8');
    } else {
      rationaleMd = `# ${token} Analysis\n\nTechnical and fundamental analysis indicates a favorable entry point based on recent market movements.`;
    }
    
    const signal = {
      id: `sig_${String(i).padStart(4, '0')}`,
      token,
      caller: SAMPLE_CALLERS[Math.floor(rand() * SAMPLE_CALLERS.length)],
      confidence: Math.round(triangularDist(30, 70, 95)), // Triangular distribution
      createdAt: new Date(BASE_TS + i * 7 * 60 * 1000).toISOString(), // 7 minutes apart
      rationaleMd
    };
    
    signals.push(signal);
  }
  
  return signals;
}

// Execute if directly run
if (require.main === module) {
  const signals = generateSignals();
  const outputPath = path.join(process.cwd(), 'mocks/data/signals.json');
  fs.writeFileSync(outputPath, JSON.stringify(signals, null, 2));
  console.log(`Generated ${signals.length} signals to ${outputPath}`);
}