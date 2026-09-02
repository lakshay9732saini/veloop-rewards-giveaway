# 🎁 VELoop Rewards - Giveaway Platform

A full-stack giveaway management platform with **real-time balance tracking** built using **React + Express + MongoDB**.

> **🚀 Live Demo:**  
> Frontend: https://frontend-six-xi-50.vercel.app  
> Backend: https://veloop-rewards-giveaway-two.vercel.app

---

## ✨ Key Features

### 🎯 User Experience
- **Join Giveaways** - Participate in active prizes with VEs/SVEs/Tokens
- **Real-Time Balance** - Navbar and detail page sync automatically every 30s
- **My Participations** - Track all joined giveaways with entry fees
- **Prize Claims** - Submit delivery details for won prizes
- **Live Countdown** - Real-time countdown timer
- **Insufficient Balance Warning** - Can't join if balance is low

### 💎 Technical Highlights
- ⚡ **React 18 + Vite** - Blazing fast development
- 🎭 **Framer Motion** - Smooth animations
- 🗄️ **MongoDB Atlas** - Cloud database with persistence
- 🔄 **Real-Time Sync** - Balance updates across all components
- 🔐 **Rate Limiting** - DDoS protection (10 req/min)
- 📝 **Audit Logs** - Complete transaction history
- 🎨 **Responsive Design** - Mobile-friendly glassmorphic UI

### 🛠️ Admin Features (Demo Mode)
- 👤 **Pre-configured Admin** - No login required
- 💰 **Initial Balance** - 10,000 VEs / 5,000 SVEs / 50,000 Tokens
- ✅ **Join Multiple Prizes** - Test unlimited entries
- 📊 **Transaction History** - All actions logged in MongoDB

---

## 📦 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite, Framer Motion, React Router, CSS Modules |
| **Backend** | Express.js, Mongoose, Express Rate Limit |
| **Database** | MongoDB Atlas (Cloud) |
| **Deployment** | Vercel (Frontend + Backend) |
| **Authentication** | Demo mode (no auth for testing) |

---

## 🚀 Quick Start

### Prerequisites
```bash
Node.js 18+
MongoDB (local or Atlas)
Git
```

### 1️⃣ Clone Repository
```bash
git clone <your-repo-url>
cd "VELoop Intership part 2"
```

### 2️⃣ Backend Setup
```bash
cd backend
npm install

# Create .env file
MONGODB_URI=mongodb+srv://admin_admin:admin123@veloop.sw1whtf.mongodb.net/veloop_rewards
PORT=5000
NODE_ENV=development

npm start
# ✅ Server: http://localhost:5000
```

### 3️⃣ Frontend Setup
```bash
cd frontend
npm install

# Create .env file
VITE_API_URL=http://localhost:5000/api

npm run dev
# ✅ App: http://localhost:5173
```

### 4️⃣ Seed Database (First Time Only)
```bash
# POST request to seed data
curl -X POST http://localhost:5000/api/seed/run
```

---

## 📁 Project Structure

```
VELoop Intership part 2/
├── backend/
│   ├── src/
│   │   ├── config/           # Database connection
│   │   ├── controllers/      # Route handlers (giveaway, claim, participation)
│   │   ├── middleware/       # Auth, rate limit, error handling
│   │   ├── models/           # Mongoose schemas
│   │   │   ├── Giveaway.js
│   │   │   ├── GiveawayParticipation.js
│   │   │   ├── GiveawayEntryTransaction.js
│   │   │   ├── PrizeClaim.js
│   │   │   ├── UserBalance.js
│   │   │   ├── AuditLog.js
│   │   │   └── FraudEvent.js
│   │   ├── routes/           # API routes
│   │   ├── services/         # Business logic
│   │   │   ├── balanceService.js    # Real-time balance from DB
│   │   │   ├── giveawayService.js
│   │   │   ├── participationService.js
│   │   │   ├── winnerService.js
│   │   │   └── fraudService.js
│   │   ├── utils/            # Seed data
│   │   └── validators/       # Input validation
│   ├── .env.example
│   ├── package.json
│   ├── server.js
│   └── vercel.json
│
├── frontend/
│   ├── public/
│   │   └── assets/           # Prize images
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── Navbar/
│   │   │   ├── GiveawayHero/
│   │   │   ├── FeaturedGiveaways/
│   │   │   ├── MyParticipations/
│   │   │   ├── ConfirmJoinModal/
│   │   │   ├── PrizeClaimModal/
│   │   │   ├── Countdown/
│   │   │   └── WinnersTabs/
│   │   ├── config/           # Admin user config
│   │   ├── context/          # UserContext (global state)
│   │   ├── data/             # Constants & mock data
│   │   ├── pages/            # Route pages
│   │   │   ├── GiveawayPage/
│   │   │   └── GiveawayDetail/
│   │   ├── services/         # API calls
│   │   │   └── api.js        # fetchUserBalance, joinGiveaway, etc.
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env
│   ├── package.json
│   ├── vite.config.js
│   └── vercel.json
│
├── vercel.json               # Root monorepo config
├── .gitignore
└── README.md
```

