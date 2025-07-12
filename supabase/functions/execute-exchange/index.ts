import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ExchangeRequest {
  fromCurrency: string;
  toCurrency: string;
  fromAmount: number;
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

    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')
    
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token)
    if (authError || !user) {
      throw new Error('Unauthorized')
    }

    const { fromCurrency, toCurrency, fromAmount }: ExchangeRequest = await req.json()

    if (!fromCurrency || !toCurrency || !fromAmount || fromAmount <= 0) {
      throw new Error('Invalid exchange parameters')
    }

    if (fromCurrency === toCurrency) {
      throw new Error('Cannot exchange same currency')
    }

    // Get current exchange rate
    const { data: rateData, error: rateError } = await supabaseClient
      .from('exchange_rates')
      .select('rate, spread')
      .eq('from_currency', fromCurrency)
      .eq('to_currency', toCurrency)
      .single()

    if (rateError || !rateData) {
      throw new Error('Exchange rate not available')
    }

    const rate = rateData.rate
    const spread = rateData.spread || 0.001
    const effectiveRate = rate * (1 - spread) // Apply spread
    const toAmount = fromAmount * effectiveRate
    const fee = fromAmount * 0.001 // 0.1% fee

    // Check user balance
    const { data: fromWallet, error: walletError } = await supabaseClient
      .from('wallets')
      .select('*')
      .eq('user_id', user.id)
      .eq('currency', fromCurrency)
      .single()

    if (walletError || !fromWallet) {
      throw new Error('Source wallet not found')
    }

    if (fromWallet.balance < fromAmount) {
      throw new Error('Insufficient balance')
    }

    // Start database transaction
    const transactionId = crypto.randomUUID()

    // Create transaction record
    const { error: transactionError } = await supabaseClient
      .from('transactions')
      .insert({
        id: transactionId,
        user_id: user.id,
        type: 'exchange',
        from_currency: fromCurrency,
        to_currency: toCurrency,
        from_amount: fromAmount,
        to_amount: toAmount,
        rate: effectiveRate,
        fee: fee,
        status: 'processing',
        metadata: {
          original_rate: rate,
          spread: spread,
          timestamp: new Date().toISOString()
        }
      })

    if (transactionError) {
      throw new Error('Failed to create transaction record')
    }

    try {
      // Update from wallet (subtract amount + fee)
      const { error: updateFromError } = await supabaseClient
        .from('wallets')
        .update({ 
          balance: fromWallet.balance - fromAmount - fee,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .eq('currency', fromCurrency)

      if (updateFromError) {
        throw new Error('Failed to update source wallet')
      }

      // Get or create destination wallet
      let { data: toWallet, error: toWalletError } = await supabaseClient
        .from('wallets')
        .select('*')
        .eq('user_id', user.id)
        .eq('currency', toCurrency)
        .single()

      if (toWalletError && toWalletError.code !== 'PGRST116') {
        throw new Error('Failed to access destination wallet')
      }

      if (!toWallet) {
        // Create new wallet
        const { data: newWallet, error: createWalletError } = await supabaseClient
          .from('wallets')
          .insert({
            user_id: user.id,
            currency: toCurrency,
            balance: toAmount
          })
          .select()
          .single()

        if (createWalletError) {
          throw new Error('Failed to create destination wallet')
        }
        toWallet = newWallet
      } else {
        // Update existing wallet
        const { error: updateToError } = await supabaseClient
          .from('wallets')
          .update({ 
            balance: parseFloat(toWallet.balance.toString()) + toAmount,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id)
          .eq('currency', toCurrency)

        if (updateToError) {
          throw new Error('Failed to update destination wallet')
        }
      }

      // Mark transaction as completed
      const { error: completeError } = await supabaseClient
        .from('transactions')
        .update({ 
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', transactionId)

      if (completeError) {
        console.error('Failed to mark transaction as completed:', completeError)
      }

      // Trigger real-time market data update to reflect the trade
      const marketUpdateResponse = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/market-updates`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
          'Content-Type': 'application/json'
        }
      })

      return new Response(
        JSON.stringify({
          success: true,
          transaction: {
            id: transactionId,
            fromCurrency,
            toCurrency,
            fromAmount,
            toAmount,
            rate: effectiveRate,
            fee,
            status: 'completed'
          },
          message: 'Exchange completed successfully'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )

    } catch (executionError) {
      // Rollback transaction on error
      await supabaseClient
        .from('transactions')
        .update({ 
          status: 'failed',
          completed_at: new Date().toISOString(),
          metadata: {
            error: executionError.message,
            timestamp: new Date().toISOString()
          }
        })
        .eq('id', transactionId)

      throw executionError
    }

  } catch (error) {
    console.error('Exchange execution error:', error)
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})