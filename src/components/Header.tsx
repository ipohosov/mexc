import React from 'react';
import { TrendingUp, Bot, Settings } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-slate-800 border-b border-slate-700 shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-500 rounded-lg">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">MEXC Trading Bot</h1>
              <p className="text-slate-400 text-sm">Trend Following Strategy</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-emerald-500/10 px-3 py-2 rounded-lg">
              <TrendingUp className="h-4 w-4 text-emerald-400" />
              <span className="text-emerald-400 font-medium text-sm">Bot Active</span>
            </div>
            
            <button className="p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-700">
              <Settings className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};