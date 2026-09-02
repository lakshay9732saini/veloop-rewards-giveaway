/**
 * VELOOP Rewards – Giveaway Mock Data
 * Structured to mirror real API responses for easy backend integration.
 * Replace this file's exports with real API calls from src/services/api.js
 */

// ─── Currency Types ────────────────────────────────────────────────────────────
export const CURRENCY = {
  VE: 'VEs',
  SVE: 'SVEs',
  TOKEN: 'Tokens',
};

// ─── Prize Types ───────────────────────────────────────────────────────────────
export const PRIZE_TYPE = {
  PHYSICAL: 'PHYSICAL',
  GIFT_CARD: 'GIFT_CARD',
  DIGITAL: 'DIGITAL',
};

// ─── Claim Types ───────────────────────────────────────────────────────────────
export const CLAIM_TYPE = {
  PHYSICAL_FORM: 'physical_form',
  GIFT_CARD_FORM: 'gift_card_form',
  DIGITAL_FORM: 'digital_form',
};

// ─── Giveaway Statuses ─────────────────────────────────────────────────────────
export const GIVEAWAY_STATUS = {
  UPCOMING: 'UPCOMING',
  ACTIVE: 'ACTIVE',
  ENDED: 'ENDED',
  ARCHIVED: 'ARCHIVED',
};

// ─── Asset paths (files from /public/assets/) ──────────────────────────────────
export const ASSETS = {
  ticket:    '/assets/ChatGPT Image Aug 19, 2026, 01_36_29 PM.png',
  giftBox:   '/assets/ChatGPT Image Aug 19, 2026, 01_40_53 PM.png',
  iphone:    '/assets/ChatGPT Image Aug 19, 2026, 01_49_05 PM.png',
  watch:     '/assets/ChatGPT Image Aug 19, 2026, 01_55_25 PM.png',
  airpods:   '/assets/ChatGPT Image Aug 19, 2026, 03_22_24 PM.png',
  amazon2000:'/assets/ChatGPT Image Aug 19, 2026, 02_06_07 PM.png',
  amazon500: '/assets/ChatGPT Image Aug 19, 2026, 03_27_44 PM.png',
  amazon20:  '/assets/ChatGPT Image Aug 19, 2026, 05_07_43 PM.png',
  giftBoxAlt:'/assets/img.png',
};

// ─── Prizes ────────────────────────────────────────────────────────────────────
export const prizes = [
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
    type: PRIZE_TYPE.PHYSICAL,
    claimType: CLAIM_TYPE.PHYSICAL_FORM,
    winnerCount: 1,
    entryCurrency: CURRENCY.VE,
    entryFee: 250,
    participants: 2347,
    accentColor: '#6366f1',
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
    type: PRIZE_TYPE.PHYSICAL,
    claimType: CLAIM_TYPE.PHYSICAL_FORM,
    winnerCount: 3,
    entryCurrency: CURRENCY.VE,
    entryFee: 200,
    participants: 3891,
    accentColor: '#10b981',
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
    type: PRIZE_TYPE.PHYSICAL,
    claimType: CLAIM_TYPE.PHYSICAL_FORM,
    winnerCount: 5,
    entryCurrency: CURRENCY.SVE,
    entryFee: 500,
    participants: 5124,
    accentColor: '#8b5cf6',
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
    type: PRIZE_TYPE.GIFT_CARD,
    claimType: CLAIM_TYPE.GIFT_CARD_FORM,
    winnerCount: 10,
    entryCurrency: CURRENCY.VE,
    entryFee: 500,
    participants: 4203,
    accentColor: '#f59e0b',
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
    type: PRIZE_TYPE.GIFT_CARD,
    claimType: CLAIM_TYPE.GIFT_CARD_FORM,
    winnerCount: 20,
    entryCurrency: CURRENCY.VE,
    entryFee: 300,
    participants: 6780,
    accentColor: '#f59e0b',
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
    type: PRIZE_TYPE.GIFT_CARD,
    claimType: CLAIM_TYPE.GIFT_CARD_FORM,
    winnerCount: 100,
    entryCurrency: CURRENCY.TOKEN,
    entryFee: 2000,
    participants: 12043,
    accentColor: '#f59e0b',
    badge: 'Highest Chance',
  },
];

