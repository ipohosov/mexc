import React from 'react';
import { Portfolio } from './Portfolio';
import { TechnicalIndicators } from './TechnicalIndicators';
import { TradeHistory } from './TradeHistory';
import { StrategySettings } from './StrategySettings';
import { MarketData } from './MarketData';

export const TradingDashboard: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Portfolio Overview */}
      <div className="lg:col-span-4">
        <Portfolio />
      </div>
      
      {/* Market Data */}
      <div className="lg:col-span-8">
        <MarketData />
      </div>
      
      {/* Technical Indicators */}
      <div className="lg:col-span-6">
        <TechnicalIndicators />
      </div>
      
      {/* Strategy Settings */}
      <div className="lg:col-span-6">
        <StrategySettings />
      </div>
      
      {/* Trade History */}
      <div className="lg:col-span-12">
        <TradeHistory />
      </div>
    </div>
  );
};