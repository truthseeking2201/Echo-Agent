import fs from 'fs';
import path from 'path';
import { randRange } from './random';

export function generatePortfolio(days = 365) {
  const points = [];
  const start = new Date();
  start.setDate(start.getDate() - days); // Start 'days' ago
  
  let v = 0; // Cumulative percent
  
  for (let d = 0; d < days; d++) {
    // Daily returns: slightly positive bias for the demo
    v += randRange(-0.008, 0.014);
    
    const date = new Date(start);
    date.setDate(date.getDate() + d);
    
    points.push({
      t: date.toISOString(),
      v: parseFloat((v * 100).toFixed(2)) // Convert to percent and fix precision
    });
  }
  
  return points;
}

// Execute if directly run
if (require.main === module) {
  const portfolio = generatePortfolio();
  const outputPath = path.join(process.cwd(), 'mocks/data/portfolio.json');
  fs.writeFileSync(outputPath, JSON.stringify(portfolio, null, 2));
  console.log(`Generated ${portfolio.length} portfolio points to ${outputPath}`);
}