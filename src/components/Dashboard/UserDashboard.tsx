import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Wallet, TrendingUp, Clock, ArrowUpRight, ArrowDownLeft, RefreshCw } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { supabaseApi } from '../../services/supabaseApi'
import { useRealTimeRates } from '../../hooks/useRealTimeRates'
import type { Database } from '../../lib/supabase'

type Wallet = Database['public']['Tables']['wallets']['Row']
type Transaction = Database['public']['Tables']['transactions']['Row']

const UserDashboard: React.FC = () => {
  const { user } = useAuth()
  const { marketData, getRate } = useRealTimeRates()
  const [wallets, setWallets] = useState<Wallet[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    if (!user) return

    const fetchUserData = async () => {
      try {
        const [walletsData, transactionsData] = await Promise.all([
          supabaseApi.getUserWallets(user.id),
          supabaseApi.getUserTransactions(user.id, 10)
        ])
        
        setWallets(walletsData)
        setTransactions(transactionsData)
      } catch (error) {
        console.error('Failed to fetch user data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()

    // Subscribe to real-time updates
    const walletSubscription = supabaseApi.subscribeToUserWallets(user.id, setWallets)
    const transactionSubscription = supabaseApi.subscribeToUserTransactions(user.id, setTransactions)

    return () => {
      walletSubscription.unsubscribe()
      transactionSubscription.unsubscribe()
    }
  }, [user])

  const refreshData = async () => {
    if (!user) return
    
    setIsRefreshing(true)
    try {
      const [walletsData, transactionsData] = await Promise.all([
        supabaseApi.getUserWallets(user.id),
        supabaseApi.getUserTransactions(user.id, 10)
      ])
      
      setWallets(walletsData)
      setTransactions(transactionsData)
    } catch (error) {
      console.error('Failed to refresh data:', error)
    } finally {
      setIsRefreshing(false)
    }
  }

  const getMarketPrice = (currency: string): number => {
    const market = marketData.find(m => m.symbol === currency)
    return market?.price_usd || 0
  }

  const getMarketChange = (currency: string): number => {
    const market = marketData.find(m => m.symbol === currency)
    return market?.change_24h || 0
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full"
        />
      </div>
    )
  }

  const totalBalance = wallets.reduce((sum, wallet) => {
    const price = getMarketPrice(wallet.currency)
    return sum + (parseFloat(wallet.balance.toString()) * price)
  }, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-20">
      <div className="container mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-white/60">Manage your crypto portfolio</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={refreshData}
            disabled={isRefreshing}
            className="flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white hover:bg-white/20 transition-all duration-300 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </motion.button>
        </motion.div>

        {/* Portfolio Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid md:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl flex items-center justify-center">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              ${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-white/60 text-sm">Total Portfolio Value</div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-xl flex items-center justify-center">
                <ArrowUpRight className="w-6 h-6 text-white" />
              </div>
              <TrendingUp className="w-5 h-5 text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {wallets.length}
            </div>
            <div className="text-white/60 text-sm">Active Wallets</div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <TrendingUp className="w-5 h-5 text-purple-400" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {transactions.filter(t => t.status === 'completed').length}
            </div>
            <div className="text-white/60 text-sm">Completed Trades</div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-teal-500 rounded-xl flex items-center justify-center">
                <ArrowDownLeft className="w-6 h-6 text-white" />
              </div>
              <TrendingUp className="w-5 h-5 text-cyan-400" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {transactions.filter(t => t.status === 'pending').length}
            </div>
            <div className="text-white/60 text-sm">Pending Orders</div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Wallets */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-white/10 p-6"
          >
            <h2 className="text-xl font-semibold text-white mb-6">Your Wallets</h2>
            <div className="space-y-4">
              {wallets.map((wallet, index) => {
                const price = getMarketPrice(wallet.currency)
                const change = getMarketChange(wallet.currency)
                const value = parseFloat(wallet.balance.toString()) * price

                return (
                  <motion.div
                    key={wallet.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                    className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl hover:bg-slate-700/50 transition-colors duration-200"
                  >
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full flex items-center justify-center mr-3">
                        <span className="text-white font-bold text-sm">
                          {wallet.currency[0]}
                        </span>
                      </div>
                      <div>
                        <div className="text-white font-semibold">{wallet.currency}</div>
                        <div className="text-white/60 text-sm">
                          {parseFloat(wallet.balance.toString()).toFixed(6)} {wallet.currency}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-semibold">
                        ${value.toFixed(2)}
                      </div>
                      <div className={`text-sm ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {change >= 0 ? '+' : ''}{change.toFixed(2)}%
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>

          {/* Recent Transactions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-white/10 p-6"
          >
            <h2 className="text-xl font-semibold text-white mb-6">Recent Transactions</h2>
            <div className="space-y-4">
              {transactions.length > 0 ? (
                transactions.map((transaction, index) => (
                  <motion.div
                    key={transaction.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                    className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl"
                  >
                    <div className="flex items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                        transaction.type === 'exchange' 
                          ? 'bg-blue-500/20 text-blue-400' 
                          : 'bg-green-500/20 text-green-400'
                      }`}>
                        {transaction.type === 'exchange' ? (
                          <>
                            <ArrowUpRight className="w-5 h-5" />
                            <span className="mx-1 text-xs">
                              {transaction.from_amount ? parseFloat(transaction.from_amount.toString()).toFixed(6) : '0'}
                            </span>
                            <ArrowDownLeft className="w-5 h-5" />
                          </>
                        ) : <></>}
                      </div>
                      <div>
                        <div className="text-white font-semibold capitalize">
                          {transaction.type}
                        </div>
                        <div className="text-white/60 text-sm">
                          {transaction.from_currency && transaction.to_currency
                            ? `${transaction.from_currency} → ${transaction.to_currency}`
                            : new Date(transaction.created_at).toLocaleDateString()
                          }
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-semibold ${
                        transaction.status === 'completed' 
                          ? 'text-green-400' 
                          : transaction.status === 'pending'
                          ? 'text-yellow-400'
                          : 'text-red-400'
                      }`}>
                        {transaction.status}
                      </div>
                      {transaction.from_amount && (
                        <div className="text-white/60 text-sm">
                          {transaction.from_amount.toFixed(4)}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="text-white/40 mb-2">No transactions yet</div>
                  <div className="text-white/60 text-sm">Start trading to see your history</div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default UserDashboard