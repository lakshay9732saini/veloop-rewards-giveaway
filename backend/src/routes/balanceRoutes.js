const express = require('express');
const router = express.Router();
const { getWalletBalance } = require('../services/balanceService');
const { authenticate } = require('../middleware/authMiddleware');

// GET /api/balance/:userId
router.get('/:userId', authenticate, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const balance = await getWalletBalance(userId);
    
    res.json({
      success: true,
      data: {
        userId,
        balance,
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