---

## 🔄 How Balance Sync Works

### Problem
❌ **Before:** Navbar showed 10,000 VEs, but detail page showed 9,750 VEs after joining a prize.

### Solution
✅ **Now:** Real-time sync using `UserContext` + API polling.

```javascript
// UserContext.jsx
useEffect(() => {
  const loadBalance = async () => {
    const balance = await fetchUserBalance(user.id);
    setUser(prev => ({ ...prev, balance }));
  };

  loadBalance(); // Load on mount
  const interval = setInterval(loadBalance, 30000); // Refresh every 30s
  
  return () => clearInterval(interval);
}, [user.id]);
```

**Flow:**
1. User joins prize → Backend deducts balance → Saves to MongoDB
2. Frontend calls `refreshBalance()` immediately after join
3. UserContext updates → Navbar reflects new balance
4. Background polling syncs every 30s automatically

**Result:**
```
Join iPhone (250 VEs)
Before: 🪙 10,000 VE (Navbar) | 🪙 10,000 VE (Detail Page)
After:  🪙 9,750 VE (Navbar)  | 🪙 9,750 VE (Detail Page) ✅ SYNCED!
```

---

## 🛠️ API Endpoints

### Giveaways
```http
GET  /api/giveaways/current              # Active giveaway
GET  /api/giveaways/stats                # Platform stats
GET  /api/giveaways/previous             # Past giveaways
GET  /api/giveaways/:id                  # Giveaway by ID
GET  /api/giveaways/:id/winners          # Winners list
```

### Participation
```http
POST /api/giveaways/:id/join             # Join giveaway
  Body: { giveawayId, prizeId }
  Response: { success, participation, transaction }

GET  /api/giveaways/:id/my-status        # My participation status
POST /api/giveaways/:id/claim            # Submit prize claim
GET  /api/giveaways/:id/my-claim         # Get my claim details
```

### Balance
```http
GET  /api/balance/:userId                # Get user balance
  Response: { 
    userId: "ADMIN_USER",
    balance: { VEs: 9750, SVEs: 5000, Tokens: 50000 }
  }
```

---

## 📊 Database Schema

### UserBalance (Real-Time Balance)
```javascript
{
  userId: 'ADMIN_USER',
  balance: {
    VEs: 9750,
    SVEs: 5000,
    Tokens: 50000
  },
  lastUpdated: Date
}
```

### GiveawayParticipation
```javascript
{
  userId: 'ADMIN_USER',
  giveawayId: 'GW-2026-09',
  prizeId: 'PRIZE-001',
  entryFee: 250,
  entryCurrency: 'VEs',
  status: 'ACTIVE',
  joinedAt: Date
}
```

### GiveawayEntryTransaction (Audit Trail)
```javascript
{
  transactionId: 'TXN-abc123',
  userId: 'ADMIN_USER',
  type: 'DEBIT',
  amount: 250,
  currency: 'VEs',
  balanceBefore: 10000,
  balanceAfter: 9750,
  status: 'SUCCESS',
  timestamp: Date
}
```

### PrizeClaim
```javascript
{
  claimId: 'CLAIM-abc123',
  userId: 'ADMIN_USER',
  giveawayId: 'GW-2026-09',
  prizeId: 'PRIZE-002',
  deliveryDetails: {
    fullName: 'Admin User',
    phone: '+91 9876543210',
    address: 'Mumbai, India',
    pincode: '400001'
  },
  status: 'SUBMITTED',
  submittedAt: Date
}
```

---

## 🧪 Testing Guide

### 1️⃣ Balance Sync Test
```bash
# Open https://frontend-six-xi-50.vercel.app
# Step 1: Check navbar - should show current balance (e.g., 9,750 VE)
# Step 2: Click "View Details" on any prize
# Step 3: Detail page should show SAME balance (9,750 VE)
# Step 4: Join prize (deducts 250 VEs)
# Step 5: Both navbar AND detail page show 9,500 VE ✅
```

### 2️⃣ Insufficient Balance Test
```bash
# Join expensive prizes until balance < entry fee
# Try joining another prize
# Should show "Insufficient Balance" warning ❌
# Join button disabled
```

