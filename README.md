# 🎓 Kramik Engineering Hub

A comprehensive educational platform for engineering students with AI-powered features, blockchain-verified credentials, and real-time collaboration tools.

---

## 🌟 Key Features

### 🤖 **AI-Powered Learning**
- **Gemini AI Integration** - Smart study coach and subject analyzer
- **Interactive AI Bot** - Real-time doubt solving and Q&A
- **Personalized Recommendations** - Customized learning paths

### ⛓️ **Blockchain Verification**
- **Immutable Academic Records** - Quiz scores permanently stored on Ethereum
- **Verifiable Credentials** - Blockchain-verified schedule completions
- **Transparent Progress** - On-chain credit system

### 📚 **Course Management**
- **Dynamic Schedules** - Admin-created schedules sync to student dashboard
- **Credit System** - Earn and claim credits for completions
- **Progress Tracking** - Real-time quiz-based progress calculation

### 🎯 **Interactive Quizzes**
- **Subject-Specific Quizzes** - Data Structures, DBMS, OS, Networks, and more
- **Difficulty Levels** - Beginner → Intermediate → Advanced → Expert
- **Achievement System** - Points, levels, and milestones
- **Blockchain Recording** - Every 5 questions auto-recorded on-chain

### 👥 **Admin Panel**
- **User Management** - Student registration and profile management
- **Assignment Creation** - Create and distribute assignments with file uploads
- **Schedule Management** - Create weekly schedules with resources
- **Analytics Dashboard** - Real-time insights and statistics

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- MongoDB
- MetaMask (for blockchain features)
- Infura/Alchemy account (for blockchain deployment)

### Installation

```bash
# Clone the repository
git clone https://github.com/Adia12528/Kramik.git
cd kramik-hub

# Install all dependencies
npm install

# Start development servers
npm run dev
```

### Default Credentials

**Student:**
- Email: `student`
- Password: `password`

**Admin:**
- Email: `admin`
- Password: `password`

---

## 📁 Project Structure

```
kramik-hub/
├── backend/                 # Node.js Express API
├── frontend/               # React + Vite
├── blockchain/            # Smart contracts
├── docs/                 # Documentation
│   ├── setup/           # Setup guides
│   ├── features/        # Feature docs
│   ├── guides/          # User guides
│   └── archive/         # Old documentation
├── database/            # Database schemas
├── docker/              # Docker configuration
└── scripts/             # Utility scripts
```

---

## 🔧 Technology Stack

**Frontend:** React 18, Vite, Tailwind CSS, Web3.js  
**Backend:** Node.js, Express, MongoDB, JWT  
**Blockchain:** Solidity 0.8.19, Hardhat, Ethereum (Sepolia)  
**AI:** Google Gemini AI

---

## 📚 Documentation

- **[Blockchain Setup](docs/setup/BLOCKCHAIN_SETUP.md)** - Complete blockchain configuration
- **[Features Guide](docs/features/BLOCKCHAIN_INTEGRATION.md)** - Blockchain features
- **[Credits System](docs/features/CREDITS_SYSTEM.md)** - How credits work
- **[Demo Guide](docs/guides/DEMO_GUIDE.md)** - Platform walkthrough

---

## 🛠️ Development

```bash
# Run tests
npm test

# Build for production
npm run build

# Deploy blockchain contracts
cd blockchain
npm run deploy
```

---

## 🗺️ Roadmap

- [x] AI-powered quiz system
- [x] Blockchain credential verification
- [x] Admin schedule management
- [x] Credit claiming system
- [x] Real-time progress tracking
- [ ] NFT achievement badges
- [ ] DeFi credit tokenization
- [ ] Mobile app (React Native)

---

**Built with ❤️ for engineering students worldwide 🌍**
