import { CURRENCY } from '../data/giveawayData';

/**
 * Admin user configuration - used throughout the app
 * Single source of truth for admin mode
 */
export const ADMIN_USER = {
  id: 'ADMIN_USER',
  displayId: 'VE****99',
  name: 'Admin',
  email: 'admin@veloop.com',
  balance: {
    [CURRENCY.VE]: 10000,
    [CURRENCY.SVE]: 5000,
    [CURRENCY.TOKEN]: 50000,
    // Legacy keys for compatibility
    VEs: 10000,
    SVEs: 5000,
    Tokens: 50000
  },
  entries: 0,
  userState: 'visitor', // Allows joining prizes
  wonPrize: null, // Can be set dynamically if user wins
};

export default ADMIN_USER;
