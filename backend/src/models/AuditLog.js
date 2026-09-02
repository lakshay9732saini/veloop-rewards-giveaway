const mongoose = require('mongoose');

const AuditLogSchema = new mongoose.Schema({
  userId:      String,
  action: {
    type: String,
    enum: [
      'JOIN_GIVEAWAY', 'ENTRY_FEE_DEDUCTED', 'JOIN_REJECTED',
      'DUPLICATE_ATTEMPT', 'FRAUD_FLAGGED', 'CLAIM_SUBMITTED',
      'WINNER_SELECTED', 'PRIZE_DELIVERED', 'CLAIM_EXPIRED',
    ],
    required: true,
  },
  giveawayId:   String,
  prizeId:      String,
  amount:       Number,
  currency:     String,
  result:       { type: String, enum: ['SUCCESS', 'FAILURE', 'BLOCKED'] },
  requestId:    String, // idempotency key
  metadata:     mongoose.Schema.Types.Mixed,
  createdAt:    { type: Date, default: Date.now },
}, { timestamps: true });

// Index for audit queries
AuditLogSchema.index({ userId: 1, createdAt: -1 });
AuditLogSchema.index({ giveawayId: 1, action: 1 });

module.exports = mongoose.model('AuditLog', AuditLogSchema);
