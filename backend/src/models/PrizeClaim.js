const mongoose = require('mongoose');

const PrizeClaimSchema = new mongoose.Schema({
  claimId:    { type: String, required: true, unique: true },
  userId:     { type: String, required: true },
  giveawayId: { type: String, required: true },
  prizeId:    { type: String, required: true },
  winnerId:   { type: String, required: true }, // GiveawayWinner._id
  prizeType:  { type: String, enum: ['PHYSICAL', 'GIFT_CARD', 'DIGITAL'] },

  // Physical delivery fields (stored encrypted in production)
  deliveryDetails: {
    fullName:  String,
    phone:     String,
    address:   String,
    city:      String,
    state:     String,
    pin:       String,
  },

  // Gift card fields
  email: String,

  status: {
    type: String,
    enum: ['SUBMITTED', 'PROCESSING', 'COMPLETED', 'EXPIRED'],
    default: 'SUBMITTED',
  },
  submittedAt: { type: Date, default: Date.now },
  processedAt: Date,
}, { timestamps: true });

// One claim per winner per giveaway
PrizeClaimSchema.index({ userId: 1, giveawayId: 1, prizeId: 1 }, { unique: true });

module.exports = mongoose.model('PrizeClaim', PrizeClaimSchema);
