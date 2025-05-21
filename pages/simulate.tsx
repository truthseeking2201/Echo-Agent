import React, { useState } from 'react';
import type { NextPage } from 'next';
import Layout from '@/components/Layout';
import SimulationModal from '@/components/SimulationModal';
import Button from '@/components/Button';
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
import { motion } from 'framer-motion';

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const executeActualSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      const numSims = 1000;
      const buckets: Record<number, number> = {};
      const params = {
        mean: token === 'BTC' ? 0.025 : token === 'ETH' ? 0.02 : 0.015,
        stdDev: token === 'BTC' ? 0.05 : token === 'ETH' ? 0.04 : 0.06
      };
      let totalReturn = 0;
      let winsCount = 0;
      for (let i = 0; i < numSims; i++) {
        const returnPct = normalDist(params.mean, params.stdDev);
        const scaledReturn = returnPct * (positionPct / 100);
        const clampedReturn = clamp(scaledReturn, -0.3, 0.5);
        const bucket = Math.round(clampedReturn * 100);
        buckets[bucket] = (buckets[bucket] || 0) + 1;
        totalReturn += clampedReturn;
        if (clampedReturn > 0) winsCount++;
      }
      const expectedPnL = totalReturn / numSims * 100;
      const winProbability = winsCount / numSims * 100;
      const distribution = Object.entries(buckets)
        .map(([x, frequency]) => ({ x: parseInt(x), frequency }))
        .sort((a, b) => a.x - b.x);
      
      setSimulationResult({
        distribution,
        expectedPnL,
        winProbability
      });
      setIsSimulating(false);
    }, 100);
  };
  
  const handleRunSimulationClick = () => {
    setIsSimulating(true);
    setSimulationResult(null);
    setIsModalOpen(true);
  };

  const handleModalSimulationComplete = () => {
    setIsModalOpen(false);
  };

  return (
    <Layout title="Monte Carlo Simulation">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-panel rounded-xl shadow-xl p-6 mb-8 border border-white/10">
          <h2 className="text-2xl font-display font-semibold text-white mb-2">Monte Carlo Simulator</h2>
          <p className="text-white/70 text-sm mb-6">
            Project potential outcomes by simulating market scenarios based on historical volatility and your chosen risk parameters.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 items-end">
            <div>
              <label htmlFor="token-select" className="block text-sm font-medium text-white/80 mb-1.5">
                Select Token
              </label>
              <select
                id="token-select"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="w-full px-3 py-2.5 bg-bg-900 rounded-lg border border-white/20 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/70 transition-all"
              >
                {SAMPLE_TOKENS.map((t) => (
                  <option key={t} value={t}>${t}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="position-size-range" className="block text-sm font-medium text-white/80 mb-1.5">
                Position Size: <span className="font-semibold text-primary">{positionPct}%</span>
              </label>
              <input
                id="position-size-range"
                type="range"
                min={1}
                max={50}
                step={1}
                value={positionPct}
                onChange={(e) => setPositionPct(parseInt(e.target.value))}
                className="w-full h-2.5 rounded-lg appearance-none cursor-pointer range-slider-styled"
              />
            </div>
          </div>
          
          <div className="flex justify-center mt-8">
            <Button
              variant="gradient"
              size="lg"
              onClick={handleRunSimulationClick}
              disabled={isSimulating}
              withSound
            >
              {isSimulating && !isModalOpen ? 'Simulating Results...' : (isSimulating && isModalOpen ? 'AI Processing...': 'Run Simulation')}
            </Button>
          </div>
        </div>
        
        {isModalOpen && (
          <SimulationModal 
            isOpen={isModalOpen} 
            runSimulationLogic={executeActualSimulation} 
            onSimulationComplete={handleModalSimulationComplete} 
          />
        )}

        {simulationResult && !isModalOpen && (
          <motion.div 
            className="bg-panel rounded-xl shadow-xl p-6 border border-white/10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="p-4 rounded-lg bg-bg-900 border border-white/10">
                <h3 className="text-sm font-medium text-white/70 mb-1">Expected P&L</h3>
                <div className={`text-3xl font-mono font-bold ${simulationResult.expectedPnL >= 0 ? 'text-success' : 'text-error'}`}>
                  {simulationResult.expectedPnL.toFixed(2)}%
                </div>
              </div>
              
              <div className="p-4 rounded-lg bg-bg-900 border border-white/10">
                <h3 className="text-sm font-medium text-white/70 mb-1">Win Probability</h3>
                <div className="text-3xl font-mono font-bold text-primary">
                  {simulationResult.winProbability.toFixed(1)}%
                </div>
              </div>
            </div>
            
            <div className="h-96 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={simulationResult.distribution}
                  margin={{ top: 5, right: 0, left: -20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" strokeDashoffset={5} stroke="rgba(255,255,255,0.1)" />
                  <XAxis 
                    dataKey="x" 
                    label={{ value: 'Return (%)', position: 'insideBottom', dy:10, fill: 'rgba(255,255,255,0.5)' }} 
                    tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
                    axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
                    tickLine={{ stroke: 'rgba(255,255,255,0.2)' }}
                  />
                  <YAxis 
                    label={{ value: 'Frequency', angle: -90, position: 'insideLeft', dx:-5, fill: 'rgba(255,255,255,0.5)' }} 
                    tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
                    axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
                    tickLine={{ stroke: 'rgba(255,255,255,0.2)' }}
                  />
                  <Tooltip 
                    formatter={(value: any, name: any) => [value, 'Occurrences']}
                    labelFormatter={(label) => `Return: ${label}%`}
                    contentStyle={{ backgroundColor: '#070709', borderColor: 'rgba(255,255,255,0.2)', borderRadius:'8px' }}
                    labelStyle={{color: '#FFFFFF'}}
                    itemStyle={{color: '#00E5EE'}}
                    cursor={{fill: 'rgba(0, 229, 238, 0.1)'}}
                  />
                  <Legend wrapperStyle={{paddingTop: '20px'}} formatter={(value) => <span style={{color: 'rgba(255,255,255,0.7)'}}>{value}</span>}/>
                  <Bar 
                    dataKey="frequency" 
                    name="Occurrences"
                    fill="#00E5EE"
                    radius={[5, 5, 0, 0]} 
                    barSize={20}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-6 text-center text-xs text-white/60">
              <p>
                Simulation for <span className="font-semibold text-primary">${token}</span> with <span className="font-semibold text-primary">{positionPct}%</span> position size, based on 1,000 iterations.
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </Layout>
  );
};

export default Simulate;