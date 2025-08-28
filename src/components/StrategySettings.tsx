import React, { useState } from 'react';
import { Settings, Shield, Target, AlertTriangle } from 'lucide-react';

export const StrategySettings: React.FC = () => {
  const [stopLoss, setStopLoss] = useState(5);
  const [takeProfit, setTakeProfit] = useState(10);
  const [riskPerTrade, setRiskPerTrade] = useState(2);
  const [minRsi, setMinRsi] = useState(30);
  const [maxRsi, setMaxRsi] = useState(70);
  
  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
      <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
        <Settings className="h-5 w-5 mr-2 text-slate-400" />
        Настройки стратегии
      </h2>
      
      <div className="space-y-6">
        {/* Risk Management */}
        <div>
          <h3 className="text-white font-medium mb-3 flex items-center">
            <Shield className="h-4 w-4 mr-2 text-emerald-400" />
            Управление рисками
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-slate-400 text-sm mb-2">
                Stop-Loss (%)
              </label>
              <input
                type="range"
                min="1"
                max="20"
                value={stopLoss}
                onChange={(e) => setStopLoss(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>1%</span>
                <span className="text-white font-medium">{stopLoss}%</span>
                <span>20%</span>
              </div>
            </div>
            
            <div>
              <label className="block text-slate-400 text-sm mb-2">
                Take-Profit (%)
              </label>
              <input
                type="range"
                min="5"
                max="50"
                value={takeProfit}
                onChange={(e) => setTakeProfit(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>5%</span>
                <span className="text-white font-medium">{takeProfit}%</span>
                <span>50%</span>
              </div>
            </div>
            
            <div>
              <label className="block text-slate-400 text-sm mb-2">
                Риск на сделку (%)
              </label>
              <input
                type="range"
                min="0.5"
                max="10"
                step="0.5"
                value={riskPerTrade}
                onChange={(e) => setRiskPerTrade(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>0.5%</span>
                <span className="text-white font-medium">{riskPerTrade}%</span>
                <span>10%</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Technical Settings */}
        <div>
          <h3 className="text-white font-medium mb-3 flex items-center">
            <Target className="h-4 w-4 mr-2 text-purple-400" />
            Параметры индикаторов
          </h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 text-sm mb-2">RSI Min</label>
                <input
                  type="number"
                  value={minRsi}
                  onChange={(e) => setMinRsi(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white font-mono focus:border-purple-500 focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-2">RSI Max</label>
                <input
                  type="number"
                  value={maxRsi}
                  onChange={(e) => setMaxRsi(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white font-mono focus:border-purple-500 focus:outline-none transition-colors"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Strategy Status */}
        <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-lg">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-emerald-500 rounded-full mr-3 animate-pulse" />
            <span className="text-emerald-400 font-medium">Стратегия активна</span>
          </div>
          <p className="text-emerald-400/80 text-sm mt-2">
            Бот мониторит рынок и ищет трендовые сигналы
          </p>
        </div>
        
        {/* Warning */}
        <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-lg">
          <div className="flex items-start">
            <AlertTriangle className="h-4 w-4 text-amber-400 mr-2 mt-0.5" />
            <div>
              <p className="text-amber-400 text-sm font-medium">Внимание</p>
              <p className="text-amber-400/80 text-xs mt-1">
                Торговля криптовалютами связана с высокими рисками. Не инвестируйте больше, чем можете позволить себе потерять.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};