# 🎁 VELoop Rewards - Giveaway Platform

A full-stack giveaway management platform built with **React + Express + MongoDB**.

## 🚀 Features

### ✨ User Features
- 🎯 **Join Giveaways** - Participate in active giveaways with entry fees
- 💰 **Real-time Balance** - VEs/SVEs/Tokens balance updates instantly
- 🏆 **My Participations** - Track all joined giveaways in one place
- 🎁 **Prize Claims** - Submit claim details for won prizes
- ⏰ **Live Countdown** - Real-time countdown to giveaway end
- 📊 **Participation Stats** - View total entries and prizes won

### 🛠️ Admin Features (Demo Mode)
- 👤 **Admin User** - Pre-configured admin account (no login required)
- 💳 **Balance: 1000 VEs** - Test with initial balance
- ✅ **Join Multiple Prizes** - Participate in unlimited giveaways
- 🎨 **Dark Theme UI** - Glassmorphic design with purple/gold accents

### 🔧 Technical Features
- ⚡ **React 18** with Vite for blazing-fast development
- 🎭 **Framer Motion** animations for smooth UX
- 🗄️ **MongoDB** for data persistence
- 🔐 **Rate Limiting** to prevent abuse
- 📝 **Audit Logs** for all transactions
- 🎨 **Responsive Design** - Works on all devices

---

## 📦 Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **Framer Motion** - Animations
- **React Router** - Navigation
- **Context API** - State management
- **CSS Modules** - Scoped styling

### Backend
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **Express Rate Limit** - DDoS protection
- **UUID** - Unique IDs

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ installed
- **MongoDB** running locally or cloud
- **Git** for version control

### 1. Clone Repository
```bash
git clone <your-repo-url>
cd "VELoop Intership part 2"
```

### 2. Backend Setup
```bash
cd backend
npm install

# Create .env file (copy from .env.example)
# Update MongoDB connection string

npm start
# Server runs on http://localhost:5000
```

### 3. Frontend Setup
```bash
cd frontend
npm install

# Create .env file
# VITE_API_URL=http://localhost:5000

npm run dev
# App runs on http://localhost:5173
```

### 4. Open Browser
```
http://localhost:5173
```

---

## 📁 Project Structure

```
VELoop Intership part 2/
├── backend/
│   ├── src/
│   │   ├── config/         # Database config
│   │   ├── controllers/    # Route handlers
│   │   ├── middleware/     # Auth, rate limit, errors
│   │   ├── models/         # MongoDB schemas
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── utils/          # Seed data
│   │   └── validators/     # Input validation
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   │   └── assets/         # Prize images
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── config/         # Admin user config
│   │   ├── context/        # Global state (UserContext)
│   │   ├── data/           # Mock data
│   │   ├── pages/          # Route pages
│   │   ├── services/       # API calls
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

---

## 🎯 Key Features Explained

### 1. **Admin Mode (No Login)**
- Pre-configured admin user: `ADMIN_USER`
- Balance: 1000 VEs, 1500 SVEs, 5000 Tokens
- No authentication required for demo
- Can join unlimited giveaways

### 2. **Real-Time Balance Updates**
```javascript
// Join prize (50 VEs)
Before: 🪙 1000 VE
After:  🪙 950 VE  ✅ Instant update!
```

### 3. **My Participations Section**
- Shows all joined giveaways
- Entry fees and dates
- Winner cards highlighted
- Claim prize button

### 4. **Database Persistence**
All actions saved to MongoDB:
- `GiveawayParticipation` - User entries
- `GiveawayEntryTransaction` - Balance deductions
- `PrizeClaim` - Claim submissions
- `AuditLog` - All actions logged

---

## 🛠️ API Endpoints

### Public Endpoints
```
GET  /api/giveaways/current          # Current active giveaway
GET  /api/giveaways/stats            # Platform statistics
GET  /api/giveaways/previous         # Past giveaways
GET  /api/giveaways/:id              # Giveaway by ID
GET  /api/giveaways/:id/winners      # Winners list
```

### Participation (No Auth Required for Demo)
```
POST /api/giveaways/:id/join         # Join giveaway
POST /api/giveaways/:id/claim        # Submit prize claim
GET  /api/giveaways/:id/my-claim     # Get my claim
```

---

## 🎨 UI Components

### Main Pages
- **GiveawayPage** - Homepage with all sections
- **GiveawayDetailPage** - Individual prize details

### Key Components
- **Navbar** - Balance display + user menu
- **GiveawayHero** - Hero section with countdown
- **FeaturedGiveaways** - Prize cards grid
- **MyParticipations** - User entries tracking
- **PrizeClaimModal** - Claim submission form
- **ConfirmJoinModal** - Join confirmation
- **WinnersTabs** - Current/previous winners
- **Countdown** - Real-time timer

---

## 🧪 Testing

### Manual Testing
```bash
# 1. Start backend
cd backend && npm start

