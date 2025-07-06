import React, { useEffect, useState } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import Header from './components/Header'
import Hero from './components/Hero'
import ExchangeForm from './components/ExchangeForm'
import Features from './components/Features'
import Footer from './components/Footer'
import ParticleBackground from './components/ParticleBackground'
import UserDashboard from './components/Dashboard/UserDashboard'
import { supabaseApi } from './services/supabaseApi'

const AppContent = () => {
  const { isAuthenticated, isLoading } = useAuth()
  const [marketData, setMarketData] = useState([])

  useEffect(() => {
    // Subscribe to real-time market data updates
    const subscription = supabaseApi.subscribeToMarketData(setMarketData)
    return () => subscription.unsubscribe()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/60">Loading...</p>
        </div>
      </div>
    )
  }

  if (isAuthenticated) {
    return (
      <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-x-hidden">
        <ParticleBackground />
        <div className="relative z-10">
          <Header />
          <UserDashboard />
        </div>
      </div>
    )
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
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App