import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, TrendingUp, TrendingDown, Star } from 'lucide-react'
import { supabaseApi } from '../services/supabaseApi'
import type { Database } from '../lib/supabase'

type MarketData = Database['public']['Tables']['market_data']['Row']

const MarketsPage: React.FC = () => {
  const [marketData, setMarketData] = useState<MarketData[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'market_cap' | 'price' | 'change_24h' | 'volume_24h'>('market_cap')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [favorites, setFavorites] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const data = await supabaseApi.getMarketData()
        setMarketData(data)
      } catch (error) {
        console.error('Failed to fetch market data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMarketData()

    // Subscribe to real-time updates
    const subscription = supabaseApi.subscribeToMarketData(setMarketData)
    return () => subscription.unsubscribe()
  }, [])

  const filteredAndSortedData = marketData
    .filter(coin => 
      coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const aValue = a[sortBy] || 0
      const bValue = b[sortBy] || 0
      return sortOrder === 'desc' ? bValue - aValue : aValue - bValue
    })

  const toggleFavorite = (symbol: string) => {
    setFavorites(prev => 
      prev.includes(symbol) 
        ? prev.filter(s => s !== symbol)
        : [...prev, symbol]
    )
  }

  const handleSort = (column: typeof sortBy) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')
    } else {
      setSortBy(column)
      setSortOrder('desc')
    }
  }

  if (isLoading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

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
              Markets
            </span>
          </h1>
          <p className="text-white/70 text-lg">Real-time cryptocurrency market data and prices</p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-white/10 p-6"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-5 h-5" />
              <input
                type="text"
                placeholder="Search cryptocurrencies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-cyan-400 transition-colors duration-300"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleSort('market_cap')}
                className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                  sortBy === 'market_cap' 
                    ? 'bg-cyan-500 text-white' 
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                Market Cap
              </button>
              <button
                onClick={() => handleSort('price')}
                className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                  sortBy === 'price' 
                    ? 'bg-cyan-500 text-white' 
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                Price
              </button>
              <button
                onClick={() => handleSort('change_24h')}
                className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                  sortBy === 'change_24h' 
                    ? 'bg-cyan-500 text-white' 
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                24h Change
              </button>
            </div>
          </div>
        </motion.div>

        {/* Market Data Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-700/50 border-b border-white/10">
                <tr>
                  <th className="text-left p-4 text-white/80 font-semibold">Coin</th>
                  <th className="text-right p-4 text-white/80 font-semibold">Price</th>
                  <th className="text-right p-4 text-white/80 font-semibold">24h Change</th>
                  <th className="text-right p-4 text-white/80 font-semibold">24h Volume</th>
                  <th className="text-right p-4 text-white/80 font-semibold">Market Cap</th>
                  <th className="text-center p-4 text-white/80 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedData.map((coin, index) => (
                  <motion.tr
                    key={coin.symbol}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.02 }}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors duration-200"
                  >
                    <td className="p-4">
                      <div className="flex items-center">
                        <button
                          onClick={() => toggleFavorite(coin.symbol)}
                          className="mr-3 text-white/40 hover:text-yellow-400 transition-colors duration-200"
                        >
                          <Star 
                            className={`w-4 h-4 ${
                              favorites.includes(coin.symbol) ? 'fill-yellow-400 text-yellow-400' : ''
                            }`} 
                          />
                        </button>
                        <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full mr-3 flex items-center justify-center">
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
                        ${coin.volume_24h.toLocaleString(undefined, { notation: 'compact', maximumFractionDigits: 2 })}
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
                    <td className="p-4 text-center">
                      <button className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg text-white text-sm font-semibold hover:from-cyan-400 hover:to-purple-400 transition-all duration-300">
                        Trade
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default MarketsPage