# 📁 Kramik Project Structure

## Overview
Organized structure for the Kramik Engineering Hub platform with clear separation of concerns.

---

## 📂 Root Directory

```
kramik-hub/
├── backend/              # Backend API server
├── frontend/            # React frontend application
├── blockchain/          # Smart contracts & deployment
├── database/            # Database schemas & migrations
├── docker/              # Docker configuration
├── scripts/             # Utility scripts
├── docs/                # All documentation (organized)
├── .env                 # Root environment variables
├── .gitignore          # Git ignore rules
├── package.json        # Root package config
├── README.md           # Main project README
└── start-dev.ps1       # Quick start script (Windows)
```

---

## 🗂️ Documentation Structure (`docs/`)

### `docs/setup/` - Setup & Installation
- **BLOCKCHAIN_SETUP.md** - Complete blockchain configuration guide
- **BLOCKCHAIN_CHECKLIST.md** - Quick setup checklist

### `docs/features/` - Feature Documentation
- **BLOCKCHAIN_INTEGRATION.md** - Blockchain features explained
- **CREDITS_SYSTEM.md** - Credit system documentation
- **ATTENDANCE_SYSTEM.md** - Attendance tracking
- **FEATURES.md** - All platform features
- **STORAGE_ARCHITECTURE.md** - Data storage design
- **MONGODB_SCHEMA.md** - Database schema

### `docs/guides/` - User Guides
- **DEMO_GUIDE.md** - Platform walkthrough
- **TESTING_GUIDE.md** - How to test the platform
- **AI_SETUP_GUIDE.md** - AI integration guide
- **QUICK_START_AI.md** - Quick AI setup

### `docs/archive/` - Old/Deprecated Documentation
- Historical docs for reference only
- Not maintained

---

## 🎯 Backend Structure (`backend/`)

```
backend/
├── src/
│   ├── controllers/     # Business logic
│   │   ├── adminController.js
│   │   ├── authController.js
│   │   ├── geminiController.js
│   │   └── studentController.js
│   │
│   ├── middleware/      # Express middleware
│   │   └── auth.js      # JWT authentication
│   │
│   ├── models/          # Mongoose schemas
│   │   ├── User.js
│   │   ├── Assignment.js
│   │   ├── Schedule.js
│   │   └── StudentSchedule.js
│   │
│   └── routes/          # API routes
│       ├── admin.js
│       ├── auth.js
│       ├── gemini.js
│       ├── students.js
│       └── subjects.js
│
├── uploads/             # File uploads storage
├── .env                 # Backend config
├── package.json
└── server.js           # Entry point
```

---

## 🎨 Frontend Structure (`frontend/`)

```
frontend/
├── src/
│   ├── components/      # Reusable components
│   │   ├── auth/        # Auth components
│   │   │   └── ProtectedRoute.jsx
│   │   ├── common/      # Shared components
│   │   │   └── Header.jsx
│   │   ├── dashboard/   # Dashboard components
│   │   │   ├── ProfileCard.jsx
│   │   │   ├── StudentDashboard.jsx
│   │   │   ├── SubjectsGrid.jsx
│   │   │   └── AIBotTab.jsx
│   │   └── gemini/      # AI components
│   │       ├── SkillCoach.jsx
│   │       └── SubjectAnalyzer.jsx
│   │
│   ├── contexts/        # React contexts
│   │   ├── AuthContext.jsx
│   │   └── BlockchainContext.jsx
│   │
│   ├── pages/           # Main pages
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   └── Admin.jsx
│   │
│   ├── services/        # API & external services
│   │   ├── api.js              # REST API client
│   │   ├── auth.js             # Auth service
│   │   ├── blockchain.js       # Blockchain service
│   │   ├── gemini.js          # AI service
│   │   └── utils/
│   │       ├── blockchain-utils.js
│   │       └── encryption.js
│   │
│   ├── contracts/       # Smart contract ABIs
│   │   ├── KramikAuth.json
│   │   └── KramikAcademicRecords.json
│   │
│   ├── App.jsx          # Root component
│   ├── main.jsx         # Entry point
│   ├── App.css
│   └── index.css
│
├── .env                 # Frontend config
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

---

## ⛓️ Blockchain Structure (`blockchain/`)

```
blockchain/
├── contracts/           # Solidity smart contracts
│   ├── KramikAuth.sol
│   └── KramikAcademicRecords.sol
│
├── scripts/             # Deployment scripts
│   ├── deploy.js
│   ├── deploy-academic.js
│   └── export-abi.js    # Auto-export ABIs to frontend
│
├── test/                # Contract tests
│   ├── Kramik.Auth.js
│   └── KramikAcademicRecords.test.js
│
├── .env                 # Blockchain config (RPC, keys)
├── hardhat.config.js
└── package.json
```

---

## 🗄️ Database Structure (`database/`)

```
database/
└── migrations/          # SQL migration scripts
    ├── 001_initial_schema.sql
    └── 002_add_relations.sql
