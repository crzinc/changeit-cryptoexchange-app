import express from 'express';
import { db } from '../database/init.js';

const router = express.Router();

// Get market data for all currencies
router.get('/data', async (req, res) => {
  try {
    const marketData = await db.allAsync(
      'SELECT * FROM market_data ORDER BY market_cap DESC'
    );

    res.json(marketData);
  } catch (error) {
    console.error('Market data error:', error);
    res.status(500).json({ error: 'Failed to get market data' });
  }
});

// Get specific currency data
router.get('/data/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const data = await db.getAsync(
      'SELECT * FROM market_data WHERE symbol = ?',
      [symbol.toUpperCase()]
    );

    if (!data) {
      return res.status(404).json({ error: 'Currency not found' });
    }

    res.json(data);
  } catch (error) {
    console.error('Currency data error:', error);
    res.status(500).json({ error: 'Failed to get currency data' });
  }
});

// Get trending currencies
router.get('/trending', async (req, res) => {
  try {
    const trending = await db.allAsync(
      `SELECT * FROM market_data 
       WHERE change_24h > 0 
       ORDER BY change_24h DESC 
       LIMIT 10`
    );

    res.json(trending);
  } catch (error) {
    console.error('Trending data error:', error);
    res.status(500).json({ error: 'Failed to get trending data' });
  }
});

export default router;