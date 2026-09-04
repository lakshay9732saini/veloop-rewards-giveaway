require('dotenv').config();
const express  = require('express');
const helmet   = require('helmet');
const cors     = require('cors');
const morgan   = require('morgan');
const { generalLimiter } = require('./middleware/rateLimitMiddleware');
const { errorHandler }   = require('./middleware/errorMiddleware');
const giveawayRoutes     = require('./routes/giveawayRoutes');
const authRoutes         = require('./routes/authRoutes');

const app = express();

// ── Security headers ──────────────────────────────────────────────────────────
app.use(helmet());

// ── CORS ──────────────────────────────────────────────────────────────────────
// In production, replace with your actual frontend domain.
const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'https://veloop-giveaway.vercel.app',
  ...(process.env.CLIENT_URL || '').split(',').map(s => s.trim()).filter(Boolean),
];
app.use(cors({
  origin: (origin, callback) => {
    // Allow no-origin (server-to-server) and allowed origins
    if (!origin || ALLOWED_ORIGINS.includes(origin)) callback(null, true);
    else callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

// ── Logging ───────────────────────────────────────────────────────────────────
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// ── Body parsing ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: false, limit: '10kb' }));

// ── Global rate limiting ──────────────────────────────────────────────────────
app.use(generalLimiter);

// ── Root & Health check ───────────────────────────────────────────────────────
app.get('/', (_req, res) => res.json({ 
  success: true, 
  message: 'VELOOP Rewards API is running', 
  version: '1.0.0',
  endpoints: {
    health: '/health',
    giveaways: '/api/giveaways'
  }
}));
app.get('/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

// ── API routes ────────────────────────────────────────────────────────────────
app.use('/api/giveaways', giveawayRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/balance', require('./routes/balanceRoutes'));
// Seed route (disabled in production for security)
if (process.env.NODE_ENV !== 'production') {
  app.use('/api/seed', require('./routes/seedRoutes'));
}

// ── 404 handler ───────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'NOT_FOUND', message: `Route ${req.method} ${req.path} not found.` });
});

// ── Centralized error handler ──────────────────────────────────────────────────
app.use(errorHandler);

module.exports = app;
