/**
 * balanceService.js
 *
 * Manages user wallet balance operations.
 *
 * IMPORTANT: This is a stub implementation for the giveaway module.
 * In production, this service should integrate with the authoritative
 * VELOOP Rewards wallet/balance system.
 *
 * The getBalance and deductBalance functions are the integration points
 * to connect with the real balance backend.
 */

// ── Mock balances (replace with real DB queries) ──────────────────────────────
// Maps userId -> { VEs, SVEs, Tokens }
const mockBalances = {
  'VE10025': { VEs: 850, SVEs: 1200, Tokens: 3500 },
  'VE10026': { VEs: 100, SVEs: 200, Tokens: 500 },
  'ADMIN_USER': { VEs: 1000, SVEs: 1500, Tokens: 5000 }, // Admin demo user
};

/**
 * Get user's current balance for a specific currency.
 * @param {string} userId
 * @param {string} currency  - 'VEs' | 'SVEs' | 'Tokens'
 * @returns {number}
 */
async function getBalance(userId, currency) {
  // Real: query the user wallet from DB
  const wallet = mockBalances[userId];
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
  const balanceBefore = await getBalance(userId, currency);

  if (balanceBefore < amount) {
    throw new Error(`INSUFFICIENT_${currency.toUpperCase().replace('ES', '_BALANCE').replace('OKENS', '_BALANCE')}`);
  }

  // Real: atomic $inc update inside the mongoose session
  // await User.findOneAndUpdate({ _id: userId }, { $inc: { [`wallet.${currency}`]: -amount } }, { session });
  const balanceAfter = balanceBefore - amount;

  // Mock update
  if (mockBalances[userId]) {
    mockBalances[userId][currency] = balanceAfter;
  }

  return { balanceBefore, balanceAfter };
}

module.exports = { getBalance, checkBalance, deductBalance };
