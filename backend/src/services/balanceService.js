/**
 * balanceService.js
 *
 * Manages user wallet balance operations.
 */

const UserBalance = require('../models/UserBalance');

/**
 * Get user's current balance for a specific currency.
 * @param {string} userId
 * @param {string} currency  - 'VEs' | 'SVEs' | 'Tokens'
 * @returns {number}
 */
async function getBalance(userId, currency) {
  const wallet = await UserBalance.findOne({ userId });
  if (!wallet) return 0;
  return wallet[currency] || 0;
}

/**
 * Check if user has enough balance for the entry fee.
 * Returns { sufficient: boolean, balance: number }
 */
async function checkBalance(userId, currency, required) {
  const balance = await getBalance(userId, currency);
  return { sufficient: balance >= required, balance };
}

/**
 * Atomically deduct entry fee from user balance.
 * Must be called inside a DB transaction in production.
 *
 * @param {object} session - mongoose session (for atomic transactions)
 * @param {string} userId
 * @param {string} currency
 * @param {number} amount
 * @returns {{ balanceBefore, balanceAfter }}
 */
async function deductBalance(session, userId, currency, amount) {
  const wallet = await UserBalance.findOne({ userId });
  
  if (!wallet) {
    throw new Error('WALLET_NOT_FOUND');
  }

  const balanceBefore = wallet[currency] || 0;

  if (balanceBefore < amount) {
    throw new Error(`INSUFFICIENT_${currency.toUpperCase()}_BALANCE`);
  }

  // Atomic update with session
  const update = { $inc: {} };
  update.$inc[currency] = -amount;
  
  await UserBalance.findOneAndUpdate(
    { userId },
    update,
    { session, new: true }
  );

  const balanceAfter = balanceBefore - amount;

  return { balanceBefore, balanceAfter };
}

/**
 * Get complete wallet balance for a user
 */
async function getWalletBalance(userId) {
  const wallet = await UserBalance.findOne({ userId });
  if (!wallet) {
    return { VEs: 0, SVEs: 0, Tokens: 0 };
  }
  return {
    VEs: wallet.VEs || 0,
    SVEs: wallet.SVEs || 0,
    Tokens: wallet.Tokens || 0,
  };
}

module.exports = { getBalance, checkBalance, deductBalance, getWalletBalance };
