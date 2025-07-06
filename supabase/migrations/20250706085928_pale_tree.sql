/*
  # Crypto Exchange Database Schema

  1. New Tables
    - `users` - User accounts with authentication
    - `wallets` - User cryptocurrency wallets
    - `transactions` - Exchange transaction history
    - `market_data` - Real-time cryptocurrency market data
    - `exchange_rates` - Currency exchange rates

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to access their own data
    - Public read access for market data

  3. Features
    - UUID primary keys for security
    - Timestamps for audit trails
    - Proper foreign key relationships
    - Default balances for demo purposes
*/

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Wallets table
CREATE TABLE IF NOT EXISTS wallets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  currency text NOT NULL,
  balance decimal(20,8) DEFAULT 0,
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
  from_amount decimal(20,8),
  to_amount decimal(20,8),
  rate decimal(20,8),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

-- Market data table
CREATE TABLE IF NOT EXISTS market_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol text UNIQUE NOT NULL,
  name text NOT NULL,
  price decimal(20,8) NOT NULL,
  change_24h decimal(10,4) NOT NULL,
  volume_24h decimal(20,2) NOT NULL,
  market_cap decimal(20,2),
  updated_at timestamptz DEFAULT now()
);

-- Exchange rates table
CREATE TABLE IF NOT EXISTS exchange_rates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  from_currency text NOT NULL,
  to_currency text NOT NULL,
  rate decimal(20,8) NOT NULL,
  updated_at timestamptz DEFAULT now(),
  UNIQUE(from_currency, to_currency)
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE exchange_rates ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = id::text);

-- Wallets policies
CREATE POLICY "Users can read own wallets"
  ON wallets
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own wallets"
  ON wallets
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own wallets"
  ON wallets
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = user_id::text);

-- Transactions policies
CREATE POLICY "Users can read own transactions"
  ON transactions
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own transactions"
  ON transactions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own transactions"
  ON transactions
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = user_id::text);

-- Market data policies (public read access)
CREATE POLICY "Anyone can read market data"
  ON market_data
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Exchange rates policies (public read access)
CREATE POLICY "Anyone can read exchange rates"
  ON exchange_rates
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Insert initial market data
INSERT INTO market_data (symbol, name, price, change_24h, volume_24h, market_cap) VALUES
  ('BTC', 'Bitcoin', 65430.00, 2.5, 28500000000, 1280000000000),
  ('ETH', 'Ethereum', 3200.00, 1.8, 15200000000, 385000000000),
  ('USDT', 'Tether', 1.00, 0.1, 45000000000, 95000000000),
  ('BNB', 'Binance Coin', 520.00, -0.8, 1800000000, 78000000000),
  ('XRP', 'Ripple', 0.62, 3.2, 2100000000, 34000000000),
  ('ADA', 'Cardano', 0.45, 1.5, 850000000, 16000000000),
  ('SOL', 'Solana', 95.00, 4.2, 1200000000, 42000000000),
  ('DOT', 'Polkadot', 8.50, -1.2, 450000000, 11000000000)
ON CONFLICT (symbol) DO UPDATE SET
  price = EXCLUDED.price,
  change_24h = EXCLUDED.change_24h,
  volume_24h = EXCLUDED.volume_24h,
  market_cap = EXCLUDED.market_cap,
  updated_at = now();

-- Insert initial exchange rates
INSERT INTO exchange_rates (from_currency, to_currency, rate) VALUES
  ('BTC', 'USDT', 65430.00),
  ('ETH', 'USDT', 3200.00),
  ('BNB', 'USDT', 520.00),
  ('XRP', 'USDT', 0.62),
  ('ADA', 'USDT', 0.45),
  ('SOL', 'USDT', 95.00),
  ('DOT', 'USDT', 8.50),
  ('USDT', 'BTC', 0.0000153),
  ('USDT', 'ETH', 0.0003125),
  ('USDT', 'BNB', 0.00192),
  ('USDT', 'XRP', 1.613),
  ('USDT', 'ADA', 2.222),
  ('USDT', 'SOL', 0.0105),
  ('USDT', 'DOT', 0.118)
ON CONFLICT (from_currency, to_currency) DO UPDATE SET
  rate = EXCLUDED.rate,
  updated_at = now();