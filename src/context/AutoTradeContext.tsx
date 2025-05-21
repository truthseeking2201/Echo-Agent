import React, { createContext, useContext, useState, useEffect } from 'react';

interface AutoTradeContextType {
  enabled: boolean;
  enable: () => Promise<void>;
  disable: () => void;
}

const AutoTradeContext = createContext<AutoTradeContextType>({
  enabled: false,
  enable: async () => {},
  disable: () => {},
});

export const useAutoTrade = () => useContext(AutoTradeContext);

interface AutoTradeProviderProps {
  children: React.ReactNode;
}

export const AutoTradeProvider: React.FC<AutoTradeProviderProps> = ({ children }) => {
  const [enabled, setEnabled] = useState(false);
  
  // Initialize state from localStorage on mount
  useEffect(() => {
    const storedState = localStorage.getItem('autoTradeEnabled');
    if (storedState === 'true') {
      setEnabled(true);
    }
  }, []);
  
  const enable = async () => {
    try {
      // Call API endpoint to enable auto-trade
      const response = await fetch('/api/autotrade/enable', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ enabled: true }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to enable auto-trade');
      }
      
      // Update local state and persist to localStorage
      setEnabled(true);
      localStorage.setItem('autoTradeEnabled', 'true');
    } catch (error) {
      console.error('Error enabling auto-trade:', error);
      // In demo mode, still enable it locally even if API call fails
      setEnabled(true);
      localStorage.setItem('autoTradeEnabled', 'true');
    }
  };
  
  const disable = () => {
    try {
      // Call API endpoint to disable auto-trade
      fetch('/api/autotrade/enable', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ enabled: false }),
      }).catch(error => {
        console.error('Error disabling auto-trade:', error);
      });
      
      // Update local state and persist to localStorage
      setEnabled(false);
      localStorage.setItem('autoTradeEnabled', 'false');
    } catch (error) {
      console.error('Error disabling auto-trade:', error);
      // In demo mode, still disable it locally even if API call fails
      setEnabled(false);
      localStorage.setItem('autoTradeEnabled', 'false');
    }
  };
  
  return (
    <AutoTradeContext.Provider value={{ enabled, enable, disable }}>
      {children}
    </AutoTradeContext.Provider>
  );
};

export default AutoTradeProvider;