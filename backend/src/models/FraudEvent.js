const mongoose = require('mongoose');

const FraudEventSchema = new mongoose.Schema({
  userId:     String,
  giveawayId: String,
  deviceHash: String,
  ipHash:     String,
  riskScore:  { type: Number, min: 0, max: 100, default: 0 },
  // LOW (0-29) | MEDIUM (30-59) | HIGH (60-79) | CRITICAL (80-100)
  riskLevel: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
    default: 'LOW',
  },
  reason:  String,
  signals: [String], // list of triggered fraud signals
  action: {
    type: String,
    enum: ['FLAGGED', 'BLOCKED', 'REVIEWED', 'CLEARED'],
    default: 'FLAGGED',
  },
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('FraudEvent', FraudEventSchema);