// ─── Current Active Giveaway ────────────────────────────────────────────────────
// endDate is set 12 days from "now" for demo; replace with real date from backend
const now = new Date();
const endDate = new Date(now.getTime() + 12 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000);
const startDate = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000);

export const currentGiveaway = {
  id: 'GW-2026-09',
  title: 'September Mega Rewards Giveaway',
  slug: 'september-mega-rewards',
  description:
    'Complete eligible activities, collect entries and get a chance to win exciting rewards this September.',
  status: GIVEAWAY_STATUS.ACTIVE, // Change to ENDED or UPCOMING to test those states
  startAt: startDate.toISOString(),
  endAt: endDate.toISOString(),
  prizes,
  participants: 8500,
  totalEntries: 34291,
  rules: [
    'Must be a registered VELOOP Rewards member to participate.',
    'Each user may participate once per giveaway event.',
    'Entry fee is non-refundable once participation is recorded. [Placeholder — confirm with VELOOP policy]',
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
  winnerAnnouncementDate: new Date(endDate.getTime() + 24 * 60 * 60 * 1000).toISOString(),
  claimDeadlineDays: 7,
  createdAt: startDate.toISOString(),
  updatedAt: now.toISOString(),
};

// ─── Previous Giveaways ─────────────────────────────────────────────────────────
export const previousGiveaways = [
  {
    id: 'GW-2026-08',
    title: 'August Reward Rush',
    slug: 'august-reward-rush',
    status: GIVEAWAY_STATUS.ARCHIVED,
    startAt: '2026-08-01T10:00:00.000Z',
    endAt: '2026-08-15T23:59:00.000Z',
    participants: 7200,
  },
  {
    id: 'GW-2026-07',
    title: 'Independence Day Special',
    slug: 'independence-day-special',
    status: GIVEAWAY_STATUS.ARCHIVED,
    startAt: '2026-07-10T10:00:00.000Z',
    endAt: '2026-07-25T23:59:00.000Z',
    participants: 6400,
  },
  {
    id: 'GW-2026-06',
    title: 'Summer Rewards Giveaway',
    slug: 'summer-rewards',
    status: GIVEAWAY_STATUS.ARCHIVED,
    startAt: '2026-06-01T10:00:00.000Z',
    endAt: '2026-06-20T23:59:00.000Z',
    participants: 5100,
  },
];

// ─── Previous Winners ───────────────────────────────────────────────────────────
export const previousWinners = [
  {
    id: 'WIN-082-001',
    userId: 'VE****82',
    displayName: 'VE****82',
    prize: 'iPhone 15 Pro',
    prizeType: PRIZE_TYPE.PHYSICAL,
    giveawayId: 'GW-2026-08',
    giveawayTitle: 'August Reward Rush',
    date: '2026-08-16T12:00:00.000Z',
    status: 'CLAIMED',
    position: 1,
  },
  {
    id: 'WIN-082-002',
    userId: 'VE****47',
    displayName: 'VE****47',
    prize: 'Apple Watch Series 9',
    prizeType: PRIZE_TYPE.PHYSICAL,
    giveawayId: 'GW-2026-08',
    giveawayTitle: 'August Reward Rush',
    date: '2026-08-16T12:00:00.000Z',
    status: 'CLAIMED',
    position: 2,
  },
  {
    id: 'WIN-082-003',
    userId: 'VE****91',
    displayName: 'VE****91',
    prize: 'Apple Watch Series 9',
    prizeType: PRIZE_TYPE.PHYSICAL,
    giveawayId: 'GW-2026-08',
    giveawayTitle: 'August Reward Rush',
    date: '2026-08-16T12:00:00.000Z',
    status: 'CLAIMED',
    position: 2,
  },
  {
    id: 'WIN-082-004',
    userId: 'VE****33',
    displayName: 'VE****33',
    prize: 'AirPods Pro',
    prizeType: PRIZE_TYPE.PHYSICAL,
    giveawayId: 'GW-2026-08',
    giveawayTitle: 'August Reward Rush',
    date: '2026-08-16T12:00:00.000Z',
    status: 'CLAIMED',
    position: 3,
  },
  {
    id: 'WIN-082-005',
    userId: 'VE****58',
    displayName: 'VE****58',
    prize: '₹2,000 Amazon Voucher',
    prizeType: PRIZE_TYPE.GIFT_CARD,
    giveawayId: 'GW-2026-08',
    giveawayTitle: 'August Reward Rush',
    date: '2026-08-16T12:00:00.000Z',
    status: 'DELIVERED',
    position: 4,
  },
  {
    id: 'WIN-072-001',
    userId: 'VE****19',
    displayName: 'VE****19',
    prize: 'iPhone 15 Pro',
    prizeType: PRIZE_TYPE.PHYSICAL,
    giveawayId: 'GW-2026-07',
    giveawayTitle: 'Independence Day Special',
    date: '2026-07-26T12:00:00.000Z',
    status: 'DELIVERED',
    position: 1,
  },
  {
    id: 'WIN-072-002',
    userId: 'VE****64',
    displayName: 'VE****64',
    prize: 'Apple Watch Series 9',
    prizeType: PRIZE_TYPE.PHYSICAL,
    giveawayId: 'GW-2026-07',
    giveawayTitle: 'Independence Day Special',
    date: '2026-07-26T12:00:00.000Z',
    status: 'DELIVERED',
    position: 2,
  },
  {
    id: 'WIN-062-001',
    userId: 'VE****42',
    displayName: 'VE****42',
    prize: 'Apple Watch Series 9',
    prizeType: PRIZE_TYPE.PHYSICAL,
    giveawayId: 'GW-2026-06',
    giveawayTitle: 'Summer Rewards Giveaway',
    date: '2026-06-21T12:00:00.000Z',
    status: 'DELIVERED',
    position: 2,
  },
];

// ─── Winner Slider Messages ─────────────────────────────────────────────────────
export const winnerSliderMessages = [
  { id: 1, userId: 'VE****21', prize: 'iPhone 15 Pro', icon: '🏆', giveaway: 'August Reward Rush' },
  { id: 2, userId: 'VE****83', prize: 'Apple Watch Series 9', icon: '⌚', giveaway: 'August Reward Rush' },
  { id: 3, userId: 'VE****54', prize: 'AirPods Pro', icon: '🎧', giveaway: 'August Reward Rush' },
  { id: 4, userId: 'VE****92', prize: '₹2,000 Amazon Voucher', icon: '🎁', giveaway: 'August Reward Rush' },
  { id: 5, userId: 'VE****37', prize: '₹500 Amazon Voucher', icon: '🎁', giveaway: 'August Reward Rush' },
  { id: 6, userId: 'VE****11', prize: 'iPhone 15 Pro', icon: '🏆', giveaway: 'Independence Day Special' },
  { id: 7, userId: 'VE****76', prize: 'AirPods Pro', icon: '🎧', giveaway: 'Summer Rewards Giveaway' },
  { id: 8, userId: 'VE****29', prize: 'Apple Watch Series 9', icon: '⌚', giveaway: 'Summer Rewards Giveaway' },
];

// ─── Demo User ──────────────────────────────────────────────────────────────────
// Simulated logged-in user — change userState to test different flows
export const demoUser = {
  id: 'VE10025',
  displayId: 'VE****25',
  name: 'Rahul Verma',
  email: 'r****@gmail.com',
  balance: {
    [CURRENCY.VE]: 850,
    [CURRENCY.SVE]: 1200,
    [CURRENCY.TOKEN]: 3500,
  },
  entries: 24,
  // States: 'visitor' | 'loggedIn' | 'participating' | 'winner' | 'nonWinner' | 'ended' | 'upcoming'
  userState: 'winner',
  // Which prize this user won (only relevant when userState === 'winner')
  wonPrize: {
    prizeId: 'PRIZE-002',
    prizeName: 'Apple Watch Series 9',
    prizeType: PRIZE_TYPE.PHYSICAL,
    claimType: CLAIM_TYPE.PHYSICAL_FORM,
    giveawayId: 'GW-2026-09',
    giveawayTitle: 'September Mega Rewards Giveaway',
    claimStatus: 'NOT_SUBMITTED', // NOT_SUBMITTED | SUBMITTED | PROCESSING | COMPLETED | EXPIRED
    claimDeadline: new Date(endDate.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
};

// ─── Statistics ─────────────────────────────────────────────────────────────────
export const giveawayStats = {
  totalGiveaways: 24,
  totalParticipants: 8500,
  prizesWon: 1200,
  activeGiveaways: 1,
};

// ─── FAQ ────────────────────────────────────────────────────────────────────────
export const faqItems = [
  {
    id: 1,
    question: 'How do I participate in a giveaway?',
    answer:
      'Log in to your VELOOP Rewards account, browse the active giveaways, select one, review the prize and entry fee, then click "Join Giveaway". Your entry fee will be deducted from your balance and your participation will be recorded.',
  },
  {
    id: 2,
    question: 'How are winners selected?',
    answer:
      'Winners are selected through a fair, random draw from all eligible participants after the giveaway ends. Each participant has one equal entry regardless of when they joined (unless additional entries via tasks are available).',
  },
  {
    id: 3,
    question: 'When are winners announced?',
    answer:
      'Winners are announced within 24 hours of the giveaway ending. You will be notified via your VELOOP Rewards dashboard and email if you win.',
  },
  {
    id: 4,
    question: 'What happens if I win?',
    answer:
      'If you win, a special "Congratulations" banner will appear on your dashboard. Click "Claim Your Prize" and fill in the required delivery details (for physical prizes) or your email (for gift cards).',
  },
  {
    id: 5,
    question: 'How do I claim my prize?',
    answer:
      'Winners must submit their claim details within 7 days of the announcement. For physical prizes, provide your delivery address. For Amazon Gift Cards, provide your email address.',
  },
  {
    id: 6,
    question: 'Can I participate in multiple giveaways?',
    answer:
      'Yes! Each giveaway is a separate event. You can participate in multiple active giveaways simultaneously, as long as you have the required balance for each.',
  },
  {
    id: 7,
    question: 'What happens after the giveaway ends?',
    answer:
      'After the giveaway ends, the winner selection process begins. Results are announced within 24 hours. The current giveaway moves to "Previous Giveaways" and a new giveaway may start.',
  },
  {
    id: 8,
    question: 'What are VEs, SVEs, and Tokens?',
    answer:
      'These are VELOOP Rewards currencies. VEs (VELOOP Earnings) and SVEs (Special VELOOP Earnings) are earned through eligible platform activities. Tokens are also earned through specific tasks. Each giveaway specifies which currency is required.',
  },
];

// ─── Trust Points ───────────────────────────────────────────────────────────────
export const trustPoints = [
  {
    id: 1,
    icon: 'Shield',
    title: '100% Transparent',
    description: 'Giveaway rules, prize details, and winner selection process are clearly documented for every event.',
  },
  {
    id: 2,
    icon: 'Lock',
    title: 'Secure Participation',
    description: 'All transactions and entry fees are securely processed. Your personal information is protected.',
  },
  {
    id: 3,
    icon: 'Scale',
    title: 'Fair Random Draw',
    description: 'Every eligible participant has an equal chance. Winners are selected through a verified random draw.',
  },
  {
    id: 4,
    icon: 'Eye',
    title: 'Reward Transparency',
    description: 'Prize values, entry requirements, winner counts, and claim processes are visible before you join.',
  },
];

// ─── Upcoming Giveaway Teaser ───────────────────────────────────────────────────
export const upcomingGiveaway = {
  id: 'GW-2026-10',
  title: 'October Grand Rewards',
  teaser: 'Bigger prizes, more winners. Coming soon.',
  startsInDays: 3,
  status: GIVEAWAY_STATUS.UPCOMING,
};
