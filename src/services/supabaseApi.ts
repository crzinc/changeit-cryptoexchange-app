import { supabase } from '../lib/supabase'
import type { Database } from '../lib/supabase'

type Tables = Database['public']['Tables']
type User = Tables['users']['Row']
type Wallet = Tables['wallets']['Row']
type Transaction = Tables['transactions']['Row']
type MarketData = Tables['market_data']['Row']
type ExchangeRate = Tables['exchange_rates']['Row']
type PriceHistory = Tables['price_history']['Row']

class SupabaseApiService {
  // Auth methods
  async signUp(email: string, password: string, name: string) {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (authError) throw authError

    if (authData.user) {
      // Create user profile
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email,
          name,
        })

      if (profileError) throw profileError

      // Create default wallets with demo balances
      const defaultCurrencies = [
        { currency: 'BTC', balance: 0.5 },
        { currency: 'ETH', balance: 2.0 },
        { currency: 'USDT', balance: 10000 },
        { currency: 'BNB', balance: 5.0 },
        { currency: 'XRP', balance: 1000 },
        { currency: 'ADA', balance: 500 },
        { currency: 'SOL', balance: 10 },
        { currency: 'DOT', balance: 50 }
      ]

      const wallets = defaultCurrencies.map(({ currency, balance }) => ({
        user_id: authData.user!.id,
        currency,
        balance,
      }))

      const { error: walletsError } = await supabase
        .from('wallets')
        .insert(wallets)

      if (walletsError) throw walletsError
    }

    return authData
  }

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error
    return data
  }

  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error && error.message === 'Auth session missing!') {
      return null
    }
    
    if (error) throw error
    return user
  }

  async getUserProfile(userId: string): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) throw error
    return data
  }

  async updateUserProfile(userId: string, updates: Partial<Pick<User, 'name' | 'avatar_url'>>) {
    const { data, error } = await supabase
      .from('users')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Wallet methods
  async getUserWallets(userId: string): Promise<Wallet[]> {
    const { data, error } = await supabase
      .from('wallets')
      .select('*')
      .eq('user_id', userId)
      .order('currency')

    if (error) throw error
    return data || []
  }

  async getWalletBalance(userId: string, currency: string): Promise<number> {
    const { data, error } = await supabase
      .from('wallets')
      .select('balance')
      .eq('user_id', userId)
      .eq('currency', currency)
      .single()

    if (error) throw error
    return parseFloat(data.balance.toString())
  }

  // Transaction methods
  async getUserTransactions(userId: string, limit = 50, offset = 0): Promise<Transaction[]> {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) throw error
    return data || []
  }

  async getTransactionById(transactionId: string): Promise<Transaction> {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('id', transactionId)
      .single()

    if (error) throw error
    return data
  }

  async executeExchange(fromCurrency: string, toCurrency: string, fromAmount: number) {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) throw new Error('Not authenticated')

    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/execute-exchange`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fromCurrency,
        toCurrency,
        fromAmount,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Exchange failed')
    }

    return response.json()
  }

  // Market data methods
  async getMarketData(): Promise<MarketData[]> {
    const { data, error } = await supabase
      .from('market_data')
      .select('*')
      .eq('is_active', true)
      .order('rank')

    if (error) throw error
    return data || []
  }

  async getCurrencyData(symbol: string): Promise<MarketData> {
    const { data, error } = await supabase
      .from('market_data')
      .select('*')
      .eq('symbol', symbol.toUpperCase())
      .eq('is_active', true)
      .single()

    if (error) throw error
    return data
  }

  async getTrendingCurrencies(): Promise<MarketData[]> {
    const { data, error } = await supabase
      .from('market_data')
      .select('*')
      .eq('is_active', true)
      .gt('change_24h', 0)
      .order('change_24h', { ascending: false })
      .limit(10)

    if (error) throw error
    return data || []
  }

  async getPriceHistory(symbol: string, hours = 24): Promise<PriceHistory[]> {
    const startTime = new Date()
    startTime.setHours(startTime.getHours() - hours)

    const { data, error } = await supabase
      .from('price_history')
      .select('*')
      .eq('symbol', symbol)
      .gte('timestamp', startTime.toISOString())
      .order('timestamp')

    if (error) throw error
    return data || []
  }

  // Exchange rate methods
  async getExchangeRate(fromCurrency: string, toCurrency: string): Promise<number> {
    if (fromCurrency === toCurrency) return 1

    const { data, error } = await supabase
      .from('exchange_rates')
      .select('rate')
      .eq('from_currency', fromCurrency)
      .eq('to_currency', toCurrency)
      .single()

    if (error) {
      // Try reverse rate
      const { data: reverseData, error: reverseError } = await supabase
        .from('exchange_rates')
        .select('rate')
        .eq('from_currency', toCurrency)
        .eq('to_currency', fromCurrency)
        .single()

      if (reverseError) throw new Error('Exchange rate not found')
      return 1 / reverseData.rate
    }

    return data.rate
  }

  async getAllExchangeRates(): Promise<ExchangeRate[]> {
    const { data, error } = await supabase
      .from('exchange_rates')
      .select('*')
      .order('updated_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  // Real-time subscriptions
  subscribeToMarketData(callback: (data: MarketData[]) => void) {
    return supabase
      .channel('market_data_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'market_data',
        },
        async () => {
          const data = await this.getMarketData()
          callback(data)
        }
      )
      .subscribe()
  }

  subscribeToExchangeRates(callback: (data: ExchangeRate[]) => void) {
    return supabase
      .channel('exchange_rates_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'exchange_rates',
        },
        async () => {
          const data = await this.getAllExchangeRates()
          callback(data)
        }
      )
      .subscribe()
  }

  subscribeToUserWallets(userId: string, callback: (data: Wallet[]) => void) {
    return supabase
      .channel('wallet_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'wallets',
          filter: `user_id=eq.${userId}`,
        },
        async () => {
          const data = await this.getUserWallets(userId)
          callback(data)
        }
      )
      .subscribe()
  }

  subscribeToUserTransactions(userId: string, callback: (data: Transaction[]) => void) {
    return supabase
      .channel('transaction_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'transactions',
          filter: `user_id=eq.${userId}`,
        },
        async () => {
          const data = await this.getUserTransactions(userId, 50)
          callback(data)
        }
      )
      .subscribe()
  }

  // Utility methods
  async triggerMarketUpdate() {
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/market-updates`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to trigger market update')
    }

    return response.json()
  }

  async getPriceFeed(symbols?: string[]) {
    const url = new URL(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/price-feed`)
    if (symbols && symbols.length > 0) {
      url.searchParams.set('symbols', symbols.join(','))
    }

    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch price feed')
    }

    return response.json()
  }
}

export const supabaseApi = new SupabaseApiService()