/*
  # Complete Crypto Exchange Database Schema

  1. New Tables
    - `users` - User profiles and authentication
    - `wallets` - User cryptocurrency wallets
    - `transactions` - All user transactions (exchange, deposit, withdrawal)
    - `market_data` - Real-time cryptocurrency market data
    - `exchange_rates` - Real-time exchange rates between currencies
    - `price_history` - Historical price data for charts
    - `user_sessions` - Active user sessions for real-time updates

  2. Security
    - Enable RLS on all tables
    - Add comprehensive policies for all CRUD operations
    - Secure user data isolation

  3. Real-time Features
    - Market data updates
    - Exchange rate changes
    - Transaction status updates
    - Portfolio balance changes

  4. Indexes and Performance
    - Optimized queries for real-time data
    - Proper indexing for fast lookups
*/

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Wallets table
CREATE TABLE IF NOT EXISTS wallets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  currency text NOT NULL,
  balance numeric(20,8) DEFAULT 0,
  locked_balance numeric(20,8) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, currency)
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('exchange', 'deposit', 'withdrawal')),
  from_currency text,
  to_currency text,
  from_amount numeric(20,8),
  to_amount numeric(20,8),
  rate numeric(20,8),
  fee numeric(20,8) DEFAULT 0,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Market data table
CREATE TABLE IF NOT EXISTS market_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol text UNIQUE NOT NULL,
  name text NOT NULL,
  price numeric(20,8) NOT NULL,
  price_usd numeric(20,8) NOT NULL,
  change_24h numeric(10,4) NOT NULL,
  change_7d numeric(10,4) DEFAULT 0,
  volume_24h numeric(20,2) NOT NULL,
  market_cap numeric(20,2),
  circulating_supply numeric(20,2),
  total_supply numeric(20,2),
  rank integer,
  is_active boolean DEFAULT true,
  updated_at timestamptz DEFAULT now()
);

-- Exchange rates table
CREATE TABLE IF NOT EXISTS exchange_rates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  from_currency text NOT NULL,
  to_currency text NOT NULL,
  rate numeric(20,8) NOT NULL,
  inverse_rate numeric(20,8) NOT NULL,
  spread numeric(10,6) DEFAULT 0.001,
  updated_at timestamptz DEFAULT now(),
  UNIQUE(from_currency, to_currency)
);

-- Price history table for charts
CREATE TABLE IF NOT EXISTS price_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol text NOT NULL,
  price numeric(20,8) NOT NULL,
  volume numeric(20,2) DEFAULT 0,
  timestamp timestamptz DEFAULT now()
);

-- User sessions for real-time tracking
CREATE TABLE IF NOT EXISTS user_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_token text UNIQUE NOT NULL,
  last_activity timestamptz DEFAULT now(),
  is_active boolean DEFAULT true,
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_wallets_user_id ON wallets(user_id);
CREATE INDEX IF NOT EXISTS idx_wallets_currency ON wallets(currency);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_market_data_symbol ON market_data(symbol);
CREATE INDEX IF NOT EXISTS idx_market_data_rank ON market_data(rank);
CREATE INDEX IF NOT EXISTS idx_exchange_rates_pair ON exchange_rates(from_currency, to_currency);
CREATE INDEX IF NOT EXISTS idx_price_history_symbol_time ON price_history(symbol, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_active ON user_sessions(is_active) WHERE is_active = true;

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE exchange_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can insert own profile during registration"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = id::text);

CREATE POLICY "Users can read own data"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own data"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = id::text);

-- Wallets policies
CREATE POLICY "Users can insert own wallets"
  ON wallets FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can read own wallets"
  ON wallets FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own wallets"
  ON wallets FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = user_id::text);

-- Transactions policies
CREATE POLICY "Users can insert own transactions"
  ON transactions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can read own transactions"
  ON transactions FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own transactions"
  ON transactions FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = user_id::text);

-- Market data policies (public read access)
CREATE POLICY "Anyone can read market data"
  ON market_data FOR SELECT
  TO anon, authenticated
  USING (true);

-- Exchange rates policies (public read access)
CREATE POLICY "Anyone can read exchange rates"
  ON exchange_rates FOR SELECT
  TO anon, authenticated
  USING (true);

-- Price history policies (public read access)
CREATE POLICY "Anyone can read price history"
  ON price_history FOR SELECT
  TO anon, authenticated
  USING (true);

-- User sessions policies
CREATE POLICY "Users can manage own sessions"
  ON user_sessions FOR ALL
  TO authenticated
  USING (auth.uid()::text = user_id::text);

-- Functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for automatic timestamp updates
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_wallets_updated_at BEFORE UPDATE ON wallets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate exchange rates
CREATE OR REPLACE FUNCTION calculate_exchange_rate(
  from_symbol text,
  to_symbol text
) RETURNS numeric AS $$
DECLARE
  from_price numeric;
  to_price numeric;
  rate numeric;
BEGIN
  -- Get USD prices for both currencies
  SELECT price_usd INTO from_price FROM market_data WHERE symbol = from_symbol;
  SELECT price_usd INTO to_price FROM market_data WHERE symbol = to_symbol;
  
  -- Calculate rate
  IF from_price IS NULL OR to_price IS NULL OR to_price = 0 THEN
    RETURN 0;
  END IF;
  
  rate := from_price / to_price;
  RETURN rate;
END;
$$ LANGUAGE plpgsql;

-- Function to update all exchange rates
CREATE OR REPLACE FUNCTION update_all_exchange_rates()
RETURNS void AS $$
DECLARE
  currency_pair RECORD;
  calculated_rate numeric;
BEGIN
  -- Update rates for all currency pairs
  FOR currency_pair IN 
    SELECT DISTINCT m1.symbol as from_curr, m2.symbol as to_curr
    FROM market_data m1
    CROSS JOIN market_data m2
    WHERE m1.symbol != m2.symbol AND m1.is_active = true AND m2.is_active = true
  LOOP
    calculated_rate := calculate_exchange_rate(currency_pair.from_curr, currency_pair.to_curr);
    
    INSERT INTO exchange_rates (from_currency, to_currency, rate, inverse_rate, updated_at)
    VALUES (
      currency_pair.from_curr,
      currency_pair.to_curr,
      calculated_rate,
      CASE WHEN calculated_rate > 0 THEN 1.0 / calculated_rate ELSE 0 END,
      now()
    )
    ON CONFLICT (from_currency, to_currency)
    DO UPDATE SET
      rate = calculated_rate,
      inverse_rate = CASE WHEN calculated_rate > 0 THEN 1.0 / calculated_rate ELSE 0 END,
      updated_at = now();
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Insert initial market data
INSERT INTO market_data (symbol, name, price, price_usd, change_24h, change_7d, volume_24h, market_cap, circulating_supply, rank) VALUES
('BTC', 'Bitcoin', 65430.00, 65430.00, 2.5, 8.2, 28500000000, 1280000000000, 19500000, 1),
('ETH', 'Ethereum', 3200.00, 3200.00, 1.8, 5.1, 15200000000, 385000000000, 120000000, 2),
('USDT', 'Tether', 1.00, 1.00, 0.1, 0.0, 45000000000, 95000000000, 95000000000, 3),
('BNB', 'Binance Coin', 520.00, 520.00, -0.8, 3.2, 1800000000, 78000000000, 150000000, 4),
('XRP', 'Ripple', 0.62, 0.62, 3.2, -2.1, 2100000000, 34000000000, 54000000000, 5),
('ADA', 'Cardano', 0.45, 0.45, 1.5, 4.8, 850000000, 16000000000, 35000000000, 6),
('SOL', 'Solana', 95.00, 95.00, 4.2, 12.5, 1200000000, 42000000000, 440000000, 7),
('DOT', 'Polkadot', 8.50, 8.50, -1.2, 2.8, 450000000, 11000000000, 1300000000, 8),
('MATIC', 'Polygon', 0.85, 0.85, 2.8, 6.5, 380000000, 8500000000, 10000000000, 9),
('AVAX', 'Avalanche', 28.50, 28.50, 3.5, 9.2, 320000000, 11200000000, 390000000, 10)
ON CONFLICT (symbol) DO UPDATE SET
  price = EXCLUDED.price,
  price_usd = EXCLUDED.price_usd,
  change_24h = EXCLUDED.change_24h,
  change_7d = EXCLUDED.change_7d,
  volume_24h = EXCLUDED.volume_24h,
  market_cap = EXCLUDED.market_cap,
  circulating_supply = EXCLUDED.circulating_supply,
  rank = EXCLUDED.rank,
  updated_at = now();

-- Generate initial exchange rates
SELECT update_all_exchange_rates();

-- Insert some initial price history
INSERT INTO price_history (symbol, price, volume, timestamp)
SELECT 
  symbol,
  price * (1 + (random() - 0.5) * 0.02), -- ±1% variation
  volume_24h / 24 * random(), -- Random hourly volume
  now() - interval '1 hour' * generate_series(1, 24)
FROM market_data
WHERE symbol IN ('BTC', 'ETH', 'USDT', 'BNB', 'XRP');