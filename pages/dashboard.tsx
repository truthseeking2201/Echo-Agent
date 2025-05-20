import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import { useEchoStore } from '@/store/echo';
import Layout from '@/components/Layout';
import PnLWidget from '@/components/PnLWidget';
import VaRGauge from '@/components/VaRGauge';
import PortfolioChart from '@/components/PortfolioChart';
import TradesTable from '@/components/TradesTable';
import Button from '@/components/Button';
import Toast, { ToastType } from '@/components/Toast';

interface ToastState {
  visible: boolean;
  message: string;
  type: ToastType;
}

const Dashboard: NextPage = () => {
  const { portfolio, trades, settings, connectWallet, mirror, wallet } = useEchoStore();
  const [toast, setToast] = useState<ToastState>({ visible: false, message: '', type: 'info' });
  
  // Connect wallet automatically when page loads
  useEffect(() => {
    if (!wallet.connected) {
      connectWallet();
    }
  }, [connectWallet, wallet.connected]);
  
  // Calculate daily change (most recent point vs point 24h ago)
  const calculateDailyChange = () => {
    if (portfolio.length < 2) return 0;
    
    const latest = portfolio[portfolio.length - 1].v;
    // Find point closest to 24h ago
    const now = new Date();
    const yesterday = new Date(now.setDate(now.getDate() - 1));
    
    let closestPoint = portfolio[0];
    let closestDiff = Infinity;
    
    for (const point of portfolio) {
      const pointDate = new Date(point.t);
      const diff = Math.abs(pointDate.getTime() - yesterday.getTime());
      
      if (diff < closestDiff) {
        closestDiff = diff;
        closestPoint = point;
      }
    }
    
    return latest - closestPoint.v;
  };
  
  // Auto-trade functionality
  const handleAutoTrade = async () => {
    if (!wallet.connected) {
      connectWallet();
      return;
    }
    
    // If no signals yet, show a toast
    if (useEchoStore.getState().signals.length === 0) {
      setToast({
        visible: true,
        message: 'Waiting for signals...',
        type: 'info'
      });
      return;
    }
    
    // Take the first signal and mirror it
    const signal = useEchoStore.getState().signals[0];
    
    try {
      setToast({
        visible: true,
        message: `Submitting trade for $${signal.token}...`,
        type: 'info'
      });
      
      const trade = await mirror(signal.id);
      
      // Show success toast
      setToast({
        visible: true,
        message: `Tx ${trade.txHash.substring(0, 6)}...${trade.txHash.substring(trade.txHash.length - 4)} confirmed`,
        type: 'success'
      });
    } catch (error) {
      console.error('Error mirroring trade:', error);
      
      // Show error toast
      setToast({
        visible: true,
        message: `Error: ${(error as Error).message || 'Failed to mirror trade'}`,
        type: 'error'
      });
    }
  };
  
  return (
    <Layout title="Dashboard">
      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <PnLWidget 
          value={portfolio.length > 0 ? portfolio[portfolio.length - 1].v : 0}
          delta={calculateDailyChange()}
        />
        
        <div className="p-4 rounded-lg bg-surface-card">
          <h3 className="text-sm font-medium text-gray-400 mb-1">Win Rate</h3>
          <div className="text-3xl font-space font-bold text-blue-400">
            {trades.length > 0 ? (
              `${Math.round((trades.filter(t => t.pnlPercent > 0).length / trades.length) * 100)}%`
            ) : '0%'}
          </div>
          <div className="text-sm text-gray-400 mt-1">
            {trades.filter(t => t.pnlPercent > 0).length}/{trades.length} profitable trades
          </div>
        </div>
        
        <div className="p-4 rounded-lg bg-surface-card">
          <h3 className="text-sm font-medium text-gray-400 mb-1">Risk Exposure</h3>
          <div className="mt-2">
            <VaRGauge pct={settings.maxRiskPct} />
          </div>
          <div className="mt-4 flex justify-center">
            <Button 
              variant="primary"
              onClick={handleAutoTrade}
              disabled={settings.isPaused}
            >
              {wallet.connected ? 'Enable Auto-Trade' : 'Connect Wallet'}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Portfolio Chart */}
      <div className="mb-6">
        <PortfolioChart data={portfolio} height={240} />
      </div>
      
      {/* Recent Trades */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Recent Trades</h2>
        </div>
        
        <TradesTable trades={trades} limit={5} />
      </div>
      
      {/* Toast */}
      {toast.visible && (
        <Toast
          msg={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, visible: false })}
        />
      )}
    </Layout>
  );
};

export default Dashboard;