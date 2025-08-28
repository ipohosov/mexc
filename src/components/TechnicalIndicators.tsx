import React from 'react';
import { BarChart3, TrendingUp, Activity } from 'lucide-react';
import { useTradingContext } from '../context/TradingContext';

export const TechnicalIndicators: React.FC = () => {
  const { indicators } = useTradingContext();
  
  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
      <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
        <BarChart3 className="h-5 w-5 mr-2 text-purple-400" />
        Технические индикаторы
      </h2>
      
      <div className="space-y-6">
        {/* Moving Averages */}
        <div className="bg-slate-900 p-4 rounded-lg">
          <h3 className="text-white font-medium mb-3 flex items-center">
            <TrendingUp className="h-4 w-4 mr-2 text-blue-400" />
            Скользящие средние (MA)
          </h3>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-slate-400 text-sm">MA 7</p>
              <p className="text-blue-400 font-mono">${indicators.ma7}</p>
            </div>
            <div className="text-center">
              <p className="text-slate-400 text-sm">MA 25</p>
              <p className="text-blue-400 font-mono">${indicators.ma25}</p>
            </div>
            <div className="text-center">
              <p className="text-slate-400 text-sm">MA 50</p>
              <p className="text-blue-400 font-mono">${indicators.ma50}</p>
            </div>
          </div>
          
          <div className="mt-3 p-2 bg-slate-800 rounded">
            <div className="flex justify-between items-center">
              <span className="text-slate-400 text-sm">Тренд:</span>
              <span className={`font-medium ${
                indicators.maTrend === 'Восходящий' ? 'text-emerald-400' :
                indicators.maTrend === 'Нисходящий' ? 'text-red-400' : 'text-slate-400'
              }`}>
                {indicators.maTrend}
              </span>
            </div>
          </div>
        </div>
        
        {/* RSI */}
        <div className="bg-slate-900 p-4 rounded-lg">
          <h3 className="text-white font-medium mb-3 flex items-center">
            <Activity className="h-4 w-4 mr-2 text-yellow-400" />
            RSI (Индекс относительной силы)
          </h3>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Значение RSI:</span>
              <span className={`font-mono font-bold ${
                indicators.rsi > 70 ? 'text-red-400' :
                indicators.rsi < 30 ? 'text-emerald-400' : 'text-white'
              }`}>
                {indicators.rsi}
              </span>
            </div>
            
            <div className="w-full bg-slate-700 rounded-full h-3 relative">
              <div 
                className="h-3 rounded-full transition-all duration-500 bg-gradient-to-r from-emerald-500 via-yellow-500 to-red-500"
                style={{ width: `${indicators.rsi}%` }}
              />
              <div className="absolute inset-0 flex justify-between text-xs text-slate-400 px-1 items-center">
                <span>30</span>
                <span>70</span>
              </div>
            </div>
            
            <div className="text-center">
              <span className={`text-sm font-medium px-2 py-1 rounded ${
                indicators.rsi > 70 ? 'bg-red-500/20 text-red-400' :
                indicators.rsi < 30 ? 'bg-emerald-500/20 text-emerald-400' : 
                'bg-slate-700 text-slate-400'
              }`}>
                {indicators.rsi > 70 ? 'Перекупленность' :
                 indicators.rsi < 30 ? 'Перепроданность' : 'Нейтрально'}
              </span>
            </div>
          </div>
        </div>
        
        {/* MACD */}
        <div className="bg-slate-900 p-4 rounded-lg">
          <h3 className="text-white font-medium mb-3 flex items-center">
            <BarChart3 className="h-4 w-4 mr-2 text-purple-400" />
            MACD
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-slate-400 text-sm">MACD Line:</p>
              <p className={`font-mono ${indicators.macd > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {indicators.macd > 0 ? '+' : ''}{indicators.macd}
              </p>
            </div>
            <div>
              <p className="text-slate-400 text-sm">Signal Line:</p>
              <p className={`font-mono ${indicators.macdSignal > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {indicators.macdSignal > 0 ? '+' : ''}{indicators.macdSignal}
              </p>
            </div>
          </div>
          
          <div className="mt-3 p-2 bg-slate-800 rounded">
            <div className="flex justify-between items-center">
              <span className="text-slate-400 text-sm">Сигнал:</span>
              <span className={`font-medium ${
                indicators.macdTrend === 'Бычий' ? 'text-emerald-400' :
                indicators.macdTrend === 'Медвежий' ? 'text-red-400' : 'text-slate-400'
              }`}>
                {indicators.macdTrend}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};