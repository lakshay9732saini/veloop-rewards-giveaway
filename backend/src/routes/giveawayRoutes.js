const express = require('express');
const router  = express.Router();
const { authenticate, optionalAuth } = require('../middleware/authMiddleware');
const { joinLimiter, claimLimiter } = require('../middleware/rateLimitMiddleware');
const { validateJoin }   = require('../validators/giveawayValidators');
const {
  getCurrent, getOne, getPrevious, getStats,
  getGiveawayWinners, getMyParticipationStatus,
  getAllPreviousWinners,
} = require('../controllers/giveawayController');
const { join }                    = require('../controllers/participationController');
const { submitClaim, getMyClaim } = require('../controllers/claimController');

// ── IMPORTANT: specific static routes BEFORE dynamic /:id routes ──────────────

// Public — static routes first
router.get('/current',          getCurrent);
router.get('/stats',            getStats);
router.get('/previous',         getPrevious);
router.get('/previous/winners', getAllPreviousWinners);

// Public — dynamic routes
router.get('/:id',         getOne);
router.get('/:id/winners', getGiveawayWinners);

// Authenticated routes (optional auth for demo)
router.get('/:id/my-status',        authenticate, getMyParticipationStatus);

// Join and claim routes - allow without auth for admin demo mode
router.post('/:id/join',            optionalAuth, joinLimiter, validateJoin, join);
router.post('/:giveawayId/claim',   authenticate, claimLimiter, submitClaim);
router.get('/:giveawayId/my-claim', authenticate, getMyClaim);

module.exports = router;
