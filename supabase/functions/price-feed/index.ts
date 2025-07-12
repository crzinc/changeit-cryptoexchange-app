import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Real-time price feed endpoint
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const url = new URL(req.url)
    const symbols = url.searchParams.get('symbols')?.split(',') || []

    if (symbols.length === 0) {
      // Return all market data if no specific symbols requested
      const { data: marketData, error } = await supabaseClient
        .from('market_data')
        .select('*')
        .eq('is_active', true)
        .order('rank')

      if (error) throw error

      return new Response(
        JSON.stringify({
          success: true,
          data: marketData,
          timestamp: new Date().toISOString()
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    // Return specific symbols
    const { data: marketData, error } = await supabaseClient
      .from('market_data')
      .select('*')
      .in('symbol', symbols)
      .eq('is_active', true)

    if (error) throw error

    // Also get exchange rates for the requested symbols
    const { data: exchangeRates, error: ratesError } = await supabaseClient
      .from('exchange_rates')
      .select('*')
      .or(`from_currency.in.(${symbols.join(',')}),to_currency.in.(${symbols.join(',')})`)

    if (ratesError) {
      console.error('Error fetching exchange rates:', ratesError)
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          market_data: marketData,
          exchange_rates: exchangeRates || []
        },
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Price feed error:', error)
    return new Response(
      JSON.stringify({ 
        success: false,
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