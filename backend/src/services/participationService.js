/**
 * participationService.js
 * Handles the core participation logic with fraud protection and atomic transactions.
 */

const { randomUUID: uuidv4 } = require('crypto');
const mongoose = require('mongoose');
const Giveaway = require('../models/Giveaway');
const GiveawayParticipation = require('../models/GiveawayParticipation');
const GiveawayEntryTransaction = require('../models/GiveawayEntryTransaction');
const AuditLog = require('../models/AuditLog');
const { checkBalance, deductBalance } = require('./balanceService');
const { evaluateParticipation } = require('./fraudService');

/**
 * Join a giveaway.
 *
 * Security principles:
 * 1. Backend determines the fee — frontend amount is NEVER trusted.
 * 2. Backend determines the currency from the prize config.
 * 3. Atomic: balance deduction + participation creation succeed or fail together.
 * 4. Database unique index prevents race-condition duplicates.
 * 5. Idempotency key prevents double-submission from rapid clicking.
 *
 * @param {string} userId       - from JWT (never from request body)
 * @param {string} giveawayId   - from request body
 * @param {string} prizeId      - from request body
 * @param {string} requestId    - idempotency key
 * @param {object} reqContext   - { ip, userAgent } for fraud signals
 */
async function joinGiveaway({ userId, giveawayId, prizeId, requestId, reqContext }) {
  // ── 1. Idempotency check ────────────────────────────────────────────────────
  const existingTx = await GiveawayEntryTransaction.findOne({ transactionId: requestId });
  if (existingTx && existingTx.status === 'SUCCESS') {
    return { alreadyProcessed: true, transaction: existingTx };
  }

  // ── 2. Load & validate giveaway ─────────────────────────────────────────────
  const giveaway = await Giveaway.findOne({ id: giveawayId });
  if (!giveaway) throw Object.assign(new Error('Giveaway not found'), { code: 'GIVEAWAY_NOT_FOUND' });

  const now = new Date();
  const computedStatus = giveaway.getComputedStatus();
  if (computedStatus !== 'ACTIVE') {
    throw Object.assign(new Error('Giveaway not active'), {
      code: computedStatus === 'ENDED' ? 'GIVEAWAY_ENDED' : 'GIVEAWAY_NOT_ACTIVE',
    });
  }

  // ── 3. Validate prize exists in giveaway ─────────────────────────────────
  const prize = giveaway.prizes.find(p => p.id === prizeId);
  if (!prize) throw Object.assign(new Error('Prize not found'), { code: 'GIVEAWAY_NOT_FOUND' });

  // ── 4. Check existing participation ──────────────────────────────────────
  const existing = await GiveawayParticipation.findOne({ userId, giveawayId });
  if (existing) throw Object.assign(new Error('Already participating'), { code: 'ALREADY_PARTICIPATING' });

  // ── 5. Fraud evaluation ───────────────────────────────────────────────────
  const fraudResult = await evaluateParticipation({
    userId, giveawayId,
    rawIp: reqContext?.ip,
    userAgent: reqContext?.userAgent,
  });

  if (fraudResult.action === 'BLOCKED') {
    await AuditLog.create({ userId, action: 'FRAUD_FLAGGED', giveawayId, result: 'BLOCKED', requestId, metadata: fraudResult });
    throw Object.assign(new Error('Participation blocked'), { code: 'PARTICIPATION_BLOCKED' });
  }

  // ── 6. Balance check (backend determines fee from prize config) ───────────
  const { sufficient, balance } = await checkBalance(userId, prize.entryCurrency, prize.entryFee);
  if (!sufficient) {
    const currencyCode = prize.entryCurrency.toUpperCase().replace('ES', '').replace('OKENS', '');
    throw Object.assign(new Error('Insufficient balance'), {
      code: `INSUFFICIENT_${currencyCode === 'V' ? 'VE' : currencyCode === 'SV' ? 'SVE' : 'TOKEN'}_BALANCE`,
      required: prize.entryFee,
      available: balance,
      currency: prize.entryCurrency,
    });
  }

  // ── 7. Atomic transaction ─────────────────────────────────────────────────
  const transactionId = requestId || uuidv4();
  const session = mongoose.connection.readyState === 1 ? await mongoose.startSession() : null;

  try {
    if (session) session.startTransaction();

    // 7a. Deduct balance
    const { balanceBefore, balanceAfter } = await deductBalance(session, userId, prize.entryCurrency, prize.entryFee);

    // 7b. Create participation record
    const participation = await GiveawayParticipation.create([{
      userId, giveawayId,
      prizeId: prize.id,
      entryCurrency: prize.entryCurrency,
      entryAmount: prize.entryFee,
      deviceHash: fraudResult.deviceHash,
      ipHash: fraudResult.ipHash,
      transactionId,
      status: fraudResult.riskLevel === 'MEDIUM' ? 'FLAGGED' : 'ACTIVE',
    }], { session });

    // 7c. Create transaction record
    const transaction = await GiveawayEntryTransaction.create([{
      transactionId,
      userId, giveawayId,
      prizeId: prize.id,
      currency: prize.entryCurrency,
      amount: prize.entryFee,
      type: 'ENTRY_FEE',
      status: 'SUCCESS',
      balanceBefore,
      balanceAfter,
    }], { session });

    if (session) await session.commitTransaction();

    // 7d. Audit log
    await AuditLog.create({
      userId, action: 'JOIN_GIVEAWAY',
      giveawayId, prizeId: prize.id,
      amount: prize.entryFee,
      currency: prize.entryCurrency,
      result: 'SUCCESS',
      requestId: transactionId,
    }).catch(() => {});

    return { participation: participation[0], transaction: transaction[0], transactionId };

  } catch (err) {
    if (session) await session.abortTransaction().catch(() => {});

    // Handle DB-level duplicate key (race condition) as already participating
    if (err.code === 11000) {
      throw Object.assign(new Error('Already participating'), { code: 'ALREADY_PARTICIPATING' });
    }
    throw err;
  } finally {
    if (session) session.endSession();
  }
}

/**
 * Get user's participation status for a giveaway.
 */
async function getMyStatus(userId, giveawayId) {
  const participation = await GiveawayParticipation.findOne({ userId, giveawayId });
  return {
    isParticipating: !!participation,
    joinedAt: participation?.joinedAt,
    status: participation?.status,
  };
}

module.exports = { joinGiveaway, getMyStatus };
