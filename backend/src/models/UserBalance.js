const mongoose = require('mongoose');

const userBalanceSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  VEs: {
    type: Number,
    default: 0,
    min: 0,
  },
  SVEs: {
    type: Number,
    default: 0,
    min: 0,
  },
  Tokens: {
    type: Number,
    default: 0,
    min: 0,
  },
  displayId: {
    type: String,
  },
  isInitialized: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('UserBalance', userBalanceSchema);
