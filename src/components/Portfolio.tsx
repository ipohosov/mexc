import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Percent } from 'lucide-react';
import { useTradingContext } from '../context/TradingContext';

export const Portfolio: React.FC = () => {
  const { portfolio, totalValue, dailyPnL } = useTradingContext();
  
  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
      <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
        <DollarSign className="h-5 w-5 mr-2 text-emerald-400" />
        Портфель
      </h2>
      
      <div className="space-y-4">
        {/* Total Value */}
        <div className="bg-slate-900 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Общая стоимость</span>
            <span className="text-2xl font-bold text-white">
              ${totalValue.toLocaleString()}
            </span>
          </div>
          
          <div className="flex items-center mt-2">
            {dailyPnL >= 0 ? (
              <TrendingUp className="h-4 w-4 text-emerald-400 mr-1" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-400 mr-1" />
            )}
            <span className={`text-sm ${dailyPnL >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {dailyPnL >= 0 ? '+' : ''}{dailyPnL.toFixed(2)}% (24h)
            </span>
          </div>
        </div>
        
        {/* Holdings */}
        <div>
          <h3 className="text-white font-medium mb-3">Активы</h3>
          <div className="space-y-2">
            {portfolio.map((asset) => (
              <div key={asset.symbol} className="flex items-center justify-between p-3 bg-slate-900 rounded-lg">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center mr-3">
                    <span className="text-xs font-bold text-white">{asset.symbol.slice(0, 2)}</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">{asset.symbol}</p>
                    <p className="text-slate-400 text-sm">{asset.amount} coins</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-white font-medium">${asset.value.toLocaleString()}</p>
                  <div className="flex items-center">
                    <Percent className="h-3 w-3 mr-1 text-emerald-400" />
                    <span className="text-emerald-400 text-sm">+{asset.change}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};