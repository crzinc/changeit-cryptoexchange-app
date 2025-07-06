import { supabase } from '../lib/supabase'
import type { Database } from '../lib/supabase'

type Tables = Database['public']['Tables']
type User = Tables['users']['Row']
type Wallet = Tables['wallets']['Row']
type Transaction = Tables['transactions']['Row']
type MarketData = Tables['market_data']['Row']

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

      // Create default wallets
      const defaultCurrencies = ['BTC', 'ETH', 'USDT', 'BNB', 'XRP', 'ADA', 'SOL', 'DOT']
      const wallets = defaultCurrencies.map(currency => ({
        user_id: authData.user!.id,
        currency,
        balance: currency === 'USDT' ? 10000 : Math.random() * 10, // Demo balances
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

  async updateUserProfile(userId: string, updates: Partial<Pick<User, 'name'>>) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
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
      .order('market_cap', { ascending: false })

    if (error) throw error
    return data || []
  }

  async getCurrencyData(symbol: string): Promise<MarketData> {
    const { data, error } = await supabase
      .from('market_data')
      .select('*')
      .eq('symbol', symbol.toUpperCase())
      .single()

    if (error) throw error
    return data
  }

  async getTrendingCurrencies(): Promise<MarketData[]> {
    const { data, error } = await supabase
      .from('market_data')
      .select('*')
      .gt('change_24h', 0)
      .order('change_24h', { ascending: false })
      .limit(10)

    if (error) throw error
    return data || []
  }

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
}

export const supabaseApi = new SupabaseApiService()