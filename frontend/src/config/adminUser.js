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
    [CURRENCY.VE]: 1000,
    [CURRENCY.SVE]: 1500,
    [CURRENCY.TOKEN]: 5000,
    // Legacy keys for compatibility
    VEs: 1000,
    SVEs: 1500,
    Tokens: 5000
  },
  entries: 0,
  userState: 'visitor', // Allows joining prizes
  wonPrize: null, // Can be set dynamically if user wins
};

export default ADMIN_USER;