### 3️⃣ Database Verification
```bash
# Connect to MongoDB Atlas
mongosh "mongodb+srv://admin_admin:admin123@veloop.sw1whtf.mongodb.net/veloop_rewards"

# Check user balance
db.userbalances.findOne({ userId: "ADMIN_USER" })

# Check participations
db.giveawayparticipations.find({ userId: "ADMIN_USER" })

# Check transactions
db.giveawayentrytransactions.find({ userId: "ADMIN_USER" }).sort({ timestamp: -1 })

# Check audit logs
db.auditlogs.find({ userId: "ADMIN_USER", action: "JOIN_GIVEAWAY" })
```

---

## 🎨 Design System

### Color Palette
```css
--purple-600: #7C3AED;    /* Primary brand */
--gold-500: #F59E0B;      /* Premium accents */
--emerald-500: #10B981;   /* Success states */
--rose-500: #F43F5E;      /* Errors/warnings */
--indigo-500: #6366F1;    /* Info/links */
```

### Typography
- **Headings:** Inter, system-ui
- **Body:** -apple-system, BlinkMacSystemFont

### Components
- **Glassmorphism:** backdrop-blur with semi-transparent backgrounds
- **Animations:** Framer Motion for smooth transitions
- **Icons:** Lucide React

---

## 🚀 Deployment

### Frontend (Vercel)
```bash
cd frontend
vercel --prod

# Environment Variables (Vercel Dashboard)
VITE_API_URL=https://veloop-rewards-giveaway-two.vercel.app/api
```

### Backend (Vercel)
```bash
cd backend
vercel --prod

# Environment Variables (Vercel Dashboard)
MONGODB_URI=mongodb+srv://admin_admin:admin123@veloop.sw1whtf.mongodb.net/veloop_rewards
NODE_ENV=production
PORT=5000
JWT_SECRET=your_jwt_secret
REFRESH_SECRET=your_refresh_secret
CLIENT_URL=https://frontend-six-xi-50.vercel.app
```

### Monorepo Config (Root vercel.json)
```json
{
  "buildCommand": "cd frontend && npm run build",
  "outputDirectory": "frontend/dist",
  "installCommand": "cd frontend && npm install"
}
```

---

## 🔐 Security Features

### Backend
- ✅ Rate limiting (10 req/min per IP)
- ✅ Input validation (express-validator)
- ✅ MongoDB injection protection
- ✅ CORS enabled
- ✅ Error handling middleware
- ✅ Audit logging for all transactions

### Frontend
- ✅ XSS prevention (React auto-escaping)
- ✅ CSRF protection
- ✅ No sensitive data in localStorage
- ✅ API calls through secure service layer

---

## 📝 Known Issues & Fixes

### ✅ Fixed: Balance Mismatch
**Issue:** Navbar shows 10,000 VE but detail page shows 9,750 VE  
**Fix:** Added real-time API polling (30s) + immediate refresh after join

### ✅ Fixed: UUID ESM Error
**Issue:** `uuid` package causing Vercel serverless error  
**Fix:** Replaced with `crypto.randomUUID()` (Node.js built-in)

### ✅ Fixed: Vercel Deploy Failure
**Issue:** GitHub auto-deploy failing with `ENOENT package.json`  
**Fix:** Created root `vercel.json` with monorepo config

### ✅ Fixed: MongoDB Connection Error
**Issue:** Invalid scheme error on Vercel  
**Fix:** Updated `MONGODB_URI` env variable with correct connection string

---

## 🎯 Future Enhancements

### Features
- [ ] Real authentication (JWT + refresh tokens)
- [ ] Email notifications for winners
- [ ] Payment gateway (Razorpay/Stripe)
- [ ] Admin dashboard with analytics
- [ ] Social media sharing
- [ ] Multi-language support (i18n)
- [ ] Push notifications

### Technical
- [ ] Unit tests (Vitest)
- [ ] E2E tests (Playwright)
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Docker containerization
- [ ] Redis caching for balance
- [ ] WebSocket for live updates
- [ ] TypeScript migration

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

---

## 📄 License

This project is for **educational/internship purposes**.

---

## 👨‍💻 Developer

Built during **VELoop Internship Part 2**

---

## 🎉 Acknowledgments

- **VELoop Team** - For the internship opportunity
- **React** - Powerful UI library
- **MongoDB Atlas** - Reliable cloud database
- **Vercel** - Seamless deployment platform

---

## 📞 Support

For questions or issues:
- 📧 Email: support@veloop.com
- 🐛 Issues: GitHub Issues tab
- 📚 Docs: This README

---

**Happy Coding!** 🚀✨
