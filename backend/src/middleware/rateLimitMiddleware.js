const rateLimit = require('express-rate-limit');

// ── Join endpoint: strict limit ───────────────────────────────────────────────
const joinLimiter = rateLimit({
  windowMs: 60 * 1000,     // 1 minute
  max: 5,                   // 5 join attempts per minute per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'RATE_LIMITED',
    message: 'Too many requests. Please wait a moment before trying again.',
  },
});

// ── Claim endpoint: moderate limit ───────────────────────────────────────────
const claimLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'RATE_LIMITED',
    message: 'Too many requests. Please wait a moment before trying again.',
  },
});

// ── General API limit ─────────────────────────────────────────────────────────
const generalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'RATE_LIMITED', message: 'Too many requests.' },
});

module.exports = { joinLimiter, claimLimiter, generalLimiter };
