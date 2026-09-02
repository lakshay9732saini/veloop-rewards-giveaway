/**
 * winnerService.js
 * Backend-controlled winner selection. Never trust frontend for this.
 */

const { v4: uuidv4 } = require('uuid');
const Giveaway = require('../models/Giveaway');
const GiveawayParticipation = require('../models/GiveawayParticipation');
const GiveawayWinner = require('../models/GiveawayWinner');
const AuditLog = require('../models/AuditLog');

/**
 * Mask user ID for public display: VE10025 → VE****25
 */
function maskUserId(userId) {
  if (!userId || userId.length < 4) return '****';
  return userId.slice(0, 2) + '****' + userId.slice(-2);
}

/**
 * Randomly select winners for all prizes in a giveaway.
 * Enforces winnerCount per prize.
 *
 * @param {string} giveawayId
 * @returns {Array} winner records created
 */
async function selectWinners(giveawayId) {
  const giveaway = await Giveaway.findOne({ id: giveawayId });
  if (!giveaway) throw new Error('Giveaway not found');
  if (giveaway.getComputedStatus() !== 'ENDED') throw new Error('Giveaway has not ended yet');

  const allParticipants = await GiveawayParticipation.find({
    giveawayId,
    status: 'ACTIVE', // exclude flagged
  }).lean();

  const winnerRecords = [];

  for (const prize of giveaway.prizes) {
    const eligible = allParticipants.filter(p => p.prizeId === prize.id);
    const count = Math.min(prize.winnerCount, eligible.length);

    // Fisher-Yates shuffle then take top `count`
    const shuffled = [...eligible];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    const selected = shuffled.slice(0, count);

    for (const participant of selected) {
      try {
        const winner = await GiveawayWinner.create({
          giveawayId,
          prizeId: prize.id,
          userId: participant.userId,
          displayId: maskUserId(participant.userId),
          selectionMethod: 'RANDOM_DRAW',
        });
        winnerRecords.push(winner);

        await AuditLog.create({
          userId: participant.userId,
          action: 'WINNER_SELECTED',
          giveawayId,
          prizeId: prize.id,
          result: 'SUCCESS',
        }).catch(() => {});
      } catch (err) {
        if (err.code !== 11000) throw err; // ignore duplicate winner
      }
    }
  }

  // Update giveaway status to ARCHIVED after winners selected
  await Giveaway.updateOne({ id: giveawayId }, { status: 'ARCHIVED' });

  return winnerRecords;
}

/**
 * Get public winner list for a giveaway.
 */
async function getWinners(giveawayId) {
  const winners = await GiveawayWinner.find({ giveawayId }).lean();
  // Return only safe public fields
  return winners.map(w => ({
    id: w._id,
    displayId: w.displayId || maskUserId(w.userId),
    prizeId: w.prizeId,
    giveawayId: w.giveawayId,
    status: w.status,
    selectedAt: w.selectedAt,
  }));
}

/**
 * Check if a specific user is a winner in a giveaway.
 * Returns winner record or null.
 */
async function checkIfWinner(userId, giveawayId) {
  return GiveawayWinner.findOne({ userId, giveawayId });
}

module.exports = { selectWinners, getWinners, checkIfWinner, maskUserId };
