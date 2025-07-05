import { db } from '../database/init.js';

export const getExchangeRate = async (fromCurrency, toCurrency) => {
  try {
    if (fromCurrency === toCurrency) {
      return 1;
    }

    // Try to get rate from database
    const rate = await db.getAsync(
      'SELECT rate FROM exchange_rates WHERE from_currency = ? AND to_currency = ?',
      [fromCurrency, toCurrency]
    );

    if (rate) {
      return rate.rate;
    }

    // If not found, try reverse rate
    const reverseRate = await db.getAsync(
      'SELECT rate FROM exchange_rates WHERE from_currency = ? AND to_currency = ?',
      [toCurrency, fromCurrency]
    );

    if (reverseRate) {
      return 1 / reverseRate.rate;
    }

    // Fallback: calculate via USD (assuming USDT as base)
    const fromToUsd = await db.getAsync(
      'SELECT rate FROM exchange_rates WHERE from_currency = ? AND to_currency = "USDT"',
      [fromCurrency]
    );

    const toToUsd = await db.getAsync(
      'SELECT rate FROM exchange_rates WHERE from_currency = ? AND to_currency = "USDT"',
      [toCurrency]
    );

    if (fromToUsd && toToUsd) {
      return fromToUsd.rate / toToUsd.rate;
    }

    // Final fallback - return 1 (should not happen in production)
    console.warn(`No exchange rate found for ${fromCurrency} to ${toCurrency}`);
    return 1;
  } catch (error) {
    console.error('Exchange rate calculation error:', error);
    throw error;
  }
};