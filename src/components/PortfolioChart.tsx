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
 * An area chart showing portfolio performance over time
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
  
  // Custom tooltip formatting
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const date = new Date(label);
      const formattedDate = date.toLocaleDateString();
      const value = payload[0].value.toFixed(2);
      const color = payload[0].value >= 0 ? 'text-success' : 'text-error';
      
      return (
        <div className="glassmorphic px-3 py-2 shadow-glow">
          <p className="text-xs text-white/60 mb-1">{formattedDate}</p>
          <p className={`text-sm font-mono font-medium ${color}`}>
            {value >= 0 ? '+' : ''}{value}%
          </p>
        </div>
      );
    }
    
    return null;
  };
  
  // Determine chart gradient colors based on current PnL
  const isPositive = data.length > 0 && data[data.length - 1].v >= 0;
  const gradientColor = isPositive ? '#22C55E' : '#F87171';
  const gradientOpacity = isPositive ? [0.6, 0.05] : [0.6, 0.05];

  return (
    <div className="glassmorphic p-4">
      <h3 className="text-sm font-medium text-white/60 mb-4">Portfolio Equity</h3>
      
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
                <linearGradient id="colorPnl" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={gradientColor} stopOpacity={gradientOpacity[0]} />
                  <stop offset="95%" stopColor={gradientColor} stopOpacity={gradientOpacity[1]} />
                </linearGradient>
              </defs>
              
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="rgba(255,255,255,0.1)" 
                vertical={false} 
              />
              
              <XAxis 
                dataKey="t" 
                tickFormatter={formatDate}
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 10 }}
                tickCount={6}
              />
              
              <YAxis 
                tickFormatter={(value) => `${value.toFixed(0)}%`}
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 10 }}
                width={42}
              />
              
              <Tooltip 
                content={<CustomTooltip />} 
                cursor={{ stroke: 'rgba(255,255,255,0.2)' }}
              />
              
              <Area 
                type="monotone" 
                dataKey="v" 
                stroke={gradientColor} 
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorPnl)" 
                activeDot={{ 
                  r: 6, 
                  stroke: '#111827', 
                  strokeWidth: 2, 
                  fill: gradientColor 
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