import cron from 'node-cron';
import { db } from '../database/init.js';

// Mock price data - In production, you'd fetch from real APIs like CoinGecko, Binance, etc.
const mockPrices = {
  BTC: { price: 65430, change: 2.5, volume: 28500000000, marketCap: 1280000000000 },
  ETH: { price: 3200, change: 1.8, volume: 15200000000, marketCap: 385000000000 },
  USDT: { price: 1, change: 0.1, volume: 45000000000, marketCap: 95000000000 },
  BNB: { price: 520, change: -0.8, volume: 1800000000, marketCap: 78000000000 },
  XRP: { price: 0.62, change: 3.2, volume: 2100000000, marketCap: 34000000000 },
  ADA: { price: 0.45, change: 1.5, volume: 850000000, marketCap: 16000000000 },
  SOL: { price: 95, change: 4.2, volume: 1200000000, marketCap: 42000000000 },
  DOT: { price: 8.5, change: -1.2, volume: 450000000, marketCap: 11000000000 }
};

export const updateMarketData = async () => {
  try {
    for (const [symbol, data] of Object.entries(mockPrices)) {
      // Add some randomness to simulate real market movement
      const priceVariation = (Math.random() - 0.5) * 0.02; // ±1% variation
      const changeVariation = (Math.random() - 0.5) * 0.5; // ±0.25% variation
      
      const newPrice = data.price * (1 + priceVariation);
      const newChange = data.change + changeVariation;
      
      await db.runAsync(
        `INSERT OR REPLACE INTO market_data (symbol, price, change_24h, volume_24h, market_cap, updated_at)
         VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
        [symbol, newPrice, newChange, data.volume, data.marketCap]
      );

      // Update exchange rates
      for (const [otherSymbol, otherData] of Object.entries(mockPrices)) {
        if (symbol !== otherSymbol) {
          const rate = newPrice / (otherData.price * (1 + priceVariation));
          await db.runAsync(
            `INSERT OR REPLACE INTO exchange_rates (from_currency, to_currency, rate, updated_at)
             VALUES (?, ?, ?, CURRENT_TIMESTAMP)`,
            [symbol, otherSymbol, rate]
          );
        }
      }
    }
    
    console.log('📊 Market data updated');
  } catch (error) {
    console.error('Market data update error:', error);
  }
};

export const startPriceUpdates = (broadcastCallback) => {
  // Initial update
  updateMarketData();

  // Update every 30 seconds
  cron.schedule('*/30 * * * * *', async () => {
    await updateMarketData();
    
    // Broadcast updated data to WebSocket clients
    try {
      const marketData = await db.allAsync('SELECT * FROM market_data');
      broadcastCallback({
        type: 'MARKET_UPDATE',
        data: marketData
      });
    } catch (error) {
      console.error('Broadcast error:', error);
    }
  });

  console.log('🔄 Price update service started');
};