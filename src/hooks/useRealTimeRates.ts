import { useState, useEffect, useCallback } from 'react'
import { supabaseApi } from '../services/supabaseApi'
import type { Database } from '../lib/supabase'

type ExchangeRate = Database['public']['Tables']['exchange_rates']['Row']
type MarketData = Database['public']['Tables']['market_data']['Row']

interface RealTimeRatesHook {
  rates: Record<string, number>
  marketData: MarketData[]
  isLoading: boolean
  error: string | null
  getRate: (from: string, to: string) => number
  refreshRates: () => Promise<void>
}

export const useRealTimeRates = (): RealTimeRatesHook => {
  const [rates, setRates] = useState<Record<string, number>>({})
  const [marketData, setMarketData] = useState<MarketData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const processExchangeRates = useCallback((exchangeRates: ExchangeRate[]) => {
    const ratesMap: Record<string, number> = {}
    
    exchangeRates.forEach(rate => {
      const key = `${rate.from_currency}-${rate.to_currency}`
      ratesMap[key] = rate.rate
    })
    
    setRates(ratesMap)
  }, [])

  const getRate = useCallback((from: string, to: string): number => {
    if (from === to) return 1
    
    const directKey = `${from}-${to}`
    const reverseKey = `${to}-${from}`
    
    if (rates[directKey]) {
      return rates[directKey]
    }
    
    if (rates[reverseKey]) {
      return 1 / rates[reverseKey]
    }
    
    // Fallback: calculate via USD if available
    const fromUsdKey = `${from}-USDT`
    const toUsdKey = `${to}-USDT`
    
    if (rates[fromUsdKey] && rates[toUsdKey]) {
      return rates[fromUsdKey] / rates[toUsdKey]
    }
    
    return 0
  }, [rates])

  const refreshRates = useCallback(async () => {
    try {
      setError(null)
      const [marketResponse, ratesResponse] = await Promise.all([
        supabaseApi.getMarketData(),
        supabaseApi.getAllExchangeRates()
      ])
      
      setMarketData(marketResponse)
      processExchangeRates(ratesResponse)
    } catch (err) {
      console.error('Failed to refresh rates:', err)
      setError(err instanceof Error ? err.message : 'Failed to refresh rates')
    }
  }, [processExchangeRates])

  useEffect(() => {
    const initializeRates = async () => {
      setIsLoading(true)
      await refreshRates()
      setIsLoading(false)
    }

    initializeRates()

    // Set up real-time subscriptions
    const marketSubscription = supabaseApi.subscribeToMarketData(setMarketData)
    const ratesSubscription = supabaseApi.subscribeToExchangeRates(processExchangeRates)

    // Auto-refresh every 30 seconds as backup
    const refreshInterval = setInterval(refreshRates, 30000)

    return () => {
      marketSubscription.unsubscribe()
      ratesSubscription.unsubscribe()
      clearInterval(refreshInterval)
    }
  }, [refreshRates, processExchangeRates])

  return {
    rates,
    marketData,
    isLoading,
    error,
    getRate,
    refreshRates
  }
}