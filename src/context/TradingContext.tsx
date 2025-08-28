import React, { createContext, useContext, useState, useEffect } from 'react';

interface Portfolio {
  symbol: string;
  amount: number;
  value: number;
  change: number;
}

interface MarketData {
  symbol: string;
  price: string;
  change24h: number;
  volume: string;
  trend: 'up' | 'down' | 'sideways';
  signal: 'BUY' | 'SELL' | 'HOLD';
  signalStrength: number;
}

interface TechnicalIndicators {
  ma7: string;
  ma25: string;
  ma50: string;
  maTrend: string;
  rsi: number;
  macd: number;
  macdSignal: number;
  macdTrend: string;
}

interface Trade {
  id: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  entryPrice: string;
  exitPrice?: string;
  pnl?: number;
  status: 'OPEN' | 'CLOSED' | 'PENDING';
  timestamp: string;
}

interface TradingContextType {
  portfolio: Portfolio[];
  marketData: MarketData[];
  indicators: TechnicalIndicators;
  trades: Trade[];
  totalValue: number;
  dailyPnL: number;
}

const TradingContext = createContext<TradingContextType | undefined>(undefined);

export const TradingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [portfolio] = useState<Portfolio[]>([
    { symbol: 'BTC/USDT', amount: 0.25, value: 11200, change: 2.4 },
    { symbol: 'ETH/USDT', amount: 4.8, value: 8640, change: 1.8 },
    { symbol: 'BNB/USDT', amount: 12, value: 3600, change: -0.5 },
    { symbol: 'ADA/USDT', amount: 2400, value: 1200, change: 3.2 }
  ]);
  
  const [marketData, setMarketData] = useState<MarketData[]>([
    { 
      symbol: 'BTC/USDT', 
      price: '44,800.50', 
      change24h: 2.4, 
      volume: '2.1B',
      trend: 'up',
      signal: 'BUY',
      signalStrength: 85
    },
    { 
      symbol: 'ETH/USDT', 
      price: '1,800.25', 
      change24h: 1.8, 
      volume: '1.8B',
      trend: 'up',
      signal: 'HOLD',
      signalStrength: 60
    },
    { 
      symbol: 'BNB/USDT', 
      price: '300.15', 
      change24h: -0.5, 
      volume: '400M',
      trend: 'sideways',
      signal: 'HOLD',
      signalStrength: 45
    },
    { 
      symbol: 'ADA/USDT', 
      price: '0.50', 
      change24h: 3.2, 
      volume: '320M',
      trend: 'up',
      signal: 'BUY',
      signalStrength: 75
    },
    { 
      symbol: 'SOL/USDT', 
      price: '98.75', 
      change24h: -1.2, 
      volume: '850M',
      trend: 'down',
      signal: 'SELL',
      signalStrength: 70
    },
    { 
      symbol: 'XRP/USDT', 
      price: '0.62', 
      change24h: 0.8, 
      volume: '280M',
      trend: 'sideways',
      signal: 'HOLD',
      signalStrength: 35
    }
  ]);
  
  const [indicators] = useState<TechnicalIndicators>({
    ma7: '44,650.30',
    ma25: '44,200.80',
    ma50: '43,800.15',
    maTrend: 'Восходящий',
    rsi: 65,
    macd: 120.5,
    macdSignal: 118.2,
    macdTrend: 'Бычий'
  });
  
  const [trades] = useState<Trade[]>([
    {
      id: '1',
      symbol: 'BTC/USDT',
      type: 'BUY',
      entryPrice: '44,200.00',
      exitPrice: '44,800.50',
      pnl: 150.12,
      status: 'CLOSED',
      timestamp: '14:32:15'
    },
    {
      id: '2',
      symbol: 'ETH/USDT',
      type: 'BUY',
      entryPrice: '1,780.00',
      status: 'OPEN',
      timestamp: '13:45:22'
    },
    {
      id: '3',
      symbol: 'ADA/USDT',
      type: 'BUY',
      entryPrice: '0.485',
      status: 'OPEN',
      timestamp: '12:18:44'
    },
    {
      id: '4',
      symbol: 'SOL/USDT',
      type: 'SELL',
      entryPrice: '102.30',
      exitPrice: '98.75',
      pnl: -88.75,
      status: 'CLOSED',
      timestamp: '11:22:08'
    }
  ]);
  
  const totalValue = portfolio.reduce((sum, asset) => sum + asset.value, 0);
  const dailyPnL = 1.85;
  
  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMarketData(prevData => 
        prevData.map(coin => ({
          ...coin,
          price: (parseFloat(coin.price.replace(',', '')) + (Math.random() - 0.5) * 20).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','),
          change24h: +(coin.change24h + (Math.random() - 0.5) * 0.1).toFixed(2)
        }))
      );
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <TradingContext.Provider value={{
      portfolio,
      marketData,
      indicators,
      trades,
      totalValue,
      dailyPnL
    }}>
      {children}
    </TradingContext.Provider>
  );
};

export const useTradingContext = () => {
  const context = useContext(TradingContext);
  if (context === undefined) {
    throw new Error('useTradingContext must be used within a TradingProvider');
  }
  return context;
};