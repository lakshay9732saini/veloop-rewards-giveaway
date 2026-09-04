const { randomUUID: uuidv4 } = require('crypto');
const { joinGiveaway } = require('../services/participationService');
const UserBalance = require('../models/UserBalance');

// POST /api/giveaways/:id/join
async function join(req, res, next) {
  try {
    const demoUserId = req.headers['x-demo-user-id'];
    const userId = req.user?.id || (
      process.env.NODE_ENV !== 'production' && /^DEMO_[A-Za-z0-9_-]+$/.test(demoUserId || '')
        ? demoUserId
        : 'ADMIN_USER'
    );
    const giveawayId = req.body.giveawayId;
    const prizeId    = req.body.prizeId;

    if (userId !== 'ADMIN_USER') {
      await UserBalance.findOneAndUpdate(
        { userId },
        { $setOnInsert: { userId, VEs: 10000, SVEs: 5000, Tokens: 50000, isInitialized: true } },
        { upsert: true, setDefaultsOnInsert: true }
      );
    }

    // Idempotency: client should send a unique request ID per join attempt
    const requestId = req.headers['x-idempotency-key'] || uuidv4();

    const reqContext = {
      ip: req.ip || req.connection?.remoteAddress,
      userAgent: req.headers['user-agent'],
    };

    const result = await joinGiveaway({ userId, giveawayId, prizeId, requestId, reqContext });

    if (result.alreadyProcessed) {
      return res.json({
        success: true,
        message: 'Participation already recorded.',
        data: { participationId: result.transaction.transactionId },
      });
    }

    res.status(201).json({
      success: true,
      message: "You're in! Your entry has been successfully recorded.",
      data: {
        participationId: result.participation._id,
        transactionId: result.transactionId,
        giveawayId,
        balanceAfter: result.transaction.balanceAfter,
        currency: result.transaction.currency,
      },
    });
  } catch (err) { next(err); }
}

module.exports = { join };
