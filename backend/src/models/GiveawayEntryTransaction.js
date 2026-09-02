const mongoose = require('mongoose');

const GiveawayEntryTransactionSchema = new mongoose.Schema({
  transactionId:  { type: String, required: true, unique: true },
  userId:         { type: String, required: true },
  giveawayId:     { type: String, required: true },
  prizeId:        { type: String, required: true },
  currency:       { type: String, required: true },
  amount:         { type: Number, required: true },
  type:           { type: String, enum: ['ENTRY_FEE', 'REVERSAL'], default: 'ENTRY_FEE' },
  status:         { type: String, enum: ['PENDING', 'SUCCESS', 'FAILED', 'REVERSED'], default: 'PENDING' },
  balanceBefore:  { type: Number, required: true },
  balanceAfter:   { type: Number, required: true },
  relatedTransactionId: String, // for reversals
  createdAt:      { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('GiveawayEntryTransaction', GiveawayEntryTransactionSchema);
