import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../database/init.js';
import { authenticateToken } from '../middleware/auth.js';
import { getExchangeRate } from '../services/exchangeService.js';

const router = express.Router();

// Get exchange rate
router.get('/rate/:from/:to', async (req, res) => {
  try {
    const { from, to } = req.params;
    const rate = await getExchangeRate(from, to);
    
    res.json({ rate, from, to });
  } catch (error) {
    console.error('Exchange rate error:', error);
    res.status(500).json({ error: 'Failed to get exchange rate' });
  }
});

// Execute exchange
router.post('/execute', authenticateToken, async (req, res) => {
  try {
    const { fromCurrency, toCurrency, fromAmount } = req.body;
    const userId = req.user.userId;

    if (!fromCurrency || !toCurrency || !fromAmount || fromAmount <= 0) {
      return res.status(400).json({ error: 'Invalid exchange parameters' });
    }

    // Get current exchange rate
    const rate = await getExchangeRate(fromCurrency, toCurrency);
    const toAmount = fromAmount * rate;

    // Check user balance
    const fromWallet = await db.getAsync(
      'SELECT * FROM wallets WHERE user_id = ? AND currency = ?',
      [userId, fromCurrency]
    );

    if (!fromWallet || fromWallet.balance < fromAmount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    // Start transaction
    const transactionId = uuidv4();
    
    try {
      // Create transaction record
      await db.runAsync(
        `INSERT INTO transactions (id, user_id, type, from_currency, to_currency, from_amount, to_amount, rate, status)
         VALUES (?, ?, 'exchange', ?, ?, ?, ?, ?, 'pending')`,
        [transactionId, userId, fromCurrency, toCurrency, fromAmount, toAmount, rate]
      );

      // Update from wallet (subtract)
      await db.runAsync(
        'UPDATE wallets SET balance = balance - ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ? AND currency = ?',
        [fromAmount, userId, fromCurrency]
      );

      // Update to wallet (add) or create if doesn't exist
      const toWallet = await db.getAsync(
        'SELECT * FROM wallets WHERE user_id = ? AND currency = ?',
        [userId, toCurrency]
      );

      if (toWallet) {
        await db.runAsync(
          'UPDATE wallets SET balance = balance + ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ? AND currency = ?',
          [toAmount, userId, toCurrency]
        );
      } else {
        const walletId = uuidv4();
        await db.runAsync(
          'INSERT INTO wallets (id, user_id, currency, balance) VALUES (?, ?, ?, ?)',
          [walletId, userId, toCurrency, toAmount]
        );
      }

      // Mark transaction as completed
      await db.runAsync(
        'UPDATE transactions SET status = "completed", completed_at = CURRENT_TIMESTAMP WHERE id = ?',
        [transactionId]
      );

      res.json({
        message: 'Exchange completed successfully',
        transactionId,
        fromAmount,
        toAmount,
        rate
      });
    } catch (error) {
      // Mark transaction as failed
      await db.runAsync(
        'UPDATE transactions SET status = "failed" WHERE id = ?',
        [transactionId]
      );
      throw error;
    }
  } catch (error) {
    console.error('Exchange execution error:', error);
    res.status(500).json({ error: 'Exchange failed' });
  }
});

// Get exchange history
router.get('/history', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const transactions = await db.allAsync(
      `SELECT * FROM transactions 
       WHERE user_id = ? AND type = 'exchange' 
       ORDER BY created_at DESC 
       LIMIT 50`,
      [userId]
    );

    res.json(transactions);
  } catch (error) {
    console.error('Exchange history error:', error);
    res.status(500).json({ error: 'Failed to get exchange history' });
  }
});

export default router;