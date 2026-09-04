const mongoose = require('mongoose');
const dns = require('dns');
const GiveawayParticipation = require('../models/GiveawayParticipation');

async function connectDB() {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!uri) {
    console.warn('[DB] MONGODB_URI not set — running without database.');
    return false;
  }

  const dnsServers = (process.env.MONGODB_DNS_SERVERS || '1.1.1.1,8.8.8.8')
    .split(',')
    .map((server) => server.trim())
    .filter(Boolean);
  dns.setServers(dnsServers);
  console.log(`[DB] Using DNS resolvers: ${dnsServers.join(', ')}`);

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 5000,
      });
      await GiveawayParticipation.syncIndexes();
      console.log('[DB] MongoDB connected');
      return true;
    } catch (err) {
      console.error(`[DB] Connection attempt ${attempt}/3 failed:`, err.message);
      if (attempt < 3) {
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }
    }
  }

  console.warn('[DB] MongoDB unavailable — server started without database.');
  return false;
}

module.exports = connectDB;
