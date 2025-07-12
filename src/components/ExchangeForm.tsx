import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpDown, Search, TrendingUp, TrendingDown, ChevronDown } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { supabaseApi } from '../services/supabaseApi'
import { useRealTimeRates } from '../hooks/useRealTimeRates'
import type { Database } from '../lib/supabase'

type MarketData = Database['public']['Tables']['market_data']['Row']

const ExchangeForm = () => {
  const { isAuthenticated, user } = useAuth()
  const { marketData, getRate, isLoading: ratesLoading } = useRealTimeRates()
  const [fromCurrency, setFromCurrency] = useState<MarketData | null>(null)
  const [toCurrency, setToCurrency] = useState<MarketData | null>(null)
  const [fromAmount, setFromAmount] = useState('1.0')
  const [toAmount, setToAmount] = useState('0.00')
  const [showFromDropdown, setShowFromDropdown] = useState(false)
  const [showToDropdown, setShowToDropdown] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [exchangeRate, setExchangeRate] = useState(0)
  const [userWallets, setUserWallets] = useState<any[]>([])

  useEffect(() => {
    if (marketData.length > 0 && !fromCurrency && !toCurrency) {
      // Set default currencies
      const btc = marketData.find(d => d.symbol === 'BTC')
      const usdt = marketData.find(d => d.symbol === 'USDT')
      if (btc && usdt) {
        setFromCurrency(btc)
        setToCurrency(usdt)
      }
    }
  }, [marketData, fromCurrency, toCurrency])

  useEffect(() => {
    if (user) {
      const fetchUserWallets = async () => {
        try {
          const wallets = await supabaseApi.getUserWallets(user.id)
          setUserWallets(wallets)
        } catch (error) {
          console.error('Failed to fetch user wallets:', error)
        }
      }
      
      fetchUserWallets()
      
      // Subscribe to wallet updates
      const subscription = supabaseApi.subscribeToUserWallets(user.id, setUserWallets)
      return () => subscription.unsubscribe()
    }
  }, [user])

  useEffect(() => {
    if (!fromCurrency || !toCurrency) return

    const rate = getRate(fromCurrency.symbol, toCurrency.symbol)
    setExchangeRate(rate)
    
    const amount = parseFloat(fromAmount) || 0
    setToAmount((amount * rate).toFixed(8))
  }, [fromCurrency, toCurrency, fromAmount, getRate])

  const getUserBalance = (currency: string): number => {
    const wallet = userWallets.find(w => w.currency === currency)
    return wallet ? parseFloat(wallet.balance.toString()) : 0
  }

  const filteredCurrencies = marketData.filter(currency =>
    currency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    currency.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const swapCurrencies = () => {
    if (!fromCurrency || !toCurrency) return
    
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
    setFromAmount(toAmount)
  }

  const selectCurrency = (currency: MarketData, type: 'from' | 'to') => {
    if (type === 'from') {
      setFromCurrency(currency)
      setShowFromDropdown(false)
    } else {
      setToCurrency(currency)
      setShowToDropdown(false)
    }
    setSearchTerm('')
  }

  const handleExchange = async () => {
    if (!isAuthenticated || !user || !fromCurrency || !toCurrency) {
      alert('Please sign in to exchange cryptocurrencies')
      return
    }

    const amount = parseFloat(fromAmount)
    if (!amount || amount <= 0) {
      alert('Please enter a valid amount')
      return
    }

    const userBalance = getUserBalance(fromCurrency.symbol)
    if (amount > userBalance) {
      alert('Insufficient balance')
      return
    }

    setIsLoading(true)
    try {
      await supabaseApi.executeExchange(fromCurrency.symbol, toCurrency.symbol, amount)
      alert('Exchange completed successfully!')
      setFromAmount('1.0')
    } catch (error: any) {
      alert(error.message || 'Exchange failed')
    } finally {
      setIsLoading(false)
    }
  }

  const CurrencyDropdown = ({ currencies, onSelect, isOpen }: any) => (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="absolute top-full left-0 right-0 mt-2 bg-slate-800/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl z-50 overflow-hidden"
        >
          <div className="p-4 border-b border-white/10">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-4 h-4" />
              <input
                type="text"
                placeholder="Search currencies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-cyan-400 transition-colors duration-300"
              />
            </div>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {currencies.map((currency: MarketData, index: number) => (
              <motion.div
                key={currency.symbol}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.02 }}
                onClick={() => onSelect(currency)}
                className="p-4 hover:bg-white/5 cursor-pointer transition-colors duration-200 border-b border-white/5 last:border-b-0"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full mr-3 flex items-center justify-center">
                      <span className="text-white font-bold text-sm">{currency.symbol[0]}</span>
                    </div>
                    <div>
                      <div className="text-white font-semibold">{currency.symbol}</div>
                      <div className="text-white/60 text-sm">{currency.name}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-semibold">${currency.price.toLocaleString()}</div>
                    <div className={`text-sm flex items-center ${currency.change_24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {currency.change_24h >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                      {Math.abs(currency.change_24h).toFixed(2)}%
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  if (ratesLoading || !fromCurrency || !toCurrency) {
    return (
      <section id="exchange" className="py-20 bg-slate-900/50">
        <div className="container mx-auto px-6 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
        </div>
      </section>
    )
  }

  return (
    <section id="exchange" className="py-20 bg-slate-900/50">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            <span className="text-white">Exchange</span>{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Instantly
            </span>
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Trade 500+ cryptocurrencies with zero fees and real-time rates
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl border border-white/10 p-8 shadow-2xl">
            <div className="space-y-6">
              {/* From Section */}
              <div className="relative">
                <label className="block text-white/80 text-sm font-medium mb-3">From</label>
                <div className="bg-slate-700/50 rounded-2xl p-4 border border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="relative">
                      <button
                        onClick={() => setShowFromDropdown(!showFromDropdown)}
                        className="flex items-center bg-slate-600/50 hover:bg-slate-600/70 rounded-xl px-4 py-2 transition-colors duration-200"
                      >
                        <div className="w-6 h-6 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full mr-2 flex items-center justify-center">
                          <span className="text-white font-bold text-xs">{fromCurrency.symbol[0]}</span>
                        </div>
                        <span className="text-white font-semibold mr-2">{fromCurrency.symbol}</span>
                        <ChevronDown className="w-4 h-4 text-white/60" />
                      </button>
                      <CurrencyDropdown
                        currencies={filteredCurrencies}
                        onSelect={(currency: MarketData) => selectCurrency(currency, 'from')}
                        isOpen={showFromDropdown}
                      />
                    </div>
                    <div className="text-right">
                      <div className="text-white/60 text-sm">Price</div>
                      <div className="text-white font-semibold">${fromCurrency.price.toLocaleString()}</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white/60 text-sm">Available</span>
                    <span className="text-white/80 text-sm">
                      {getUserBalance(fromCurrency.symbol).toFixed(6)} {fromCurrency.symbol}
                    </span>
                  </div>
                  <input
                    type="number"
                    value={fromAmount}
                    onChange={(e) => setFromAmount(e.target.value)}
                    placeholder="0.00"
                    max={getUserBalance(fromCurrency.symbol)}
                    className="w-full bg-transparent text-3xl font-bold text-white outline-none placeholder-white/40"
                  />
                </div>
              </div>

              {/* Swap Button */}
              <div className="flex justify-center">
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 180 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={swapCurrencies}
                  className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center hover:from-cyan-400 hover:to-purple-400 transition-all duration-300 shadow-lg"
                >
                  <ArrowUpDown className="w-5 h-5 text-white" />
                </motion.button>
              </div>

              {/* To Section */}
              <div className="relative">
                <label className="block text-white/80 text-sm font-medium mb-3">To</label>
                <div className="bg-slate-700/50 rounded-2xl p-4 border border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="relative">
                      <button
                        onClick={() => setShowToDropdown(!showToDropdown)}
                        className="flex items-center bg-slate-600/50 hover:bg-slate-600/70 rounded-xl px-4 py-2 transition-colors duration-200"
                      >
                        <div className="w-6 h-6 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full mr-2 flex items-center justify-center">
                          <span className="text-white font-bold text-xs">{toCurrency.symbol[0]}</span>
                        </div>
                        <span className="text-white font-semibold mr-2">{toCurrency.symbol}</span>
                        <ChevronDown className="w-4 h-4 text-white/60" />
                      </button>
                      <CurrencyDropdown
                        currencies={filteredCurrencies}
                        onSelect={(currency: MarketData) => selectCurrency(currency, 'to')}
                        isOpen={showToDropdown}
                      />
                    </div>
                    <div className="text-right">
                      <div className="text-white/60 text-sm">Price</div>
                      <div className="text-white font-semibold">${toCurrency.price.toLocaleString()}</div>
                    </div>
                  </div>
                  <input
                    type="number"
                    value={toAmount}
                    readOnly
                    placeholder="0.00"
                    className="w-full bg-transparent text-3xl font-bold text-white outline-none placeholder-white/40"
                  />
                </div>
              </div>

              {/* Exchange Info */}
              <div className="bg-slate-700/30 rounded-2xl p-4 border border-white/5">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white/60 text-sm">Rate</span>
                  <span className="text-white font-semibold">
                    1 {fromCurrency.symbol} = {exchangeRate.toFixed(8)} {toCurrency.symbol}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white/60 text-sm">Network Fee</span>
                  <span className="text-white/60 font-semibold">0.1%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/60 text-sm">Processing Time</span>
                  <span className="text-white font-semibold">Instant</span>
                </div>
              </div>

              {/* Exchange Button */}
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: "0 20px 40px rgba(6, 182, 212, 0.4)" }}
                whileTap={{ scale: 0.98 }}
                onClick={handleExchange}
                disabled={isLoading || !isAuthenticated}
                className="w-full py-4 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl text-white font-semibold text-lg hover:from-cyan-400 hover:to-purple-400 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Processing...' : isAuthenticated ? 'Exchange Now' : 'Sign In to Exchange'}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default ExchangeForm