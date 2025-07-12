import React from 'react'
import { motion } from 'framer-motion'
import ExchangeForm from '../components/ExchangeForm'
import TradingChart from '../components/TradingChart'
import OrderBook from '../components/OrderBook'
import RecentTrades from '../components/RecentTrades'

const ExchangePage: React.FC = () => {
  return (
    <div className="pt-20 min-h-screen">
      <div className="container mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Exchange
            </span>
          </h1>
          <p className="text-white/70 text-lg">Trade cryptocurrencies with zero fees and real-time execution</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Exchange Form */}
          <div className="lg:col-span-2">
            <ExchangeForm />
            <div className="mt-8">
              <TradingChart />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <OrderBook />
            <RecentTrades />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExchangePage