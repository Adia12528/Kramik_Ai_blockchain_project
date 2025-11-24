# ✅ Blockchain Integration Checklist

## What You Need to Add/Configure

### 📦 1. Install Additional Dependencies

```bash
# Frontend - Web3 library (if not already installed)
cd frontend
npm install web3

# Blockchain - dotenv for environment variables
cd blockchain
npm install dotenv --save-dev
```

### 🔧 2. Configure Environment Variables

#### Frontend `.env` File
Create `frontend/.env` with:
```env
VITE_API_URL=http://localhost:5000
VITE_BLOCKCHAIN_NETWORK=sepolia
VITE_SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_ID
VITE_CONTRACT_ADDRESS=0x...  # After deployment
VITE_ACADEMIC_CONTRACT_ADDRESS=0x...  # After deployment
VITE_CHAIN_ID=11155111
```

#### Blockchain `.env` File
Create `blockchain/.env` with:
```env
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_ID
PRIVATE_KEY=your_wallet_private_key_without_0x
ETHERSCAN_API_KEY=YOUR_ETHERSCAN_KEY
```

### 🌐 3. Get API Keys

- [ ] **Infura/Alchemy Account** → Get RPC URL
  - Sign up at https://infura.io or https://alchemy.com
  - Create new project (Sepolia network)
  - Copy HTTPS endpoint

- [ ] **MetaMask Wallet** → Get Private Key
  - Install MetaMask extension
  - Create/import wallet
  - Export private key (for deployment only)
  - Get test ETH from https://sepoliafaucet.com

- [ ] **Etherscan API** (Optional)
  - Sign up at https://etherscan.io
  - Generate API key for contract verification

### 🚀 4. Deploy Smart Contracts

```bash
cd blockchain

# 1. Compile contracts (auto-exports ABIs to frontend)
npm run compile

# 2. Deploy KramikAuth contract
npm run deploy

# 3. Deploy KramikAcademicRecords contract
npm run deploy-academic

# 4. Save both contract addresses to frontend/.env
```

### 📝 5. Update Contract Addresses

After deployment, update `frontend/.env`:
```env
VITE_CONTRACT_ADDRESS=0xYourKramikAuthAddress
VITE_ACADEMIC_CONTRACT_ADDRESS=0xYourAcademicRecordsAddress
```

### ✅ 6. Verify Everything Works

- [ ] Backend running on port 5000
- [ ] Frontend running on port 5173
- [ ] MetaMask installed and on Sepolia network
- [ ] MetaMask has test ETH (>0.1 ETH)
- [ ] Wallet connects in header
- [ ] Quiz submission triggers blockchain transaction
- [ ] Schedule completion triggers blockchain transaction
- [ ] Blockchain stats appear in Progress tab

---

## 🎯 What's Already Done

✅ Smart contracts created (`KramikAuth.sol`, `KramikAcademicRecords.sol`)  
✅ Blockchain service with all methods (`frontend/src/services/blockchain.js`)  
✅ Dashboard integration for quiz & schedule recording  
✅ Blockchain stats widget in Progress tab  
✅ Wallet connection button in header  
✅ BlockchainContext provider wrapping app  
✅ Deployment scripts ready  
✅ Test suite for contracts  
✅ Auto ABI export script  

---

## 🛠️ Quick Start Commands

```bash
# Terminal 1: Start backend
cd backend
npm start

# Terminal 2: Start frontend
cd frontend
npm run dev

# Terminal 3: Deploy blockchain (one-time setup)
cd blockchain
npm install
npm run compile
npm run deploy
npm run deploy-academic
```

---

## 🔍 Files You Need to Create

1. `frontend/.env` - Frontend environment variables
2. `blockchain/.env` - Blockchain deployment credentials

## 📁 Files Already Created

1. ✅ `blockchain/contracts/KramikAcademicRecords.sol`
2. ✅ `blockchain/scripts/deploy-academic.js`
3. ✅ `blockchain/scripts/export-abi.js`
4. ✅ `blockchain/test/KramikAcademicRecords.test.js`
5. ✅ `frontend/src/services/blockchain.js` (enhanced)
6. ✅ `frontend/src/pages/Dashboard.jsx` (blockchain integrated)
7. ✅ `frontend/src/components/common/Header.jsx` (wallet button added)
8. ✅ `BLOCKCHAIN_SETUP.md` (complete setup guide)
9. ✅ `BLOCKCHAIN_INTEGRATION.md` (feature documentation)

---

## 💡 Pro Tips

1. **Use Test Network First**: Deploy to Sepolia before mainnet
2. **Keep Private Keys Secret**: Never commit `.env` files
3. **Get Test ETH**: Use faucets generously (0.5 ETH recommended)
4. **Test Locally**: Use `npm run node` for free local testing
5. **Check Console**: Browser F12 shows blockchain transaction logs

---

## 🎓 What Happens After Setup

1. Students see "Connect Wallet" button in header
2. After connecting, every 5 quiz questions → blockchain record
3. Claiming schedule credits → blockchain record
4. Progress tab shows blockchain verification stats
5. All records permanently stored on Ethereum
6. Students can share wallet address for credential verification

---

## 🆘 Common Issues

**Issue**: "Cannot find module 'web3'"  
**Fix**: `cd frontend && npm install web3`

**Issue**: "Contract not initialized"  
**Fix**: Check contract addresses in `frontend/.env`

**Issue**: "Insufficient funds"  
**Fix**: Get test ETH from https://sepoliafaucet.com

**Issue**: "Wrong network"  
**Fix**: Switch MetaMask to Sepolia testnet

---

## 🎉 Success Indicators

When everything is working:
- ✅ Wallet address shown in header (green badge)
- ✅ Quiz popup: "🔗 Blockchain Verified!"
- ✅ Schedule popup: "🔗 Blockchain Verified!"
- ✅ Progress tab shows blockchain stats
- ✅ Etherscan shows your transactions

**You're all set! Your platform is now blockchain-enabled! 🚀⛓️**
