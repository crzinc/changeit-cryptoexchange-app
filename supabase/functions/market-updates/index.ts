import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface MarketData {
  symbol: string;
  name: string;
  price: number;
  price_usd: number;
  change_24h: number;
  change_7d: number;
  volume_24h: number;
  market_cap: number;
  circulating_supply: number;
  rank: number;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Realistic market data with proper variations
    const marketUpdates: Record<string, Omit<MarketData, 'symbol'>> = {
      BTC: { 
        name: 'Bitcoin', 
        price: 65430, 
        price_usd: 65430, 
        change_24h: 2.5, 
        change_7d: 8.2, 
        volume_24h: 28500000000, 
        market_cap: 1280000000000, 
        circulating_supply: 19500000, 
        rank: 1 
      },
      ETH: { 
        name: 'Ethereum', 
        price: 3200, 
        price_usd: 3200, 
        change_24h: 1.8, 
        change_7d: 5.1, 
        volume_24h: 15200000000, 
        market_cap: 385000000000, 
        circulating_supply: 120000000, 
        rank: 2 
      },
      USDT: { 
        name: 'Tether', 
        price: 1.00, 
        price_usd: 1.00, 
        change_24h: 0.1, 
        change_7d: 0.0, 
        volume_24h: 45000000000, 
        market_cap: 95000000000, 
        circulating_supply: 95000000000, 
        rank: 3 
      },
      BNB: { 
        name: 'Binance Coin', 
        price: 520, 
        price_usd: 520, 
        change_24h: -0.8, 
        change_7d: 3.2, 
        volume_24h: 1800000000, 
        market_cap: 78000000000, 
        circulating_supply: 150000000, 
        rank: 4 
      },
      XRP: { 
        name: 'Ripple', 
        price: 0.62, 
        price_usd: 0.62, 
        change_24h: 3.2, 
        change_7d: -2.1, 
        volume_24h: 2100000000, 
        market_cap: 34000000000, 
        circulating_supply: 54000000000, 
        rank: 5 
      },
      ADA: { 
        name: 'Cardano', 
        price: 0.45, 
        price_usd: 0.45, 
        change_24h: 1.5, 
        change_7d: 4.8, 
        volume_24h: 850000000, 
        market_cap: 16000000000, 
        circulating_supply: 35000000000, 
        rank: 6 
      },
      SOL: { 
        name: 'Solana', 
        price: 95, 
        price_usd: 95, 
        change_24h: 4.2, 
        change_7d: 12.5, 
        volume_24h: 1200000000, 
        market_cap: 42000000000, 
        circulating_supply: 440000000, 
        rank: 7 
      },
      DOT: { 
        name: 'Polkadot', 
        price: 8.5, 
        price_usd: 8.5, 
        change_24h: -1.2, 
        change_7d: 2.8, 
        volume_24h: 450000000, 
        market_cap: 11000000000, 
        circulating_supply: 1300000000, 
        rank: 8 
      },
      MATIC: { 
        name: 'Polygon', 
        price: 0.85, 
        price_usd: 0.85, 
        change_24h: 2.8, 
        change_7d: 6.5, 
        volume_24h: 380000000, 
        market_cap: 8500000000, 
        circulating_supply: 10000000000, 
        rank: 9 
      },
      AVAX: { 
        name: 'Avalanche', 
        price: 28.5, 
        price_usd: 28.5, 
        change_24h: 3.5, 
        change_7d: 9.2, 
        volume_24h: 320000000, 
        market_cap: 11200000000, 
        circulating_supply: 390000000, 
        rank: 10 
      }
    }

    // Update market data with realistic variations
    for (const [symbol, data] of Object.entries(marketUpdates)) {
      // Create realistic price movements
      const priceVariation = (Math.random() - 0.5) * 0.03 // ±1.5% variation
      const changeVariation = (Math.random() - 0.5) * 0.8 // ±0.4% variation
      const volumeVariation = (Math.random() - 0.5) * 0.2 // ±10% variation
      
      const newPrice = data.price * (1 + priceVariation)
      const newChange24h = data.change_24h + changeVariation
      const newVolume = data.volume_24h * (1 + volumeVariation)
      const newMarketCap = newPrice * data.circulating_supply

      // Update market data
      const { error: marketError } = await supabaseClient
        .from('market_data')
        .upsert({
          symbol,
          name: data.name,
          price: newPrice,
          price_usd: newPrice,
          change_24h: newChange24h,
          change_7d: data.change_7d,
          volume_24h: newVolume,
          market_cap: newMarketCap,
          circulating_supply: data.circulating_supply,
          rank: data.rank,
          updated_at: new Date().toISOString()
        })

      if (marketError) {
        console.error(`Error updating market data for ${symbol}:`, marketError)
        continue
      }

      // Add to price history
      await supabaseClient
        .from('price_history')
        .insert({
          symbol,
          price: newPrice,
          volume: newVolume / 24, // Hourly volume
          timestamp: new Date().toISOString()
        })
    }

    // Update all exchange rates using the database function
    const { error: ratesError } = await supabaseClient
      .rpc('update_all_exchange_rates')

    if (ratesError) {
      console.error('Error updating exchange rates:', ratesError)
    }

    // Clean up old price history (keep last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    
    await supabaseClient
      .from('price_history')
      .delete()
      .lt('timestamp', sevenDaysAgo.toISOString())

    return new Response(
      JSON.stringify({ 
        message: 'Market data updated successfully',
        timestamp: new Date().toISOString(),
        updated_symbols: Object.keys(marketUpdates)
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Market update error:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})