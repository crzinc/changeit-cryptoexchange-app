import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface MarketData {
  symbol: string;
  name: string;
  price: number;
  change_24h: number;
  volume_24h: number;
  market_cap: number;
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

    // Mock price data with realistic variations
    const mockPrices: Record<string, Omit<MarketData, 'symbol'>> = {
      BTC: { name: 'Bitcoin', price: 65430, change_24h: 2.5, volume_24h: 28500000000, market_cap: 1280000000000 },
      ETH: { name: 'Ethereum', price: 3200, change_24h: 1.8, volume_24h: 15200000000, market_cap: 385000000000 },
      USDT: { name: 'Tether', price: 1, change_24h: 0.1, volume_24h: 45000000000, market_cap: 95000000000 },
      BNB: { name: 'Binance Coin', price: 520, change_24h: -0.8, volume_24h: 1800000000, market_cap: 78000000000 },
      XRP: { name: 'Ripple', price: 0.62, change_24h: 3.2, volume_24h: 2100000000, market_cap: 34000000000 },
      ADA: { name: 'Cardano', price: 0.45, change_24h: 1.5, volume_24h: 850000000, market_cap: 16000000000 },
      SOL: { name: 'Solana', price: 95, change_24h: 4.2, volume_24h: 1200000000, market_cap: 42000000000 },
      DOT: { name: 'Polkadot', price: 8.5, change_24h: -1.2, volume_24h: 450000000, market_cap: 11000000000 }
    }

    // Update market data with realistic variations
    for (const [symbol, data] of Object.entries(mockPrices)) {
      const priceVariation = (Math.random() - 0.5) * 0.02 // ±1% variation
      const changeVariation = (Math.random() - 0.5) * 0.5 // ±0.25% variation
      
      const newPrice = data.price * (1 + priceVariation)
      const newChange = data.change_24h + changeVariation

      await supabaseClient
        .from('market_data')
        .upsert({
          symbol,
          name: data.name,
          price: newPrice,
          change_24h: newChange,
          volume_24h: data.volume_24h,
          market_cap: data.market_cap,
          updated_at: new Date().toISOString()
        })

      // Update exchange rates
      for (const [otherSymbol, otherData] of Object.entries(mockPrices)) {
        if (symbol !== otherSymbol) {
          const rate = newPrice / (otherData.price * (1 + priceVariation))
          await supabaseClient
            .from('exchange_rates')
            .upsert({
              from_currency: symbol,
              to_currency: otherSymbol,
              rate,
              updated_at: new Date().toISOString()
            })
        }
      }
    }

    return new Response(
      JSON.stringify({ message: 'Market data updated successfully' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})