# 2. Start frontend
cd frontend && npm run dev

# 3. Test flow
- Open http://localhost:5173
- Check navbar: 1000 VE
- Join iPhone prize (50 VEs)
- ✅ Balance: 950 VE
- Scroll to "My Participations"
- ✅ See iPhone card
- Join more prizes
- ✅ All reflect instantly
```

### Database Verification
```bash
mongosh
use veloop_rewards

# Check participations
db.giveawayparticipations.find({ userId: 'ADMIN_USER' }).pretty()

# Check transactions
db.giveawayentrytransactions.find({ userId: 'ADMIN_USER' }).pretty()

# Check balance
db.auditlogs.find({ userId: 'ADMIN_USER', action: 'JOIN_GIVEAWAY' })
```

---

## 🚀 Deployment

### Vercel (Frontend)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel

# Production
vercel --prod
```

### Backend Deployment Options
1. **Railway** - Automatic MongoDB included
2. **Render** - Free tier available
3. **Heroku** - Classic option
4. **DigitalOcean** - VPS with full control

### Environment Variables

**Frontend (.env):**
```env
VITE_API_URL=https://your-backend-url.com
```

**Backend (.env):**
```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/veloop_rewards
PORT=5000
NODE_ENV=production
```

---

## 📊 Database Schema

### GiveawayParticipation
```javascript
{
  userId: 'ADMIN_USER',
  giveawayId: 'GW-2026-09',
  prizeId: 'PRIZE-001',
  entryFee: 50,
  entryCurrency: 'VEs',
  status: 'ACTIVE',
  joinedAt: Date
}
```

### GiveawayEntryTransaction
```javascript
{
  transactionId: 'TXN-abc123',
  userId: 'ADMIN_USER',
  type: 'DEBIT',
  amount: 50,
  currency: 'VEs',
  balanceBefore: 1000,
  balanceAfter: 950,
  status: 'SUCCESS'
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
    fullName: '...',
    phone: '...',
    address: '...'
  },
  status: 'SUBMITTED'
}
```

---

## 🎨 Design System

### Colors
- **Purple** - `#7C3AED` - Primary brand
- **Gold** - `#F59E0B` - Premium accents
- **Emerald** - `#10B981` - Success states
- **Rose** - `#F43F5E` - Errors/warnings
- **Indigo** - `#6366F1` - Info/links

### Typography
- **Display** - Inter (headings)
- **Body** - System fonts (content)

### Spacing
- Base: 4px grid system
- Padding: 0.5rem to 4rem
- Gaps: 0.5rem to 2rem

---

## 🔐 Security Features

### Backend
- ✅ Rate limiting (10 requests/min)
- ✅ Input validation
- ✅ MongoDB injection protection
- ✅ CORS enabled
- ✅ Error handling middleware
- ✅ Audit logging

### Frontend
- ✅ XSS prevention (React auto-escaping)
- ✅ CSRF protection
- ✅ Secure API calls
- ✅ No sensitive data in localStorage

---

## 📝 TODO / Future Enhancements

### Features
- [ ] Real authentication system
- [ ] Email notifications
- [ ] Payment gateway integration
- [ ] Admin dashboard
- [ ] Analytics charts
- [ ] Social sharing
- [ ] Multi-language support

### Technical
- [ ] Unit tests (Jest)
- [ ] E2E tests (Playwright)
- [ ] CI/CD pipeline
- [ ] Docker containers
- [ ] Redis caching
- [ ] WebSocket for live updates

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open Pull Request

---

## 📄 License

This project is for educational/internship purposes.

---

## 👨‍💻 Developer

Built during **VELoop Internship Part 2**

---

## 🎉 Acknowledgments

- **VELoop Team** - For the opportunity
- **React** - Amazing UI library
- **MongoDB** - Flexible database
- **Vercel** - Easy deployment

---

## 📞 Support

For questions or issues:
- 📧 Email: support@veloop.com
- 🐛 Issues: GitHub Issues tab

---

**Happy Coding!** 🚀✨
#   U p d a t e d   M o n g o D B   c r e d e n t i a l s  
 