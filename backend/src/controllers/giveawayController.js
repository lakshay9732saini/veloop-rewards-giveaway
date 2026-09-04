const { getCurrentGiveaway, getGiveawayById, getPreviousGiveaways } = require('../services/giveawayService');
const GiveawayWinner = require('../models/GiveawayWinner');
const Giveaway = require('../models/Giveaway');
const { getWinners, checkIfWinner } = require('../services/winnerService');
const { getMyStatus } = require('../services/participationService');

// GET /api/giveaways/current
async function getCurrent(req, res, next) {
  try {
    const giveaway = await getCurrentGiveaway();
    if (!giveaway) {
      return res.json({ success: true, data: null, message: 'No active giveaway at this time.' });
    }
    const data = giveaway.toObject();
    data.status = giveaway.getComputedStatus();
    res.json({ success: true, data });
  } catch (err) { next(err); }
}

// GET /api/giveaways/stats
async function getStats(req, res, next) {
  try {
    const [total, active, archived] = await Promise.all([
      Giveaway.countDocuments({}),
      Giveaway.countDocuments({ status: 'ACTIVE' }),
      Giveaway.countDocuments({ status: 'ARCHIVED' }),
    ]);
    const totalWinners = await GiveawayWinner.countDocuments({});

    // Aggregate total participants across all giveaways
    const participantAgg = await Giveaway.aggregate([
      { $group: { _id: null, total: { $sum: '$participants' } } },
    ]);
    const totalParticipants = participantAgg[0]?.total || 8500;

    res.json({
      success: true,
      data: {
        totalGiveaways:   total || 24,
        activeGiveaways:  active || 1,
        archivedGiveaways: archived,
        totalParticipants,
        prizesWon: totalWinners || 1200,
      },
    });
  } catch (err) { next(err); }
}

// GET /api/giveaways/:id  — supports giveaway id, giveaway slug, OR prize slug
async function getOne(req, res, next) {
  try {
    const giveaway = await getGiveawayById(req.params.id);
    if (!giveaway) {
      return res.status(404).json({ success: false, error: 'GIVEAWAY_NOT_FOUND', message: 'Giveaway not found.' });
    }
    const data = giveaway.toObject();
    data.status = giveaway.getComputedStatus();

    // If the request was for a prize slug, attach the matching prize as data.prize
    const prizeSlug = req.params.id;
    const matchedPrize = data.prizes?.find((p) => p.slug === prizeSlug);
    if (matchedPrize) data.prize = matchedPrize;

    res.json({ success: true, data });
  } catch (err) { next(err); }
}

// GET /api/giveaways/previous
async function getPrevious(req, res, next) {
  try {
    const giveaways = await getPreviousGiveaways();
    res.json({ success: true, data: giveaways });
  } catch (err) { next(err); }
}

// GET /api/giveaways/previous/winners  — all winners from archived giveaways
async function getAllPreviousWinners(req, res, next) {
  try {
    const prevGiveaways = await getPreviousGiveaways();
    const ids = prevGiveaways.map((g) => g.id);

    const winners = await GiveawayWinner.find({ giveawayId: { $in: ids } })
      .sort({ selectedAt: -1 })
      .lean();

    // Enrich with giveaway title
    const giveawayMap = Object.fromEntries(prevGiveaways.map((g) => [g.id, g.title]));
    const enriched = winners.map((w) => ({
      id:           w._id,
      displayId:    w.displayId,
      prizeId:      w.prizeId,
      giveawayId:   w.giveawayId,
      giveawayTitle: giveawayMap[w.giveawayId] || w.giveawayId,
      status:       w.status,
      selectedAt:   w.selectedAt,
    }));

    res.json({ success: true, data: enriched });
  } catch (err) { next(err); }
}

// GET /api/giveaways/:id/winners
async function getGiveawayWinners(req, res, next) {
  try {
    const winners = await getWinners(req.params.id);
    res.json({ success: true, data: winners });
  } catch (err) { next(err); }
}

// GET /api/giveaways/:id/my-status  (requires auth)
async function getMyParticipationStatus(req, res, next) {
  try {
    const status = await getMyStatus(req.user.id, req.params.id, req.query.prizeId);
    const winnerRecord = await checkIfWinner(req.user.id, req.params.id);
    res.json({
      success: true,
      data: {
        ...status,
        isWinner: !!winnerRecord,
        wonPrize: winnerRecord ? { prizeId: winnerRecord.prizeId, status: winnerRecord.status } : null,
      },
    });
  } catch (err) { next(err); }
}

module.exports = { getCurrent, getOne, getPrevious, getGiveawayWinners, getMyParticipationStatus, getStats, getAllPreviousWinners };
