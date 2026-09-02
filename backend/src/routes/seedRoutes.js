const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Giveaway = require('../models/Giveaway');
const GiveawayWinner = require('../models/GiveawayWinner');
const UserBalance = require('../models/UserBalance');

// Asset paths
const ASSETS = {
  iphone:     '/assets/ChatGPT Image Aug 19, 2026, 01_49_05 PM.png',
  watch:      '/assets/ChatGPT Image Aug 19, 2026, 01_55_25 PM.png',
  airpods:    '/assets/ChatGPT Image Aug 19, 2026, 02_06_07 PM.png',
  amazon2000: '/assets/ChatGPT Image Aug 19, 2026, 03_22_24 PM.png',
  amazon500:  '/assets/ChatGPT Image Aug 19, 2026, 03_27_44 PM.png',
  amazon20:   '/assets/ChatGPT Image Aug 19, 2026, 05_07_43 PM.png',
};

router.post('/run', async (req, res) => {
  try {
    const { secret } = req.body;
    
    // Simple security check
    if (secret !== 'veloop_seed_secret_2026') {
      return res.status(403).json({ success: false, error: 'Unauthorized' });
    }

    // Dates
    const now = new Date();
    const endDate = new Date(now.getTime() + 12 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000);
    const startDate = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000);

    // Giveaways data
    const giveaways = [
      {
        id: 'GW-2026-09',
        title: 'September Mega Rewards Giveaway',
        slug: 'september-mega-rewards',
        description: 'Complete eligible activities, collect entries and get a chance to win exciting rewards this September.',
        status: 'ACTIVE',
        startAt: startDate,
        endAt: endDate,
        participants: 8500,
        totalEntries: 34291,
        prizes: [
          {
            id: 'PRIZE-001',
            name: 'iPhone 15 Pro',
            slug: 'iphone-15-pro',
            position: 1,
            label: '1st Prize',
            image: ASSETS.iphone,
            description: 'The latest iPhone 15 Pro with titanium design, A17 Pro chip, and pro camera system.',
            shortDesc: 'Latest iPhone 15 Pro – Titanium Edition',
            prizeValue: '₹1,34,900',
            type: 'PHYSICAL',
            claimType: 'physical_form',
            winnerCount: 1,
            entryCurrency: 'VEs',
            entryFee: 250,
            badge: 'Most Wanted',
          },
          {
            id: 'PRIZE-002',
            name: 'Apple Watch Series 9',
            slug: 'apple-watch',
            position: 2,
            label: '2nd Prize',
            image: ASSETS.watch,
            description: 'Apple Watch Series 9 with advanced health tracking, double tap gesture, and always-on display.',
            shortDesc: 'Apple Watch Series 9 – Premium Smartwatch',
            prizeValue: '₹41,900',
            type: 'PHYSICAL',
            claimType: 'physical_form',
            winnerCount: 3,
            entryCurrency: 'VEs',
            entryFee: 200,
            badge: 'Popular',
          },
          {
            id: 'PRIZE-003',
            name: 'AirPods Pro',
            slug: 'airpods-pro',
            position: 3,
            label: '3rd Prize',
            image: ASSETS.airpods,
            description: 'AirPods Pro 2nd Gen with Active Noise Cancellation, Adaptive Audio, and USB-C charging.',
            shortDesc: 'AirPods Pro 2nd Gen – Spatial Audio',
            prizeValue: '₹24,900',
            type: 'PHYSICAL',
            claimType: 'physical_form',
            winnerCount: 5,
            entryCurrency: 'SVEs',
            entryFee: 500,
            badge: 'High Demand',
          },
          {
            id: 'PRIZE-004',
            name: '₹2,000 Amazon Voucher',
            slug: 'amazon-2000',
            position: 4,
            label: 'Lucky Draw',
            image: ASSETS.amazon2000,
            description: 'Amazon Gift Card worth ₹2,000. Redeemable on Amazon.in for any product.',
            shortDesc: '₹2,000 Amazon Gift Card – Instant Delivery',
            prizeValue: '₹2,000',
            type: 'GIFT_CARD',
            claimType: 'gift_card_form',
            winnerCount: 10,
            entryCurrency: 'VEs',
            entryFee: 500,
            badge: 'Easy Entry',
          },
          {
            id: 'PRIZE-005',
            name: '₹500 Amazon Voucher',
            slug: 'amazon-500',
            position: 5,
            label: 'Lucky Draw',
            image: ASSETS.amazon500,
            description: 'Amazon Gift Card worth ₹500. Redeemable on Amazon.in for any product.',
            shortDesc: '₹500 Amazon Gift Card – Instant Delivery',
            prizeValue: '₹500',
            type: 'GIFT_CARD',
            claimType: 'gift_card_form',
            winnerCount: 20,
            entryCurrency: 'VEs',
            entryFee: 300,
            badge: 'Most Popular',
          },
          {
            id: 'PRIZE-006',
            name: '₹20 Amazon Voucher',
            slug: 'amazon-20',
            position: 6,
            label: 'Bonus Reward',
            image: ASSETS.amazon20,
            description: 'Amazon Gift Card worth ₹20. Perfect for daily shoppers on Amazon.in.',
            shortDesc: '₹20 Amazon Gift Card – For Everyone',
            prizeValue: '₹20',
            type: 'GIFT_CARD',
            claimType: 'gift_card_form',
            winnerCount: 100,
            entryCurrency: 'Tokens',
            entryFee: 2000,
            badge: 'Highest Chance',
          },
        ],
        rules: [
          'Must be a registered VELOOP Rewards member to participate.',
          'Each user may participate once per giveaway event.',
          'Entry fee is non-refundable once participation is recorded.',
          'Winners are selected by a fair random draw from eligible participants.',
          'Winners will be announced within 24 hours of the giveaway ending.',
          'Winners must claim their prize within 7 days of announcement.',
          'Fraudulent, duplicate, or suspicious entries will be disqualified.',
          'VELOOP reserves the right to disqualify any participant found violating platform rules.',
          'Physical prizes are delivered within 7–14 business days of claim verification.',
          'Amazon Gift Cards are delivered to the registered email within 48 hours.',
        ],
        eligibility: [
          'Must have a verified VELOOP Rewards account.',
          'Account must be in good standing (no active violations).',
          'Must have sufficient balance of the required currency (VEs/SVEs/Tokens).',
          'One entry per eligible user per giveaway event.',
        ],
        participationSettings: {
          allowMultipleEntries: false,
          additionalEntriesViaTask: true,
          maxEntriesPerUser: 1,
        },
        winnerAnnouncementDate: new Date(endDate.getTime() + 24 * 60 * 60 * 1000),
        claimDeadlineDays: 7,
      },
      {
        id: 'GW-2026-08',
        title: 'August Reward Rush',
        slug: 'august-reward-rush',
        description: 'August giveaway featuring premium rewards for VELOOP members.',
        status: 'ARCHIVED',
        startAt: new Date('2026-08-01T10:00:00.000Z'),
        endAt: new Date('2026-08-15T23:59:00.000Z'),
        participants: 7200,
        totalEntries: 28000,
        prizes: [
          {
            id: 'AUG-P01', name: 'iPhone 15 Pro', slug: 'iphone-15-pro-aug',
            position: 1, label: '1st Prize', image: ASSETS.iphone,
            type: 'PHYSICAL', claimType: 'physical_form',
            winnerCount: 1, entryCurrency: 'VEs', entryFee: 250,
            description: 'iPhone 15 Pro', shortDesc: 'iPhone 15 Pro',
          },
          {
            id: 'AUG-P02', name: 'Apple Watch Series 9', slug: 'apple-watch-aug',
            position: 2, label: '2nd Prize', image: ASSETS.watch,
            type: 'PHYSICAL', claimType: 'physical_form',
            winnerCount: 3, entryCurrency: 'VEs', entryFee: 200,
            description: 'Apple Watch Series 9', shortDesc: 'Apple Watch Series 9',
          },
          {
            id: 'AUG-P03', name: 'AirPods Pro', slug: 'airpods-pro-aug',
            position: 3, label: '3rd Prize', image: ASSETS.airpods,
            type: 'PHYSICAL', claimType: 'physical_form',
            winnerCount: 5, entryCurrency: 'SVEs', entryFee: 500,
            description: 'AirPods Pro', shortDesc: 'AirPods Pro',
          },
        ],
        rules: ['Standard giveaway rules apply.'],
        eligibility: ['Must have a verified VELOOP Rewards account.'],
        participationSettings: { allowMultipleEntries: false, maxEntriesPerUser: 1 },
        claimDeadlineDays: 7,
      },
      {
        id: 'GW-2026-07',
        title: 'Independence Day Special',
        slug: 'independence-day-special',
        description: 'Special Independence Day giveaway with exclusive rewards.',
        status: 'ARCHIVED',
        startAt: new Date('2026-07-10T10:00:00.000Z'),
        endAt: new Date('2026-07-25T23:59:00.000Z'),
        participants: 6400,
        totalEntries: 22000,
        prizes: [
          {
            id: 'JUL-P01', name: 'iPhone 15 Pro', slug: 'iphone-15-pro-jul',
            position: 1, label: '1st Prize', image: ASSETS.iphone,
            type: 'PHYSICAL', claimType: 'physical_form',
            winnerCount: 1, entryCurrency: 'VEs', entryFee: 250,
            description: 'iPhone 15 Pro', shortDesc: 'iPhone 15 Pro',
          },
        ],
        rules: ['Standard giveaway rules apply.'],
        eligibility: ['Must have a verified VELOOP Rewards account.'],
        participationSettings: { allowMultipleEntries: false, maxEntriesPerUser: 1 },
        claimDeadlineDays: 7,
      },
      {
        id: 'GW-2026-06',
        title: 'Summer Rewards Giveaway',
        slug: 'summer-rewards',
        description: 'Beat the heat with our summer giveaway extravaganza.',
        status: 'ARCHIVED',
        startAt: new Date('2026-06-01T10:00:00.000Z'),
        endAt: new Date('2026-06-20T23:59:00.000Z'),
        participants: 5100,
        totalEntries: 18000,
        prizes: [
          {
            id: 'JUN-P01', name: 'Apple Watch Series 9', slug: 'apple-watch-jun',
            position: 2, label: '2nd Prize', image: ASSETS.watch,
            type: 'PHYSICAL', claimType: 'physical_form',
            winnerCount: 3, entryCurrency: 'VEs', entryFee: 200,
            description: 'Apple Watch Series 9', shortDesc: 'Apple Watch Series 9',
          },
        ],
        rules: ['Standard giveaway rules apply.'],
        eligibility: ['Must have a verified VELOOP Rewards account.'],
        participationSettings: { allowMultipleEntries: false, maxEntriesPerUser: 1 },
        claimDeadlineDays: 7,
      },
    ];

    // Winners
    const winners = [
      { giveawayId: 'GW-2026-08', prizeId: 'AUG-P01', userId: 'VE_DEMO_82', displayId: 'VE****82', status: 'CLAIMED', selectedAt: new Date('2026-08-16T12:00:00Z') },
      { giveawayId: 'GW-2026-08', prizeId: 'AUG-P02', userId: 'VE_DEMO_47', displayId: 'VE****47', status: 'CLAIMED', selectedAt: new Date('2026-08-16T12:00:00Z') },
      { giveawayId: 'GW-2026-08', prizeId: 'AUG-P02', userId: 'VE_DEMO_91', displayId: 'VE****91', status: 'CLAIMED', selectedAt: new Date('2026-08-16T12:00:00Z') },
      { giveawayId: 'GW-2026-08', prizeId: 'AUG-P03', userId: 'VE_DEMO_33', displayId: 'VE****33', status: 'CLAIMED', selectedAt: new Date('2026-08-16T12:00:00Z') },
      { giveawayId: 'GW-2026-07', prizeId: 'JUL-P01', userId: 'VE_DEMO_19', displayId: 'VE****19', status: 'DELIVERED', selectedAt: new Date('2026-07-26T12:00:00Z') },
      { giveawayId: 'GW-2026-06', prizeId: 'JUN-P01', userId: 'VE_DEMO_42', displayId: 'VE****42', status: 'DELIVERED', selectedAt: new Date('2026-06-21T12:00:00Z') },
      { giveawayId: 'GW-2026-06', prizeId: 'JUN-P01', userId: 'VE_DEMO_64', displayId: 'VE****64', status: 'DELIVERED', selectedAt: new Date('2026-06-21T12:00:00Z') },
    ];

    // Clear and insert
    await Giveaway.deleteMany({});
    await GiveawayWinner.deleteMany({});
    await UserBalance.deleteMany({});
    
    await Giveaway.insertMany(giveaways);
    await GiveawayWinner.insertMany(winners);

    // Create demo user balances
    const demoUsers = [
      { userId: 'ADMIN_USER', displayId: 'ADMIN', VEs: 10000, SVEs: 5000, Tokens: 50000 },
      { userId: 'VE_DEMO_01', displayId: 'VE****01', VEs: 5000, SVEs: 2000, Tokens: 10000 },
      { userId: 'VE_DEMO_02', displayId: 'VE****02', VEs: 3000, SVEs: 1500, Tokens: 8000 },
      { userId: 'VE_DEMO_03', displayId: 'VE****03', VEs: 2000, SVEs: 1000, Tokens: 5000 },
    ];
    
    await UserBalance.insertMany(demoUsers);

    res.json({
      success: true,
      message: 'Database seeded successfully',
      data: {
        giveaways: giveaways.length,
        winners: winners.length,
        users: demoUsers.length,
      }
    });
  } catch (error) {
    console.error('Seed error:', error);
    res.status(500).json({
      success: false,
      error: 'SEED_ERROR',
      message: error.message
    });
  }
});

module.exports = router;
