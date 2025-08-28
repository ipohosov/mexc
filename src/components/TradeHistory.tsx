import React from 'react';
import { History, TrendingUp, TrendingDown, Clock } from 'lucide-react';
import { useTradingContext } from '../context/TradingContext';

export const TradeHistory: React.FC = () => {
  const { trades } = useTradingContext();
  
  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
      <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
        <History className="h-5 w-5 mr-2 text-indigo-400" />
        История сделок
      </h2>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left text-slate-400 text-sm font-medium py-2">Время</th>
              <th className="text-left text-slate-400 text-sm font-medium py-2">Пара</th>
              <th className="text-left text-slate-400 text-sm font-medium py-2">Тип</th>
              <th className="text-right text-slate-400 text-sm font-medium py-2">Цена входа</th>
              <th className="text-right text-slate-400 text-sm font-medium py-2">Цена выхода</th>
              <th className="text-right text-slate-400 text-sm font-medium py-2">P&L</th>
              <th className="text-right text-slate-400 text-sm font-medium py-2">Статус</th>
            </tr>
          </thead>
          <tbody>
            {trades.map((trade) => (
              <tr key={trade.id} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                <td className="py-3">
                  <div className="flex items-center text-slate-300 text-sm">
                    <Clock className="h-3 w-3 mr-1 text-slate-500" />
                    {trade.timestamp}
                  </div>
                </td>
                <td className="py-3">
                  <div className="flex items-center">
                    <div className="w-6 h-6 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center mr-2">
                      <span className="text-xs font-bold text-white">{trade.symbol.slice(0, 1)}</span>
                    </div>
                    <span className="text-white font-medium">{trade.symbol}</span>
                  </div>
                </td>
                <td className="py-3">
                  <div className={`flex items-center text-sm font-medium ${
                    trade.type === 'BUY' ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {trade.type === 'BUY' ? (
                      <TrendingUp className="h-3 w-3 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 mr-1" />
                    )}
                    {trade.type}
                  </div>
                </td>
                <td className="py-3 text-right text-white font-mono">${trade.entryPrice}</td>
                <td className="py-3 text-right text-white font-mono">
                  {trade.exitPrice ? `$${trade.exitPrice}` : '-'}
                </td>
                <td className="py-3 text-right">
                  {trade.pnl !== null ? (
                    <span className={`font-mono font-bold ${trade.pnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {trade.pnl >= 0 ? '+' : ''}${trade.pnl}
                    </span>
                  ) : (
                    <span className="text-slate-500">-</span>
                  )}
                </td>
                <td className="py-3 text-right">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    trade.status === 'OPEN' ? 'bg-blue-500/20 text-blue-400' :
                    trade.status === 'CLOSED' ? 'bg-slate-500/20 text-slate-400' :
                    'bg-emerald-500/20 text-emerald-400'
                  }`}>
                    {trade.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {trades.length === 0 && (
          <div className="text-center py-8 text-slate-500">
            <History className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Сделки не найдены</p>
            <p className="text-sm">Бот начнет торговлю при появлении сигналов</p>
          </div>
        )}
      </div>
    </div>
  );
};