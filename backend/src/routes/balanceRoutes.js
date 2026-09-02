const express = require('express');
const router = express.Router();
const { getWalletBalance } = require('../services/balanceService');

// GET /api/balance/:userId
router.get('/:userId', async (req, res, next) => {
  try {
    const { userId } = req.params;
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
