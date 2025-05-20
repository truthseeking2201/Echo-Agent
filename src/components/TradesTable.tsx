import React from 'react';
import { motion } from 'framer-motion';
import type { Trade } from '@/store/echo';
import { durations, standardEasing } from '@/utils/motion';

interface TradesTableProps {
  trades: Trade[];
  limit?: number;
  onSelectTrade?: (id: string) => void;
  selectedId?: string;
  isLoading?: boolean;
}

/**
 * A table displaying recent trades with option to select a row
 * @example
 * <TradesTable 
 *   trades={tradesData} 
 *   limit={5} 
 *   onSelectTrade={(id) => setSelectedTrade(id)} 
 * />
 */
export const TradesTable: React.FC<TradesTableProps> = ({
  trades,
  limit,
  onSelectTrade,
  selectedId,
  isLoading = false
}) => {
  // Limit the number of displayed trades if needed
  const displayTrades = limit ? trades.slice(0, limit) : trades;
  
  // Format date for display
  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Format hash for display
  const formatHash = (hash: string) => {
    return `${hash.substring(0, 6)}...${hash.substring(hash.length - 4)}`;
  };

  return (
    <div className="glassmorphic overflow-hidden">
      {isLoading ? (
        <div className="p-6 min-h-[200px]">
          <div className="h-8 w-1/3 skeleton rounded mb-4"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 w-full skeleton rounded"></div>
            ))}
          </div>
        </div>
      ) : displayTrades.length === 0 ? (
        <div className="p-8 text-center min-h-[200px] flex items-center justify-center">
          <p className="text-white/40">You haven't mirrored any trades yet</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-white/10">
            <thead className="bg-surface-dark">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                  Token
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                  Side
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                  Quantity
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                  Price
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                  PnL
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-white/10">
              {displayTrades.map((trade) => (
                <motion.tr 
                  key={trade.id}
                  onClick={() => onSelectTrade?.(trade.id)}
                  initial={{ opacity: 0.8 }}
                  animate={{ 
                    opacity: 1,
                    backgroundColor: selectedId === trade.id ? 'rgba(59, 130, 246, 0.1)' : 'transparent'
                  }}
                  whileHover={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.05)'
                  }}
                  transition={{
                    duration: durations.fast,
                    ease: standardEasing
                  }}
                  className={`
                    cursor-pointer
                    ${selectedId === trade.id ? 'bg-primary/10' : ''}
                  `}
                >
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <div className="flex items-center">
                      <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center mr-2">
                        <span className="text-xs font-medium text-primary">${trade.token[0]}</span>
                      </div>
                      <span className="font-medium">${trade.token}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      trade.side === 'BUY' ? 'bg-success/20 text-success' : 'bg-error/20 text-error'
                    }`}>
                      {trade.side}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-mono text-white/80">
                    {trade.qty.toFixed(trade.qty < 0.01 ? 6 : trade.qty < 1 ? 4 : 2)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-mono text-white/80">
                    ${trade.price.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-mono">
                    <span className={trade.pnlPercent >= 0 ? 'text-success' : 'text-error'}>
                      {trade.pnlPercent >= 0 ? '+' : ''}{trade.pnlPercent}%
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-white/80">
                    {formatDate(trade.ts)}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TradesTable;