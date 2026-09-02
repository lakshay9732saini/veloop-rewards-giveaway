const mongoose = require('mongoose');

const PrizeSchema = new mongoose.Schema({
  id:             { type: String, required: true },
  name:           { type: String, required: true },
  slug:           { type: String, required: true },
  position:       { type: Number, required: true },
  label:          String,
  image:          String,
  description:    String,
  shortDesc:      String,
  prizeValue:     String,
  type:           { type: String, enum: ['PHYSICAL', 'GIFT_CARD', 'DIGITAL'], required: true },
  claimType:      { type: String, enum: ['physical_form', 'gift_card_form', 'digital_form'] },
  winnerCount:    { type: Number, default: 1 },
  entryCurrency:  { type: String, enum: ['VEs', 'SVEs', 'Tokens'], required: true },
  entryFee:       { type: Number, required: true, min: 0 },
  badge:          String,
}, { _id: false });

const GiveawaySchema = new mongoose.Schema({
  id:          { type: String, required: true, unique: true },
  title:       { type: String, required: true },
  slug:        { type: String, required: true, unique: true },
  description: String,
  status: {
    type: String,
    enum: ['UPCOMING', 'ACTIVE', 'ENDED', 'ARCHIVED'],
    default: 'UPCOMING',
  },
  startAt:    { type: Date, required: true },
  endAt:      { type: Date, required: true },
  prizes:     [PrizeSchema],
  participants: { type: Number, default: 0 },
  totalEntries: { type: Number, default: 0 },
  rules:        [String],
  eligibility:  [String],
  participationSettings: {
    allowMultipleEntries: { type: Boolean, default: false },
    maxEntriesPerUser:    { type: Number, default: 1 },
  },
  winnerAnnouncementDate: Date,
  claimDeadlineDays: { type: Number, default: 7 },
}, { timestamps: true });

// Compute status from dates at runtime
GiveawaySchema.methods.getComputedStatus = function () {
  const now = new Date();
  if (this.status === 'ARCHIVED') return 'ARCHIVED';
  if (now < this.startAt) return 'UPCOMING';
  if (now > this.endAt) return 'ENDED';
  return 'ACTIVE';
};

module.exports = mongoose.model('Giveaway', GiveawaySchema);
