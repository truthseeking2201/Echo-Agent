import React, { useState } from 'react';
import type { NextPage } from 'next';
import Layout from '@/components/Layout';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { normalDist, clamp } from '../mocks/generators/random';

// Sample tokens from the generators
const SAMPLE_TOKENS = [
  "ETH", "BTC", "SOL", "AVAX", "MATIC", 
  "LINK", "DOT", "UNI", "AAVE", "PEPE"
];

interface SimulationResult {
  distribution: { x: number; frequency: number }[];
  expectedPnL: number;
  winProbability: number;
}

const Simulate: NextPage = () => {
  const [token, setToken] = useState('ETH');
  const [positionPct, setPositionPct] = useState(10);
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  
  // Run Monte Carlo simulation
  const runSimulation = () => {
    setIsSimulating(true);
    
    // Simulate in next tick to allow UI to update
    setTimeout(() => {
      // Number of simulations
      const numSims = 1000;
      
      // Histogram buckets
      const buckets: Record<number, number> = {};
      
      // Simulation parameters based on token
      const params = {
        mean: token === 'BTC' ? 0.025 : token === 'ETH' ? 0.02 : 0.015,
        stdDev: token === 'BTC' ? 0.05 : token === 'ETH' ? 0.04 : 0.06
      };
      
      // Generate random PnL values
      let totalReturn = 0;
      let winsCount = 0;
      
      for (let i = 0; i < numSims; i++) {
        // Generate return following normal distribution
        const returnPct = normalDist(params.mean, params.stdDev);
        
        // Apply position sizing
        const scaledReturn = returnPct * (positionPct / 100);
        
        // Clamp extreme values
        const clampedReturn = clamp(scaledReturn, -0.3, 0.5);
        
        // Round to nearest percentage point for histogram
        const bucket = Math.round(clampedReturn * 100);
        
        buckets[bucket] = (buckets[bucket] || 0) + 1;
        totalReturn += clampedReturn;
        
        if (clampedReturn > 0) winsCount++;
      }
      
      // Calculate expected PnL and win probability
      const expectedPnL = totalReturn / numSims * 100; // Convert to percentage
      const winProbability = winsCount / numSims * 100;
      
      // Convert buckets to chart data
      const distribution = Object.entries(buckets)
        .map(([x, frequency]) => ({ x: parseInt(x), frequency }))
        .sort((a, b) => a.x - b.x);
      
      setSimulationResult({
        distribution,
        expectedPnL,
        winProbability
      });
      
      setIsSimulating(false);
    }, 500);
  };
  
  return (
    <Layout title="Simulation">
      <div className="max-w-4xl mx-auto">
        <div className="bg-surface-card rounded-lg p-6 mb-6">
          <h2 className="text-xl font-medium mb-4">Monte Carlo Simulator</h2>
          <p className="text-gray-400 text-sm mb-6">
            Simulate potential outcomes based on historical token volatility and your risk settings.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Select Token
              </label>
              <select
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="w-full px-3 py-2 bg-surface rounded-md border border-gray-700 text-sm focus:outline-none focus:ring-1 focus:ring-electric-ink"
              >
                {SAMPLE_TOKENS.map((t) => (
                  <option key={t} value={t}>${t}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Position Size (% of Portfolio)
              </label>
              <input
                type="range"
                min={1}
                max={50}
                step={1}
                value={positionPct}
                onChange={(e) => setPositionPct(parseInt(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #6EE7B7 0%, #6EE7B7 ${positionPct * 2}%, #374151 ${positionPct * 2}%, #374151 100%)`
                }}
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>1%</span>
                <span>{positionPct}%</span>
                <span>50%</span>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center">
            <button
              onClick={runSimulation}
              disabled={isSimulating}
              className={`
                px-4 py-2 rounded-md text-white font-medium
                ${isSimulating ? 'bg-gray-600 cursor-not-allowed' : 'bg-primary hover:bg-primary-dark'}
                transition-colors
              `}
            >
              {isSimulating ? 'Simulating...' : 'Run Simulation'}
            </button>
          </div>
        </div>
        
        {simulationResult && (
          <div className="bg-surface-card rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="p-4 rounded-lg bg-surface">
                <h3 className="text-sm font-medium text-gray-400 mb-1">Expected PnL</h3>
                <div className={`text-2xl font-space font-bold ${simulationResult.expectedPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {simulationResult.expectedPnL.toFixed(2)}%
                </div>
              </div>
              
              <div className="p-4 rounded-lg bg-surface">
                <h3 className="text-sm font-medium text-gray-400 mb-1">Win Probability</h3>
                <div className="text-2xl font-space font-bold text-blue-400">
                  {simulationResult.winProbability.toFixed(1)}%
                </div>
              </div>
            </div>
            
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={simulationResult.distribution}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="x" 
                    label={{ value: 'Return (%)', position: 'insideBottom', offset: -5, fill: '#9CA3AF' }} 
                    tick={{ fill: '#9CA3AF' }}
                  />
                  <YAxis 
                    label={{ value: 'Frequency', angle: -90, position: 'insideLeft', fill: '#9CA3AF' }} 
                    tick={{ fill: '#9CA3AF' }}
                  />
                  <Tooltip 
                    formatter={(value: any, name: any) => [value, 'Occurrences']}
                    labelFormatter={(label) => `Return: ${label}%`}
                    contentStyle={{ backgroundColor: '#1F2937', borderColor: '#4B5563' }}
                  />
                  <Legend />
                  <Bar 
                    dataKey="frequency" 
                    name="Frequency" 
                    fill="#6EE7B7" 
                    radius={[4, 4, 0, 0]} 
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-4 text-sm text-gray-400">
              <p>
                Simulation for ${token} with {positionPct}% position size, based on 1,000 iterations.
              </p>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Simulate;