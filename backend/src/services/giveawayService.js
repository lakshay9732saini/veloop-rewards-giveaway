/**
 * giveawayService.js
 * Business logic for fetching giveaway data.
 */

const Giveaway = require('../models/Giveaway');

/**
 * Get the current active giveaway.
 * Returns null if none found.
 */
async function getCurrentGiveaway() {
  const now = new Date();
  return Giveaway.findOne({
    status: { $in: ['ACTIVE', 'ENDED'] },
    startAt: { $lte: now },
  }).sort({ startAt: -1 });
}

/**
 * Get giveaway by ID or slug.
 * Also supports finding by prize slug — returns the giveaway that contains the prize.
 */
async function getGiveawayById(idOrSlug) {
  // Try direct giveaway id/slug first
  const direct = await Giveaway.findOne({ $or: [{ id: idOrSlug }, { slug: idOrSlug }] });
  if (direct) return direct;

  // Fall back: look for a prize slug inside the current/active giveaway
  return Giveaway.findOne({
    'prizes.slug': idOrSlug,
    status: { $in: ['ACTIVE', 'ENDED', 'UPCOMING'] },
  });
}

/**
 * Get all previous (archived) giveaways.
 */
async function getPreviousGiveaways() {
  return Giveaway.find({ status: 'ARCHIVED' }).sort({ endAt: -1 });
}

/**
 * Get the upcoming giveaway.
 */
async function getUpcomingGiveaway() {
  const now = new Date();
  return Giveaway.findOne({ status: 'UPCOMING', startAt: { $gt: now } }).sort({ startAt: 1 });
}

module.exports = { getCurrentGiveaway, getGiveawayById, getPreviousGiveaways, getUpcomingGiveaway };
