import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, BarChart3 } from 'lucide-react'

const TradingChart: React.FC = () => {
  const [timeframe, setTimeframe] = useState('1D')
  const [chartData, setChartData] = useState<number[]>([])

  useEffect(() => {
    // Generate mock chart data
    const generateData = () => {
      const data = []
      let price = 65000 + Math.random() * 1000
      
      for (let i = 0; i < 50; i++) {
        price += (Math.random() - 0.5) * 500
        data.push(Math.max(price, 60000))
      }
      
      return data
    }

    setChartData(generateData())
  }, [timeframe])

  const timeframes = ['1H', '4H', '1D', '1W', '1M']
  const currentPrice = chartData[chartData.length - 1] || 65430
  const previousPrice = chartData[chartData.length - 2] || 65000
  const priceChange = currentPrice - previousPrice
  const priceChangePercent = (priceChange / previousPrice) * 100

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-white/10 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-white mb-2">BTC/USDT</h3>
          <div className="flex items-center">
            <span className="text-2xl font-bold text-white mr-3">
              ${currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <div className={`flex items-center ${priceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {priceChange >= 0 ? (
                <TrendingUp className="w-4 h-4 mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 mr-1" />
              )}
              <span className="text-sm font-medium">
                {priceChange >= 0 ? '+' : ''}{priceChangePercent.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-2">
          {timeframes.map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-200 ${
                timeframe === tf
                  ? 'bg-cyan-500 text-white'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Mock Chart */}
      <div className="relative h-64 bg-slate-700/30 rounded-xl p-4 overflow-hidden">
        <div className="absolute inset-0 flex items-end justify-between px-4 pb-4">
          {chartData.map((price, index) => {
            const height = ((price - 60000) / 10000) * 100
            const isUp = index === 0 || price >= chartData[index - 1]
            
            return (
              <motion.div
                key={index}
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ delay: index * 0.02, duration: 0.3 }}
                className={`w-1 rounded-t ${
                  isUp ? 'bg-green-400' : 'bg-red-400'
                } opacity-80`}
                style={{ minHeight: '2px' }}
              />
            )
          })}
        </div>
        
        {/* Grid Lines */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute left-0 right-0 border-t border-white/10"
              style={{ top: `${i * 25}%` }}
            />
          ))}
        </div>
        
        {/* Chart Icon Overlay */}
        <div className="absolute top-4 right-4 opacity-20">
          <BarChart3 className="w-8 h-8 text-white" />
        </div>
      </div>

      {/* Chart Stats */}
      <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/10">
        <div>
          <div className="text-white/60 text-sm">24h High</div>
          <div className="text-white font-semibold">${Math.max(...chartData).toLocaleString()}</div>
        </div>
        <div>
          <div className="text-white/60 text-sm">24h Low</div>
          <div className="text-white font-semibold">${Math.min(...chartData).toLocaleString()}</div>
        </div>
        <div>
          <div className="text-white/60 text-sm">Volume</div>
          <div className="text-white font-semibold">28.5B</div>
        </div>
        <div>
          <div className="text-white/60 text-sm">Market Cap</div>
          <div className="text-white font-semibold">1.28T</div>
        </div>
      </div>
    </motion.div>
  )
}

export default TradingChart