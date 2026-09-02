const mongoose = require('mongoose');

const GiveawayWinnerSchema = new mongoose.Schema({
  giveawayId:      { type: String, required: true },
  prizeId:         { type: String, required: true },
  userId:          { type: String, required: true },
  selectionMethod: { type: String, default: 'RANDOM_DRAW' },
  selectedAt:      { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ['PENDING_CLAIM', 'CLAIMED', 'PROCESSING', 'DELIVERED', 'EXPIRED'],
    default: 'PENDING_CLAIM',
  },
  displayId: String, // masked user ID for public display e.g. VE****42
}, { timestamps: true });

// Prevent duplicate winner records for same prize in same giveaway
GiveawayWinnerSchema.index({ giveawayId: 1, prizeId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('GiveawayWinner', GiveawayWinnerSchema);
