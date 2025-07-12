import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { supabaseApi } from '../services/supabaseApi'
import type { Database } from '../lib/supabase'

type MarketData = Database['public']['Tables']['market_data']['Row']

const MarketOverview: React.FC = () => {
  const [marketData, setMarketData] = useState<MarketData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const data = await supabaseApi.getMarketData()
        setMarketData(data.slice(0, 8)) // Show top 8 coins
      } catch (error) {
        console.error('Failed to fetch market data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMarketData()

    // Subscribe to real-time updates
    const subscription = supabaseApi.subscribeToMarketData((data) => {
      setMarketData(data.slice(0, 8))
    })
    
    return () => subscription.unsubscribe()
  }, [])

  if (isLoading) {
    return (
      <section className="py-20 bg-slate-900/30">
        <div className="container mx-auto px-6 text-center">
          <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-slate-900/30">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            <span className="text-white">Live</span>{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Market
            </span>
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Real-time cryptocurrency prices and market data
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-700/50 border-b border-white/10">
                <tr>
                  <th className="text-left p-4 text-white/80 font-semibold">Coin</th>
                  <th className="text-right p-4 text-white/80 font-semibold">Price</th>
                  <th className="text-right p-4 text-white/80 font-semibold">24h Change</th>
                  <th className="text-right p-4 text-white/80 font-semibold">Market Cap</th>
                </tr>
              </thead>
              <tbody>
                {marketData.map((coin, index) => (
                  <motion.tr
                    key={coin.symbol}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors duration-200"
                  >
                    <td className="p-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full mr-3 flex items-center justify-center">
                          <span className="text-white font-bold text-sm">{coin.symbol[0]}</span>
                        </div>
                        <div>
                          <div className="text-white font-semibold">{coin.symbol}</div>
                          <div className="text-white/60 text-sm">{coin.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="text-white font-semibold">
                        ${coin.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className={`flex items-center justify-end ${
                        coin.change_24h >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {coin.change_24h >= 0 ? (
                          <TrendingUp className="w-4 h-4 mr-1" />
                        ) : (
                          <TrendingDown className="w-4 h-4 mr-1" />
                        )}
                        {Math.abs(coin.change_24h).toFixed(2)}%
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="text-white/80">
                        {coin.market_cap ? 
                          `$${coin.market_cap.toLocaleString(undefined, { notation: 'compact', maximumFractionDigits: 2 })}` 
                          : 'N/A'
                        }
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default MarketOverview