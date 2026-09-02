/**
 * fraudService.js
 * Evaluates participation requests for suspicious signals.
 * Risk score 0–100. Classifications: LOW | MEDIUM | HIGH | CRITICAL
 *
 * NOTE: This is a foundational implementation.
 * The scoring model should be reviewed and tuned with actual data
 * before production deployment.
 */

const crypto = require('crypto');
const FraudEvent = require('../models/FraudEvent');
const GiveawayParticipation = require('../models/GiveawayParticipation');

// ── Helpers ──────────────────────────────────────────────────────────────────

function classify(score) {
  if (score >= 80) return 'CRITICAL';
  if (score >= 60) return 'HIGH';
  if (score >= 30) return 'MEDIUM';
  return 'LOW';
}

/**
 * Hash a value (IP, device string) for storage — never store raw.
 */
function hashSignal(value) {
  if (!value) return null;
  return crypto.createHash('sha256').update(String(value)).digest('hex').slice(0, 32);
}

/**
 * Evaluate a join request for fraud signals.
 * Returns { riskScore, riskLevel, signals, action, deviceHash, ipHash }
 */
async function evaluateParticipation({ userId, giveawayId, rawIp, userAgent }) {
  const signals   = [];
  let riskScore   = 0;

  const deviceHash = hashSignal(userAgent);
  const ipHash     = hashSignal(rawIp);

  // ── Signal 1: Same device already participated in this giveaway ────────────
  if (deviceHash) {
    const deviceMatch = await GiveawayParticipation.findOne({ deviceHash, giveawayId, userId: { $ne: userId } });
    if (deviceMatch) {
      signals.push('SAME_DEVICE_DIFFERENT_USER');
      riskScore += 30;
    }
  }

  // ── Signal 2: Same IP (hashed) already has multiple entries ───────────────
  if (ipHash) {
    const ipCount = await GiveawayParticipation.countDocuments({ ipHash, giveawayId, userId: { $ne: userId } });
    if (ipCount >= 3) {
      signals.push('HIGH_IP_PARTICIPATION');
      riskScore += 20;
    } else if (ipCount >= 1) {
      signals.push('SHARED_IP_PARTICIPATION');
      riskScore += 10;
    }
  }

  // ── Additional signals can be added here as the platform evolves ──────────
  // e.g., account age, velocity checks, behavioral patterns

  const riskLevel = classify(riskScore);

  // Determine action
  let action = 'NONE';
  if (riskLevel === 'CRITICAL') {
    action = 'BLOCKED';
  } else if (riskLevel === 'HIGH' || riskLevel === 'MEDIUM') {
    action = 'FLAGGED';
  }

  // Log significant events
  if (riskScore > 0) {
    await FraudEvent.create({
      userId,
      giveawayId,
      deviceHash,
      ipHash,
      riskScore,
      riskLevel,
      reason: signals.join(', '),
      signals,
      action,
    }).catch(() => {}); // Non-blocking — fraud log failure should not break the join flow
  }

  return { riskScore, riskLevel, signals, action, deviceHash, ipHash };
}

module.exports = { evaluateParticipation, hashSignal };
