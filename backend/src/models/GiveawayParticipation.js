const mongoose = require('mongoose');

const GiveawayParticipationSchema = new mongoose.Schema({
  userId:        { type: String, required: true },
  giveawayId:    { type: String, required: true },
  prizeId:       { type: String, required: true },
  entryCurrency: { type: String, required: true },
  entryAmount:   { type: Number, required: true },
  deviceHash:    { type: String },   // privacy-conscious device identifier
  ipHash:        { type: String },   // hashed IP for abuse detection
  status: {
    type: String,
    enum: ['ACTIVE', 'DISQUALIFIED', 'FLAGGED'],
    default: 'ACTIVE',
  },
  transactionId: String,
  joinedAt:      { type: Date, default: Date.now },
}, { timestamps: true });

// ── Compound unique index: one participation per user per giveaway ─────────────
// This is the database-level guarantee against duplicates.
GiveawayParticipationSchema.index({ userId: 1, giveawayId: 1 }, { unique: true });

// Also track device per giveaway to flag same-device abuse
GiveawayParticipationSchema.index({ deviceHash: 1, giveawayId: 1 });

module.exports = mongoose.model('GiveawayParticipation', GiveawayParticipationSchema);
