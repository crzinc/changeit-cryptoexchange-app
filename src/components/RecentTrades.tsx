import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Clock } from 'lucide-react'

interface Trade {
  id: string
  price: number
  amount: number
  time: string
  type: 'buy' | 'sell'
}

const RecentTrades: React.FC = () => {
  const [trades, setTrades] = useState<Trade[]>([])

  useEffect(() => {
    // Generate mock trade data
    const generateTrades = () => {
      const newTrades: Trade[] = []
      const basePrice = 65430
      
      for (let i = 0; i < 15; i++) {
        const price = basePrice + (Math.random() - 0.5) * 200
        const amount = Math.random() * 2 + 0.01
        const type = Math.random() > 0.5 ? 'buy' : 'sell'
        const time = new Date(Date.now() - i * 30000).toLocaleTimeString()
        
        newTrades.push({
          id: `trade-${i}`,
          price,
          amount,
          time,
          type
        })
      }
      
      setTrades(newTrades)
    }

    generateTrades()
    const interval = setInterval(() => {
      // Add a new trade at the beginning
      const basePrice = 65430
      const price = basePrice + (Math.random() - 0.5) * 200
      const amount = Math.random() * 2 + 0.01
      const type = Math.random() > 0.5 ? 'buy' : 'sell'
      const time = new Date().toLocaleTimeString()
      
      const newTrade: Trade = {
        id: `trade-${Date.now()}`,
        price,
        amount,
        time,
        type
      }
      
      setTrades(prev => [newTrade, ...prev.slice(0, 14)])
    }, 2000)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-white/10 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white">Recent Trades</h3>
        <Clock className="w-5 h-5 text-white/60" />
      </div>
      
      <div className="space-y-4">
        {/* Header */}
        <div className="grid grid-cols-3 gap-4 text-white/60 text-sm font-medium">
          <div>Price (USDT)</div>
          <div className="text-right">Amount (BTC)</div>
          <div className="text-right">Time</div>
        </div>

        {/* Trades */}
        <div className="space-y-1 max-h-96 overflow-y-auto">
          {trades.map((trade, index) => (
            <motion.div
              key={trade.id}
              initial={{ opacity: 0, x: trade.type === 'buy' ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className={`grid grid-cols-3 gap-4 text-sm py-2 px-2 rounded hover:bg-white/5 transition-colors duration-200 ${
                index === 0 ? 'bg-white/5' : ''
              }`}
            >
              <div className={`font-medium ${
                trade.type === 'buy' ? 'text-green-400' : 'text-red-400'
              }`}>
                {trade.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className="text-white/80 text-right">
                {trade.amount.toFixed(4)}
              </div>
              <div className="text-white/60 text-right text-xs">
                {trade.time}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Summary */}
        <div className="pt-4 border-t border-white/10">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-white/60">24h Volume</div>
              <div className="text-white font-semibold">28,543.21 BTC</div>
            </div>
            <div>
              <div className="text-white/60">24h Trades</div>
              <div className="text-white font-semibold">1,234,567</div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default RecentTrades