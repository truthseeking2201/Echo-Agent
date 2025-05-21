import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import type { PnLPoint } from '@/store/echo';

interface PortfolioChartProps {
  data: PnLPoint[];
  height?: number;
  isLoading?: boolean;
}

/**
 * An area chart showing portfolio performance over time based on UI revamp specs
 * Uses gradient-ai for line color clipped to path
 * Axes use JetBrains Mono 12/18, 60% white
 * Tooltip is glass panel with neon edge
 * 
 * @example
 * <PortfolioChart data={portfolioData} height={240} />
 */
export const PortfolioChart: React.FC<PortfolioChartProps> = ({
  data,
  height = 240,
  isLoading = false
}) => {
  // Format date for X-axis ticks
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };
  
  // Custom tooltip formatting - glass panel, neon edge
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const date = new Date(label);
      const formattedDate = date.toLocaleDateString();
      const value = payload[0].value.toFixed(2);
      const color = payload[0].value >= 0 ? 'text-success' : 'text-error';
      
      return (
        <div className="relative px-4 py-3 bg-surface backdrop-blur-glass rounded-lg shadow-soft overflow-hidden">
          {/* Neon edge */}
          <div className="absolute inset-0 p-px rounded-lg bg-gradient-ai opacity-70"></div>
          <div className="relative z-10">
            <p className="text-code text-white/60 mb-1 font-mono">{formattedDate}</p>
            <p className={`text-code font-mono font-medium ${color}`}>
              {value >= 0 ? '+' : ''}{value}%
            </p>
          </div>
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="neo-card p-4">
      <h3 className="text-subhead font-medium mb-4">Portfolio Equity</h3>
      
      {isLoading ? (
        <div className="w-full h-60 flex items-center justify-center">
          <div className="skeleton h-40 w-full rounded-lg"></div>
        </div>
      ) : data.length === 0 ? (
        <div className="w-full h-60 flex items-center justify-center">
          <p className="text-white/40">No portfolio data available</p>
        </div>
      ) : (
        <div style={{ width: '100%', height }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 8, right: 0, left: 0, bottom: 0 }}
            >
              <defs>
                {/* AI gradient clipped to path as per UI revamp spec */}
                <linearGradient id="colorPnl" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#00E5EE" stopOpacity={0.9} />
                  <stop offset="33%" stopColor="#A855F7" stopOpacity={0.9} />
                  <stop offset="66%" stopColor="#FF6D9C" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#FB7E16" stopOpacity={0.9} />
                </linearGradient>
                <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00E5EE" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#00E5EE" stopOpacity={0.01} />
                </linearGradient>
              </defs>
              
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="rgba(255,255,255,0.06)" 
                vertical={false} 
              />
              
              {/* JetBrains Mono 12/18, 60% white as per spec */}
              <XAxis 
                dataKey="t" 
                tickFormatter={formatDate}
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12, fontFamily: '"JetBrains Mono", monospace' }}
                tickCount={6}
              />
              
              <YAxis 
                tickFormatter={(value) => `${value.toFixed(0)}%`}
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12, fontFamily: '"JetBrains Mono", monospace' }}
                width={46}
              />
              
              <Tooltip 
                content={<CustomTooltip />} 
                cursor={{ stroke: 'rgba(255,255,255,0.2)' }}
                wrapperStyle={{ outline: 'none' }}
              />
              
              {/* Gradient line as per UI revamp spec */}
              <Area 
                type="monotone" 
                dataKey="v" 
                stroke="url(#colorPnl)" 
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#areaFill)" 
                activeDot={{ 
                  r: 6, 
                  stroke: '#050507', 
                  strokeWidth: 2, 
                  fill: '#00E5EE'
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default PortfolioChart;