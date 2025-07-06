import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

    const { fromCurrency, toCurrency, fromAmount } = await req.json()

    if (!fromCurrency || !toCurrency || !fromAmount || fromAmount <= 0) {
      throw new Error('Invalid exchange parameters')
    }

    // Get exchange rate
    const { data: rateData, error: rateError } = await supabaseClient
      .from('exchange_rates')
      .select('rate')
      .eq('from_currency', fromCurrency)
      .eq('to_currency', toCurrency)
      .single()

    if (rateError || !rateData) {
      throw new Error('Exchange rate not found')
    }

    const rate = rateData.rate
    const toAmount = fromAmount * rate

    // Check user balance
    const { data: fromWallet, error: walletError } = await supabaseClient
      .from('wallets')
      .select('*')
      .eq('user_id', user.id)
      .eq('currency', fromCurrency)
      .single()

    if (walletError || !fromWallet || fromWallet.balance < fromAmount) {
      throw new Error('Insufficient balance')
    }

    // Start transaction
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
        rate,
        status: 'pending'
      })

    if (transactionError) throw transactionError

    // Update from wallet (subtract)
    const { error: updateFromError } = await supabaseClient
      .from('wallets')
      .update({ 
        balance: fromWallet.balance - fromAmount,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', user.id)
      .eq('currency', fromCurrency)

    if (updateFromError) throw updateFromError

    // Update to wallet (add) or create if doesn't exist
    const { data: toWallet } = await supabaseClient
      .from('wallets')
      .select('*')
      .eq('user_id', user.id)
      .eq('currency', toCurrency)
      .single()

    if (toWallet) {
      const { error: updateToError } = await supabaseClient
        .from('wallets')
        .update({ 
          balance: parseFloat(toWallet.balance) + toAmount,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .eq('currency', toCurrency)

      if (updateToError) throw updateToError
    } else {
      const { error: createWalletError } = await supabaseClient
        .from('wallets')
        .insert({
          user_id: user.id,
          currency: toCurrency,
          balance: toAmount
        })

      if (createWalletError) throw createWalletError
    }

    // Mark transaction as completed
    const { error: completeError } = await supabaseClient
      .from('transactions')
      .update({ 
        status: 'completed',
        completed_at: new Date().toISOString()
      })
      .eq('id', transactionId)

    if (completeError) throw completeError

    return new Response(
      JSON.stringify({
        message: 'Exchange completed successfully',
        transactionId,
        fromAmount,
        toAmount,
        rate
      }),
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