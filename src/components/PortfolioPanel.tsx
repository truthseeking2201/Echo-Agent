import React, { useState, useEffect, useMemo } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { durations, standardEasing } from '@/utils/motion';
import type { PnLPoint } from '@/store/echo';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

interface PortfolioPanelProps {
  data: PnLPoint[];
  view?: 'summary' | 'detail';
  height?: number;
  showControls?: boolean;
  timeframe?: '24h' | '7d' | '30d' | 'all';
  onTimeframeChange?: (timeframe: '24h' | '7d' | '30d' | 'all') => void;
  isLoading?: boolean;
}

/**
 * Consolidated portfolio component that can display summary or detailed portfolio information
 * Combines PnLWidget + PortfolioChart into a single component
 * 
 * @example
 * <PortfolioPanel 
 *   data={portfolioData} 
 *   view="summary" 
 *   height={240} 
 * />
 */
export const PortfolioPanel: React.FC<PortfolioPanelProps> = ({ 
  data, 
  view = 'summary',
  height = 240,
  showControls = true,
  timeframe = '24h',
  onTimeframeChange,
  isLoading = false
}) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'24h' | '7d' | '30d' | 'all'>(timeframe);
  const chartControls = useAnimation();
  
  // Calculate current P&L value and daily change
  const currentValue = data.length > 0 ? data[data.length - 1].v : 0;
  
  // Filter data based on selected timeframe
  const filteredData = useMemo(() => {
    if (data.length === 0) return [];
    
    const now = new Date();
    let filterTime: Date;
    
    switch (selectedTimeframe) {
      case '24h':
        filterTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        filterTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        filterTime = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        return data;
    }
    
    return data.filter(point => new Date(point.t) >= filterTime);
  }, [data, selectedTimeframe]);
  
  // Calculate daily change (most recent point vs point 24h ago)
  const dailyChange = useMemo(() => {
    if (data.length < 2) return 0;
    
    const latest = data[data.length - 1].v;
    // Find point closest to 24h ago
    const now = new Date();
    const yesterday = new Date(now.setDate(now.getDate() - 1));
    
    let closestPoint = data[0];
    let closestDiff = Infinity;
    
    for (const point of data) {
      const pointDate = new Date(point.t);
      const diff = Math.abs(pointDate.getTime() - yesterday.getTime());
      
      if (diff < closestDiff) {
        closestDiff = diff;
        closestPoint = point;
      }
    }
    
    return latest - closestPoint.v;
  }, [data]);
  
  // Handle timeframe change
  const handleTimeframeChange = (newTimeframe: '24h' | '7d' | '30d' | 'all') => {
    setSelectedTimeframe(newTimeframe);
    chartControls.start({
      opacity: [0.5, 1],
      scale: [0.98, 1],
      transition: { duration: durations.medium, ease: standardEasing }
    });
    
    if (onTimeframeChange) {
      onTimeframeChange(newTimeframe);
    }
  };
  
  // Format tooltip data
  const formatTooltip = (value: any, name: any, props: any) => {
    return [`${value.toFixed(2)}%`, 'P&L'];
  };
  
  // Format X-axis labels (time)
  const formatXAxis = (tickItem: any) => {
    const date = new Date(tickItem);
    if (selectedTimeframe === '24h') {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };
  
  // Gradient colors based on performance
  const getGradientColors = () => {
    if (currentValue >= 0) {
      return {
        start: 'rgba(34, 229, 112, 0.8)',
        mid: 'rgba(34, 229, 112, 0.4)',
        end: 'rgba(34, 229, 112, 0)'
      };
    } else {
      return {
        start: 'rgba(248, 120, 120, 0.8)',
        mid: 'rgba(248, 120, 120, 0.4)',
        end: 'rgba(248, 120, 120, 0)'
      };
    }
  };
  
  const gradientColors = getGradientColors();
  
  // Default domain for Y-axis
  const getYAxisDomain = () => {
    if (filteredData.length === 0) return [-10, 10];
    
    const values = filteredData.map(d => d.v);
    const min = Math.min(...values);
    const max = Math.max(...values);
    
    // Ensure we have some padding and the domain isn't too small
    const padding = Math.max(2, (max - min) * 0.2);
    return [Math.floor(min - padding), Math.ceil(max + padding)];
  };
  
  return (
    <div className={`neo-card p-4 ${view === 'detail' ? 'h-full' : ''}`}>
      {/* Summary with P&L value */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-sm font-medium text-white/70">Portfolio P&L</h3>
          {isLoading ? (
            <div className="flex items-baseline space-x-2">
              <div className="animate-pulse bg-white/10 h-6 w-24 rounded-md"></div>
              <div className="animate-pulse bg-white/10 h-4 w-20 rounded-md"></div>
            </div>
          ) : (
            <div className="flex items-baseline space-x-2">
              <span className={`text-2xl font-mono font-bold ${currentValue >= 0 ? 'text-success' : 'text-error'}`}>
                {currentValue.toFixed(2)}%
              </span>
              
              {dailyChange !== 0 && (
                <span className={`text-sm font-mono ${dailyChange >= 0 ? 'text-success' : 'text-error'}`}>
                  {dailyChange >= 0 ? '+' : ''}{dailyChange.toFixed(2)}% (24h)
                </span>
              )}
            </div>
          )}
        </div>
        
        {/* Timeframe controls */}
        {showControls && (
          <div className="flex space-x-1">
            {(['24h', '7d', '30d', 'all'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => handleTimeframeChange(tf)}
                disabled={isLoading}
                className={`
                  px-2 py-1 text-xs rounded-md transition-colors duration-fast 
                  ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                  ${selectedTimeframe === tf 
                    ? 'bg-primary/20 text-primary' 
                    : 'text-white/50 hover:text-white/80 hover:bg-white/5'}
                `}
              >
                {tf}
              </button>
            ))}
          </div>
        )}
      </div>
      
      {/* Chart */}
      <motion.div 
        className="grid-reveal-mask h-full min-h-[150px]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: durations.medium, ease: standardEasing }}
        style={{ height: view === 'detail' ? '100%' : height }}
      >
        <motion.div
          className="w-full h-full"
          animate={chartControls}
        >
          {isLoading ? (
            <div className="h-full flex flex-col items-center justify-center">
              <div className="relative w-12 h-12">
                <div className="absolute top-0 left-0 w-full h-full border-4 border-primary/20 rounded-full"></div>
                <div className="absolute top-0 left-0 w-full h-full border-4 border-primary rounded-full animate-spin border-t-transparent"></div>
              </div>
              <p className="text-sm text-white/60 mt-4">Loading data...</p>
            </div>
          ) : filteredData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={filteredData}
                margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
              >
                <defs>
                  <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={gradientColors.start} />
                    <stop offset="50%" stopColor={gradientColors.mid} />
                    <stop offset="100%" stopColor={gradientColors.end} />
                  </linearGradient>
                </defs>
                
                {/* Remove X & Y axis lines */}
                <XAxis 
                  dataKey="t" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'rgba(255, 255, 255, 0.5)', fontSize: 10 }}
                  tickFormatter={formatXAxis}
                  minTickGap={30}
                />
                
                <YAxis 
                  domain={getYAxisDomain()}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'rgba(255, 255, 255, 0.5)', fontSize: 10 }}
                  tickFormatter={(value) => `${value}%`}
                  width={40}
                />
                
                {/* Tooltips and reference line */}
                <Tooltip 
                  formatter={formatTooltip}
                  labelFormatter={(label) => new Date(label).toLocaleString()}
                  contentStyle={{ 
                    backgroundColor: 'rgba(7, 7, 9, 0.9)', 
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px'
                  }}
                  itemStyle={{ color: currentValue >= 0 ? '#22E570' : '#F87878' }}
                />
                
                <ReferenceLine 
                  y={0} 
                  stroke="rgba(255, 255, 255, 0.2)" 
                  strokeDasharray="3 3" 
                />
                
                {/* Area chart with gradient */}
                <Area 
                  type="monotone" 
                  dataKey="v" 
                  stroke={currentValue >= 0 ? 'rgba(34, 229, 112, 1)' : 'rgba(248, 120, 120, 1)'} 
                  fillOpacity={1}
                  fill="url(#portfolioGradient)"
                  strokeWidth={2}
                  activeDot={{ 
                    r: 6, 
                    stroke: currentValue >= 0 ? 'rgba(34, 229, 112, 1)' : 'rgba(248, 120, 120, 1)',
                    strokeWidth: 2,
                    fill: '#070709'
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-white/40">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 16L12 12M12 12L16 8M12 12L8 8M12 12L16 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
              <p className="text-sm mt-2">No data available</p>
            </div>
          )}
        </motion.div>
      </motion.div>
      
      {/* Stats and insights - only for detailed view */}
      {view === 'detail' && (
        isLoading ? (
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((index) => (
              <div key={index} className="glassmorphic p-3">
                <div className="animate-pulse bg-white/10 h-3 w-16 rounded-md mb-2"></div>
                <div className="animate-pulse bg-white/10 h-6 w-12 rounded-md"></div>
              </div>
            ))}
          </div>
        ) : filteredData.length > 0 && (
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="glassmorphic p-3">
              <h4 className="text-xs text-white/50 mb-1">Win Rate</h4>
              <div className="text-lg font-mono font-bold text-primary">74%</div>
            </div>
            
            <div className="glassmorphic p-3">
              <h4 className="text-xs text-white/50 mb-1">Best Trade</h4>
              <div className="text-lg font-mono font-bold text-success">+12.4%</div>
            </div>
            
            <div className="glassmorphic p-3">
              <h4 className="text-xs text-white/50 mb-1">Worst Trade</h4>
              <div className="text-lg font-mono font-bold text-error">-6.8%</div>
            </div>
            
            <div className="glassmorphic p-3">
              <h4 className="text-xs text-white/50 mb-1">Avg. Hold Time</h4>
              <div className="text-lg font-mono font-bold text-white">3.2 hr</div>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default PortfolioPanel;