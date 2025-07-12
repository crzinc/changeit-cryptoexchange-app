import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
})

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      wallets: {
        Row: {
          id: string
          user_id: string
          currency: string
          balance: number
          locked_balance: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          currency: string
          balance?: number
          locked_balance?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          currency?: string
          balance?: number
          locked_balance?: number
          created_at?: string
          updated_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          user_id: string
          type: string
          from_currency: string | null
          to_currency: string | null
          from_amount: number | null
          to_amount: number | null
          rate: number | null
          fee: number | null
          status: string
          created_at: string
          completed_at: string | null
          metadata: any
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          from_currency?: string | null
          to_currency?: string | null
          from_amount?: number | null
          to_amount?: number | null
          rate?: number | null
          fee?: number | null
          status?: string
          created_at?: string
          completed_at?: string | null
          metadata?: any
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          from_currency?: string | null
          to_currency?: string | null
          from_amount?: number | null
          to_amount?: number | null
          rate?: number | null
          fee?: number | null
          status?: string
          created_at?: string
          completed_at?: string | null
          metadata?: any
        }
      }
      market_data: {
        Row: {
          id: string
          symbol: string
          name: string
          price: number
          price_usd: number
          change_24h: number
          change_7d: number
          volume_24h: number
          market_cap: number | null
          circulating_supply: number | null
          total_supply: number | null
          rank: number | null
          is_active: boolean
          updated_at: string
        }
        Insert: {
          id?: string
          symbol: string
          name: string
          price: number
          price_usd: number
          change_24h: number
          change_7d?: number
          volume_24h: number
          market_cap?: number | null
          circulating_supply?: number | null
          total_supply?: number | null
          rank?: number | null
          is_active?: boolean
          updated_at?: string
        }
        Update: {
          id?: string
          symbol?: string
          name?: string
          price?: number
          price_usd?: number
          change_24h?: number
          change_7d?: number
          volume_24h?: number
          market_cap?: number | null
          circulating_supply?: number | null
          total_supply?: number | null
          rank?: number | null
          is_active?: boolean
          updated_at?: string
        }
      }
      exchange_rates: {
        Row: {
          id: string
          from_currency: string
          to_currency: string
          rate: number
          inverse_rate: number
          spread: number
          updated_at: string
        }
        Insert: {
          id?: string
          from_currency: string
          to_currency: string
          rate: number
          inverse_rate: number
          spread?: number
          updated_at?: string
        }
        Update: {
          id?: string
          from_currency?: string
          to_currency?: string
          rate?: number
          inverse_rate?: number
          spread?: number
          updated_at?: string
        }
      }
      price_history: {
        Row: {
          id: string
          symbol: string
          price: number
          volume: number
          timestamp: string
        }
        Insert: {
          id?: string
          symbol: string
          price: number
          volume?: number
          timestamp?: string
        }
        Update: {
          id?: string
          symbol?: string
          price?: number
          volume?: number
          timestamp?: string
        }
      }
      user_sessions: {
        Row: {
          id: string
          user_id: string
          session_token: string
          last_activity: string
          is_active: boolean
          metadata: any
        }
        Insert: {
          id?: string
          user_id: string
          session_token: string
          last_activity?: string
          is_active?: boolean
          metadata?: any
        }
        Update: {
          id?: string
          user_id?: string
          session_token?: string
          last_activity?: string
          is_active?: boolean
          metadata?: any
        }
      }
    }
    Functions: {
      calculate_exchange_rate: {
        Args: {
          from_symbol: string
          to_symbol: string
        }
        Returns: number
      }
      update_all_exchange_rates: {
        Args: Record<PropertyKey, never>
        Returns: void
      }
    }
  }
}