```

---

## 🐳 Docker Structure (`docker/`)

```
docker/
├── backend.Dockerfile
├── frontend.Dockerfile
├── docker-compose.yml
└── nginx.conf           # Nginx configuration
```

---

## 🔧 Scripts Directory (`scripts/`)

```
scripts/
└── setup.js             # Project setup automation
```

---

## 📋 Key Configuration Files

### Root Level
- **package.json** - Workspace commands (`npm run dev`)
- **.env** - Global environment variables
- **.gitignore** - Git ignore rules
- **README.md** - Main documentation
- **start-dev.ps1** - Windows quick start script

### Backend
- **backend/.env** - Database URL, JWT secret, API keys
- **backend/package.json** - Backend dependencies

### Frontend
- **frontend/.env** - API URL, contract addresses
- **frontend/package.json** - Frontend dependencies
- **frontend/vite.config.js** - Vite configuration
- **frontend/tailwind.config.js** - Tailwind CSS config

### Blockchain
- **blockchain/.env** - RPC URL, private key, Etherscan API
- **blockchain/hardhat.config.js** - Hardhat configuration

---

## 🔑 Environment Variables

### Backend (`.env`)
```env
NODE_ENV=development
PORT=5000
DATABASE_URL=mongodb://localhost:27017/kramik
JWT_SECRET=your-secret
JWT_EXPIRES_IN=7d
GEMINI_API_KEY=your-key
```

### Frontend (`.env`)
```env
VITE_API_URL=http://localhost:5000
VITE_CONTRACT_ADDRESS=0x...
VITE_ACADEMIC_CONTRACT_ADDRESS=0x...
VITE_BLOCKCHAIN_NETWORK=sepolia
```

### Blockchain (`.env`)
```env
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/...
PRIVATE_KEY=your-wallet-key
ETHERSCAN_API_KEY=your-key
```

---

## 🚀 Quick Commands

```bash
# Root level
npm run dev              # Start both frontend & backend
npm run dev:frontend     # Frontend only
npm run dev:backend      # Backend only
npm install              # Install all dependencies

# Backend
cd backend
npm start                # Start server
npm run dev              # Start with nodemon

# Frontend
cd frontend
npm run dev              # Start Vite dev server
npm run build            # Build for production

# Blockchain
cd blockchain
npm run compile          # Compile contracts
npm run deploy           # Deploy to Sepolia
npm run test             # Run tests
npm run export-abi       # Export ABIs to frontend
```

---

## 📦 Dependencies Overview

### Frontend
- **react** - UI framework
- **vite** - Build tool
- **tailwindcss** - Styling
- **web3** - Blockchain
- **axios** - HTTP client
- **react-router-dom** - Routing

### Backend
- **express** - Web framework
- **mongoose** - MongoDB ODM
- **jsonwebtoken** - Authentication
- **multer** - File uploads
- **bcryptjs** - Password hashing
- **cors** - CORS middleware

### Blockchain
- **hardhat** - Development framework
- **@nomicfoundation/hardhat-toolbox** - Hardhat plugins
- **dotenv** - Environment variables

---

## 🎯 Best Practices

1. **Never commit `.env` files** - Use `.env.example` as template
2. **Keep docs organized** - Use proper subdirectories
3. **Update README** - When adding major features
4. **Archive old docs** - Don't delete, move to archive/
5. **Run tests** - Before committing changes
6. **Follow structure** - Keep files in proper directories

---

**This structure ensures clean organization and easy navigation! 🚀**
