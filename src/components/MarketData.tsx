import React from 'react';
import { Activity, TrendingUp } from 'lucide-react';
import { useTradingContext } from '../context/TradingContext';

export const MarketData: React.FC = () => {
  const { marketData } = useTradingContext();
  
  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
      <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
        <Activity className="h-5 w-5 mr-2 text-blue-400" />
        Рыночные данные
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {marketData.map((coin) => (
          <div key={coin.symbol} className="bg-slate-900 p-4 rounded-lg border border-slate-600 hover:border-blue-500 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mr-2">
                  <span className="text-xs font-bold text-white">{coin.symbol.slice(0, 2)}</span>
                </div>
                <span className="text-white font-medium">{coin.symbol}</span>
              </div>
              <div className={`px-2 py-1 rounded text-xs font-medium ${
                coin.trend === 'up' ? 'bg-emerald-500/20 text-emerald-400' : 
                coin.trend === 'down' ? 'bg-red-500/20 text-red-400' :
                'bg-slate-500/20 text-slate-400'
              }`}>
                {coin.trend === 'up' ? '↗ UP' : coin.trend === 'down' ? '↘ DOWN' : '→ FLAT'}
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400 text-sm">Цена:</span>
                <span className="text-white font-mono">${coin.price}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-slate-400 text-sm">24h:</span>
                <span className={`font-mono ${coin.change24h >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {coin.change24h >= 0 ? '+' : ''}{coin.change24h}%
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-slate-400 text-sm">Объем:</span>
                <span className="text-slate-300 font-mono text-sm">${coin.volume}</span>
              </div>
              
              <div className="mt-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">MA Сигнал</span>
                  <span className={coin.signal === 'BUY' ? 'text-emerald-400' : coin.signal === 'SELL' ? 'text-red-400' : 'text-slate-400'}>
                    {coin.signal}
                  </span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      coin.signal === 'BUY' ? 'bg-emerald-500' : 
                      coin.signal === 'SELL' ? 'bg-red-500' : 'bg-slate-500'
                    }`}
                    style={{ width: `${coin.signalStrength}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};