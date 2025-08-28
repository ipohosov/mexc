import React, { useState, useEffect } from 'react';
import { TradingDashboard } from './components/TradingDashboard';
import { Header } from './components/Header';
import { TradingProvider } from './context/TradingContext';

function App() {
  return (
    <TradingProvider>
      <div className="min-h-screen bg-slate-900">
        <Header />
        <main className="container mx-auto px-4 py-6">
          <TradingDashboard />
        </main>
      </div>
    </TradingProvider>
  );
}

export default App;