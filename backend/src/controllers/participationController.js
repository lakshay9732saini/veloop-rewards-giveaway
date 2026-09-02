const { randomUUID: uuidv4 } = require('crypto');
const { joinGiveaway } = require('../services/participationService');

// POST /api/giveaways/:id/join
async function join(req, res, next) {
  try {
    // userId comes from JWT OR use demo admin for testing
    const userId = req.user?.id || 'ADMIN_USER';
    const giveawayId = req.body.giveawayId;
    const prizeId    = req.body.prizeId;

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
      },
    });
  } catch (err) { next(err); }
}

module.exports = { join };
