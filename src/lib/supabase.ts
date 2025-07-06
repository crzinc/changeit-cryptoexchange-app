import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
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
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          currency: string
          balance?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          currency?: string
          balance?: number
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
          status: string
          created_at: string
          completed_at: string | null
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
          status?: string
          created_at?: string
          completed_at?: string | null
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
          status?: string
          created_at?: string
          completed_at?: string | null
        }
      }
      market_data: {
        Row: {
          id: string
          symbol: string
          name: string
          price: number
          change_24h: number
          volume_24h: number
          market_cap: number | null
          updated_at: string
        }
        Insert: {
          id?: string
          symbol: string
          name: string
          price: number
          change_24h: number
          volume_24h: number
          market_cap?: number | null
          updated_at?: string
        }
        Update: {
          id?: string
          symbol?: string
          name?: string
          price?: number
          change_24h?: number
          volume_24h?: number
          market_cap?: number | null
          updated_at?: string
        }
      }
      exchange_rates: {
        Row: {
          id: string
          from_currency: string
          to_currency: string
          rate: number
          updated_at: string
        }
        Insert: {
          id?: string
          from_currency: string
          to_currency: string
          rate: number
          updated_at?: string
        }
        Update: {
          id?: string
          from_currency?: string
          to_currency?: string
          rate?: number
          updated_at?: string
        }
      }
    }
  }
}