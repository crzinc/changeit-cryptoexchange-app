import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, ArrowDownLeft, Clock, CheckCircle, XCircle, Filter, Download } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { supabaseApi } from '../services/supabaseApi'
import type { Database } from '../lib/supabase'

type Transaction = Database['public']['Tables']['transactions']['Row']

const TransactionsPage: React.FC = () => {
  const { user } = useAuth()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'exchange' | 'deposit' | 'withdrawal'>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed' | 'failed'>('all')

  useEffect(() => {
    if (!user) return

    const fetchTransactions = async () => {
      try {
        const data = await supabaseApi.getUserTransactions(user.id, 100)
        setTransactions(data)
        setFilteredTransactions(data)
      } catch (error) {
        console.error('Failed to fetch transactions:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTransactions()
  }, [user])

  useEffect(() => {
    let filtered = transactions

    if (filter !== 'all') {
      filtered = filtered.filter(tx => tx.type === filter)
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(tx => tx.status === statusFilter)
    }

    setFilteredTransactions(filtered)
  }, [transactions, filter, statusFilter])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-400" />
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-400" />
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-400" />
      default:
        return <Clock className="w-5 h-5 text-gray-400" />
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'exchange':
        return <ArrowUpRight className="w-5 h-5 text-blue-400" />
      case 'deposit':
        return <ArrowDownLeft className="w-5 h-5 text-green-400" />
      case 'withdrawal':
        return <ArrowUpRight className="w-5 h-5 text-red-400" />
      default:
        return <ArrowUpRight className="w-5 h-5 text-gray-400" />
    }
  }

  const exportTransactions = () => {
    const csvContent = [
      ['Date', 'Type', 'From', 'To', 'Amount', 'Rate', 'Status'].join(','),
      ...filteredTransactions.map(tx => [
        new Date(tx.created_at).toLocaleDateString(),
        tx.type,
        tx.from_currency || '',
        tx.to_currency || '',
        tx.from_amount || '',
        tx.rate || '',
        tx.status
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'transactions.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (!user) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-white">Please sign in to view your transactions</div>
      </div>
    )
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
              Transactions
            </span>
          </h1>
          <p className="text-white/70 text-lg">View and manage your transaction history</p>
        </motion.div>

        {/* Filters and Export */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-white/10 p-6"
        >
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-white/60" />
                <span className="text-white/80 text-sm">Type:</span>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as any)}
                  className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-400"
                >
                  <option value="all">All Types</option>
                  <option value="exchange">Exchange</option>
                  <option value="deposit">Deposit</option>
                  <option value="withdrawal">Withdrawal</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-white/80 text-sm">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-400"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
            </div>
            <button
              onClick={exportTransactions}
              className="flex items-center space-x-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 rounded-lg text-white transition-colors duration-200"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
          </div>
        </motion.div>

        {/* Transactions List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden"
        >
          {filteredTransactions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-700/50 border-b border-white/10">
                  <tr>
                    <th className="text-left p-4 text-white/80 font-semibold">Date</th>
                    <th className="text-left p-4 text-white/80 font-semibold">Type</th>
                    <th className="text-left p-4 text-white/80 font-semibold">Details</th>
                    <th className="text-right p-4 text-white/80 font-semibold">Amount</th>
                    <th className="text-center p-4 text-white/80 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((transaction, index) => (
                    <motion.tr
                      key={transaction.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.02 }}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors duration-200"
                    >
                      <td className="p-4">
                        <div className="text-white font-medium">
                          {new Date(transaction.created_at).toLocaleDateString()}
                        </div>
                        <div className="text-white/60 text-sm">
                          {new Date(transaction.created_at).toLocaleTimeString()}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-slate-700/50 rounded-full flex items-center justify-center mr-3">
                            {getTypeIcon(transaction.type)}
                          </div>
                          <div>
                            <div className="text-white font-medium capitalize">{transaction.type}</div>
                            <div className="text-white/60 text-sm">
                              {transaction.type === 'exchange' ? 'Currency Exchange' : 
                               transaction.type === 'deposit' ? 'Deposit' : 'Withdrawal'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        {transaction.from_currency && transaction.to_currency ? (
                          <div>
                            <div className="text-white font-medium">
                              {transaction.from_currency} → {transaction.to_currency}
                            </div>
                            {transaction.rate && (
                              <div className="text-white/60 text-sm">
                                Rate: {transaction.rate.toFixed(6)}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-white/60">-</div>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <div className="text-white font-medium">
                          {transaction.from_amount ? `${transaction.from_amount.toFixed(6)} ${transaction.from_currency}` : '-'}
                        </div>
                        {transaction.to_amount && (
                          <div className="text-white/60 text-sm">
                            ≈ {transaction.to_amount.toFixed(6)} {transaction.to_currency}
                          </div>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center">
                          {getStatusIcon(transaction.status)}
                          <span className={`ml-2 text-sm font-medium capitalize ${
                            transaction.status === 'completed' ? 'text-green-400' :
                            transaction.status === 'pending' ? 'text-yellow-400' :
                            'text-red-400'
                          }`}>
                            {transaction.status}
                          </span>
                        </div>
                        {transaction.completed_at && (
                          <div className="text-white/40 text-xs mt-1">
                            {new Date(transaction.completed_at).toLocaleString()}
                          </div>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <ArrowUpRight className="w-8 h-8 text-white/40" />
              </div>
              <h3 className="text-white font-semibold mb-2">No transactions found</h3>
              <p className="text-white/60">
                {filter !== 'all' || statusFilter !== 'all' 
                  ? 'Try adjusting your filters to see more results'
                  : 'Start trading to see your transaction history here'
                }
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default TransactionsPage