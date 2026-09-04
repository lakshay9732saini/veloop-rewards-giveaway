const crypto = require('crypto');
const express = require('express');
const jwt = require('jsonwebtoken');
const UserBalance = require('../models/UserBalance');

const router = express.Router();

router.post('/login', async (req, res, next) => {
  try {
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '');

    if (!email || !/^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/.test(email)) {
      return res.status(400).json({ success: false, error: 'INVALID_EMAIL', message: 'Please enter an email with a valid extension.' });
    }

    if (password.length < 8) {
      return res.status(400).json({ success: false, error: 'PASSWORD_TOO_SHORT', message: 'Password must be at least 8 characters long.' });
    }

    const userId = `DEMO_${crypto.createHash('sha256').update(email).digest('hex').slice(0, 20)}`;
    const displayId = `VE****${userId.slice(-2).toUpperCase()}`;
    const wallet = await UserBalance.findOneAndUpdate(
      { userId },
      {
        $setOnInsert: { userId, VEs: 10000, SVEs: 5000, Tokens: 50000, isInitialized: true },
        $set: { displayId },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // Migrate wallets created before demo balances were persisted.
    if (!wallet.isInitialized) {
      wallet.VEs = 10000;
      wallet.SVEs = 5000;
      wallet.Tokens = 50000;
      wallet.isInitialized = true;
      await wallet.save();
    }

    const token = jwt.sign(
      { sub: userId, email },
      process.env.JWT_SECRET || 'dev_secret_change_in_production',
      { expiresIn: '7d' }
    );

    return res.json({
      success: true,
      token,
      user: {
        id: userId,
        displayId: wallet.displayId || displayId,
        name: email.split('@')[0],
        email,
        balance: { VEs: wallet.VEs, SVEs: wallet.SVEs, Tokens: wallet.Tokens },
        entries: 0,
        userState: 'visitor',
        wonPrize: null,
      },
    });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;