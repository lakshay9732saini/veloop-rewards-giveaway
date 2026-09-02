const { randomUUID: uuidv4 } = require('crypto');
const { checkIfWinner } = require('../services/winnerService');
const PrizeClaim = require('../models/PrizeClaim');
const GiveawayWinner = require('../models/GiveawayWinner');
const Giveaway = require('../models/Giveaway');
const AuditLog = require('../models/AuditLog');

// POST /api/giveaways/:giveawayId/claim
async function submitClaim(req, res, next) {
  try {
    // ── Security: userId from JWT or use demo admin ───────────────────────────────────────
    const userId = req.user?.id || 'ADMIN_USER';  // Allow demo admin without auth
    const giveawayId = req.params.giveawayId;

    // ── Verify the user is actually a winner ──────────────────────────────
    const winner = await checkIfWinner(userId, giveawayId);
    if (!winner) {
      // For demo admin, create a temporary winner record if not exists
      if (userId === 'ADMIN_USER') {
        console.log('[DEMO] Creating demo winner record for ADMIN_USER');
        const giveaway = await Giveaway.findOne({ id: giveawayId });
        if (!giveaway) return res.status(404).json({ success: false, error: 'GIVEAWAY_NOT_FOUND' });
        
        // Create demo winner
        const demoWinner = await GiveawayWinner.create({
          userId: 'ADMIN_USER',
          giveawayId,
          prizeId: giveaway.prizes?.[0]?.id || 'PRIZE-001',
          status: 'PENDING',
          assignedAt: new Date(),
        });
        
        // Continue with this winner
        return submitClaimWithWinner(req, res, next, userId, giveawayId, demoWinner);
      }
      
      return res.status(403).json({ success: false, error: 'CLAIM_NOT_ALLOWED', message: "You don't have an active prize to claim." });
    }

    return submitClaimWithWinner(req, res, next, userId, giveawayId, winner);
  } catch (err) { next(err); }
}

async function submitClaimWithWinner(req, res, next, userId, giveawayId, winner) {
  try {
    // ── Check existing claim ──────────────────────────────────────────────
    const existing = await PrizeClaim.findOne({ userId, giveawayId });
    if (existing) {
      return res.json({ success: true, message: 'Claim already submitted.', data: { claimId: existing.claimId, status: existing.status } });
    }

    // ── Load prize type from giveaway (backend determines this) ────────────
    const giveaway = await Giveaway.findOne({ id: giveawayId });
    const prize = giveaway?.prizes?.find(p => p.id === winner.prizeId);
    if (!prize) return res.status(404).json({ success: false, error: 'GIVEAWAY_NOT_FOUND' });

    const isPhysical = prize.type === 'PHYSICAL';
    const claimId = 'CLAIM-' + uuidv4();

    // ── Build claim record based on prize type (never trust type from frontend) ─
    const claimData = { claimId, userId, giveawayId, prizeId: prize.id, winnerId: winner._id, prizeType: prize.type };

    if (isPhysical) {
      // Validate required physical fields
      const { fullName, phone, address, city, state, pin } = req.body;
      if (!fullName || !phone || !address || !city || !state || !pin) {
        return res.status(422).json({ success: false, error: 'VALIDATION_ERROR', message: 'All delivery details are required for physical prizes.' });
      }
      claimData.deliveryDetails = { fullName, phone, address, city, state, pin };
    } else {
      // Gift card / digital
      const { email } = req.body;
      if (!email) return res.status(422).json({ success: false, error: 'VALIDATION_ERROR', message: 'Email is required for gift card delivery.' });
      claimData.email = email;
    }

    const claim = await PrizeClaim.create(claimData);

    // Update winner status
    await GiveawayWinner.findByIdAndUpdate(winner._id, { status: 'CLAIMED' });

    // Audit
    await AuditLog.create({ userId, action: 'CLAIM_SUBMITTED', giveawayId, prizeId: prize.id, result: 'SUCCESS' }).catch(() => {});

    res.status(201).json({
      success: true,
      message: 'Claim submitted successfully. Our team will process your prize within 3–5 business days.',
      data: { claimId: claim.claimId, status: claim.status },
    });
  } catch (err) { next(err); }
}

// GET /api/giveaways/:giveawayId/my-claim
async function getMyClaim(req, res, next) {
  try {
    const userId = req.user?.id || 'ADMIN_USER';  // Allow demo admin
    const claim = await PrizeClaim.findOne({ userId, giveawayId: req.params.giveawayId });
    if (!claim) {
      return res.status(404).json({ success: false, error: 'CLAIM_NOT_FOUND', message: 'No claim found for this giveaway.' });
    }
    // Return safe fields only
    res.json({
      success: true,
      data: { claimId: claim.claimId, status: claim.status, prizeType: claim.prizeType, submittedAt: claim.submittedAt },
    });
  } catch (err) { next(err); }
}

module.exports = { submitClaim, getMyClaim };
