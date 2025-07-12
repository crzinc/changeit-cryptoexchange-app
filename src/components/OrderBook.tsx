import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface OrderBookEntry {
  price: number
  amount: number
  total: number
}

const OrderBook: React.FC = () => {
  const [bids, setBids] = useState<OrderBookEntry[]>([])
  const [asks, setAsks] = useState<OrderBookEntry[]>([])

  useEffect(() => {
    // Generate mock order book data
    const generateOrderBook = () => {
      const basePrice = 65430
      const newBids: OrderBookEntry[] = []
      const newAsks: OrderBookEntry[] = []
      
      let total = 0
      for (let i = 0; i < 10; i++) {
        const price = basePrice - (i + 1) * 10
        const amount = Math.random() * 5 + 0.1
        total += amount
        newBids.push({ price, amount, total })
      }
      
      total = 0
      for (let i = 0; i < 10; i++) {
        const price = basePrice + (i + 1) * 10
        const amount = Math.random() * 5 + 0.1
        total += amount
        newAsks.push({ price, amount, total })
      }
      
      setBids(newBids)
      setAsks(newAsks)
    }

    generateOrderBook()
    const interval = setInterval(generateOrderBook, 3000)
    
    return () => clearInterval(interval)
  }, [])

  const maxTotal = Math.max(
    ...bids.map(b => b.total),
    ...asks.map(a => a.total)
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-white/10 p-6"
    >
      <h3 className="text-xl font-semibold text-white mb-6">Order Book</h3>
      
      <div className="space-y-4">
        {/* Header */}
        <div className="grid grid-cols-3 gap-4 text-white/60 text-sm font-medium">
          <div>Price (USDT)</div>
          <div className="text-right">Amount (BTC)</div>
          <div className="text-right">Total</div>
        </div>

        {/* Asks (Sell Orders) */}
        <div className="space-y-1">
          {asks.slice().reverse().map((ask, index) => (
            <motion.div
              key={`ask-${index}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.02 }}
              className="relative grid grid-cols-3 gap-4 text-sm py-1 hover:bg-red-500/10 transition-colors duration-200"
            >
              <div
                className="absolute inset-0 bg-red-500/10 rounded"
                style={{ width: `${(ask.total / maxTotal) * 100}%` }}
              />
              <div className="relative text-red-400 font-medium">
                {ask.price.toLocaleString()}
              </div>
              <div className="relative text-white/80 text-right">
                {ask.amount.toFixed(4)}
              </div>
              <div className="relative text-white/60 text-right">
                {ask.total.toFixed(4)}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Spread */}
        <div className="flex items-center justify-center py-3 border-y border-white/10">
          <div className="flex items-center text-white/80">
            <TrendingUp className="w-4 h-4 text-green-400 mr-2" />
            <span className="text-sm">Spread: $20.50</span>
            <TrendingDown className="w-4 h-4 text-red-400 ml-2" />
          </div>
        </div>

        {/* Bids (Buy Orders) */}
        <div className="space-y-1">
          {bids.map((bid, index) => (
            <motion.div
              key={`bid-${index}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.02 }}
              className="relative grid grid-cols-3 gap-4 text-sm py-1 hover:bg-green-500/10 transition-colors duration-200"
            >
              <div
                className="absolute inset-0 bg-green-500/10 rounded"
                style={{ width: `${(bid.total / maxTotal) * 100}%` }}
              />
              <div className="relative text-green-400 font-medium">
                {bid.price.toLocaleString()}
              </div>
              <div className="relative text-white/80 text-right">
                {bid.amount.toFixed(4)}
              </div>
              <div className="relative text-white/60 text-right">
                {bid.total.toFixed(4)}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default OrderBook