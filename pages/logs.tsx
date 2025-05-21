import React, { useState } from 'react';
import type { NextPage } from 'next';
import { useEchoStore } from '@/store/echo';
import Layout from '@/components/Layout';
import TradesTable from '@/components/TradesTable';

const Logs: NextPage = () => {
  const { trades } = useEchoStore();
  const [selectedTradeId, setSelectedTradeId] = useState<string | undefined>(
    trades.length > 0 ? trades[0].id : undefined
  );
  
  return (
    <Layout title="Trade Logs">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-lg font-medium">Trading History</h2>
        
        <div className="text-sm text-gray-400">
          {trades.length} trades total
        </div>
      </div>
      
      <TradesTable 
        trades={trades}
        onSelectTrade={setSelectedTradeId}
        selectedId={selectedTradeId}
      />
    </Layout>
  );
};

export default Logs;