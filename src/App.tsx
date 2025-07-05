import React, { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Header';
import Hero from './components/Hero';
import ExchangeForm from './components/ExchangeForm';
import Features from './components/Features';
import Footer from './components/Footer';
import ParticleBackground from './components/ParticleBackground';
import UserDashboard from './components/Dashboard/UserDashboard';
import { useWebSocket } from './hooks/useWebSocket';

const AppContent = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [marketData, setMarketData] = useState([]);
  
  // WebSocket connection for real-time updates
  const { isConnected, lastMessage } = useWebSocket('ws://localhost:3001');

  useEffect(() => {
    if (lastMessage && lastMessage.type === 'MARKET_UPDATE') {
      setMarketData(lastMessage.data);
    }
  }, [lastMessage]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/60">Loading...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-x-hidden">
        <ParticleBackground />
        <div className="relative z-10">
          <Header />
          <UserDashboard />
        </div>
        {/* WebSocket Status Indicator */}
        <div className={`fixed bottom-4 right-4 px-3 py-1 rounded-full text-xs font-medium ${
          isConnected ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
        }`}>
          {isConnected ? 'Live' : 'Disconnected'}
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-x-hidden">
      <ParticleBackground />
      <div className="relative z-10">
        <Header />
        <Hero />
        <ExchangeForm />
        <Features />
        <Footer />
      </div>
      {/* WebSocket Status Indicator */}
      <div className={`fixed bottom-4 right-4 px-3 py-1 rounded-full text-xs font-medium ${
        isConnected ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
      }`}>
        {isConnected ? 'Live' : 'Disconnected'}
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;