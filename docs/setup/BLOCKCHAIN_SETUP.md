# 🚀 Blockchain Setup Guide - Kramik Hub

## Prerequisites

Before setting up blockchain features, ensure you have:

✅ **Node.js** (v16 or higher)  
✅ **MetaMask** browser extension installed  
✅ **Infura/Alchemy** account (for RPC URL)  
✅ **Sepolia Testnet ETH** (from faucet)  

---

## 📦 Step 1: Install Dependencies

### Backend Dependencies
```bash
cd backend
npm install
```

### Frontend Dependencies
```bash
cd frontend
npm install web3
```

### Blockchain Dependencies
```bash
cd blockchain
npm install
npm install dotenv --save-dev
```

---

## 🔧 Step 2: Environment Configuration

### 2.1 Frontend Environment

Create `frontend/.env`:
```bash
cp frontend/.env.example frontend/.env
```

Edit `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000
VITE_BLOCKCHAIN_NETWORK=sepolia
VITE_SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID
VITE_CHAIN_ID=11155111

# These will be filled after deployment
VITE_CONTRACT_ADDRESS=
VITE_ACADEMIC_CONTRACT_ADDRESS=
```

### 2.2 Blockchain Environment

Create `blockchain/.env`:
```bash
cp blockchain/.env.example blockchain/.env
```

Edit `blockchain/.env`:
```env
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID
PRIVATE_KEY=your_wallet_private_key_without_0x
ETHERSCAN_API_KEY=YOUR_ETHERSCAN_API_KEY
```

**⚠️ SECURITY WARNING:**
- Never commit `.env` files to Git!
- Keep your `PRIVATE_KEY` secret!
- Use a dedicated wallet for deployment (not your main wallet)

---

## 🌐 Step 3: Get Required API Keys

### 3.1 Infura/Alchemy RPC URL

**Option A: Infura**
1. Go to https://infura.io
2. Sign up / Log in
3. Create new project
4. Select "Sepolia" network
5. Copy the HTTPS endpoint
6. Add to `.env` as `SEPOLIA_RPC_URL`

**Option B: Alchemy**
1. Go to https://www.alchemy.com
2. Create account
3. Create new app (Sepolia network)
4. Copy HTTP URL
5. Add to `.env`

### 3.2 Etherscan API Key (Optional, for verification)

1. Go to https://etherscan.io
2. Create account
3. Navigate to API Keys section
4. Generate new API key
5. Add to `blockchain/.env`

### 3.3 MetaMask Wallet Setup

1. Install MetaMask extension
2. Create/Import wallet
3. Switch to **Sepolia Test Network**
   - Click network dropdown
   - Enable "Show test networks" in settings
   - Select "Sepolia"

4. Get test ETH from faucet:
   - https://sepoliafaucet.com
   - https://www.infura.io/faucet/sepolia
   - Paste your wallet address
   - Request test ETH (0.5 ETH recommended)

5. Export Private Key (for deployment):
   - MetaMask → Account Details → Export Private Key
   - Copy (without 0x prefix)
   - Paste in `blockchain/.env`

---

## 🏗️ Step 4: Compile Smart Contracts

```bash
cd blockchain
npm run compile
```

You should see:
```
Compiled 2 Solidity files successfully
✓ KramikAuth.sol
✓ KramikAcademicRecords.sol
```

---

## 🚀 Step 5: Deploy Contracts

### 5.1 Deploy KramikAuth Contract

```bash
npm run deploy
```

**Expected Output:**
```
🚀 Deploying KramikAuth contract...
✅ KramikAuth deployed to: 0xABC123...
📋 Save this address in your .env
```

**Copy the address** and add to `frontend/.env`:
```env
VITE_CONTRACT_ADDRESS=0xABC123...
```

### 5.2 Deploy KramikAcademicRecords Contract

```bash
npm run deploy-academic
```

**Expected Output:**
```
🚀 Deploying KramikAcademicRecords contract...
✅ KramikAcademicRecords deployed to: 0xDEF456...
📋 Save this address in your .env
```

**Copy the address** and add to `frontend/.env`:
```env
VITE_ACADEMIC_CONTRACT_ADDRESS=0xDEF456...
```

### 5.3 Update Contract ABIs

After deployment, copy the ABI files:

```bash
# From blockchain/artifacts/contracts/
cp blockchain/artifacts/contracts/KramikAuth.sol/KramikAuth.json frontend/src/contracts/
cp blockchain/artifacts/contracts/KramikAcademicRecords.sol/KramikAcademicRecords.json frontend/src/contracts/
```

---

## 🧪 Step 6: Test Deployment (Optional)

```bash
cd blockchain
npm test
```

---

## 🎯 Step 7: Start Application

### Terminal 1: Backend
```bash
cd backend
npm start
```

### Terminal 2: Frontend
```bash
cd frontend
npm run dev
```

---

## ✅ Step 8: Verify Blockchain Integration

### 8.1 Connect Wallet
1. Open http://localhost:5173
2. Login as student
3. Click "Connect Wallet" in header
4. Approve MetaMask connection
5. You should see: `0xABC1...DEF4` (your wallet address)

### 8.2 Test Quiz Blockchain Recording
1. Go to Dashboard → Quiz section
2. Select a subject and start quiz
3. Answer 5 questions correctly
4. You should see: "🔗 Blockchain Verified!" popup
5. MetaMask will prompt for transaction approval
6. Approve transaction
7. Wait for confirmation

### 8.3 Test Schedule Blockchain Recording
1. Go to Dashboard → Schedule tab
2. Find a schedule entry
3. Click "Claim Credits"
4. MetaMask prompts for transaction
5. Approve and wait
6. You should see blockchain verification

### 8.4 Check Blockchain Stats
1. Go to Dashboard → Progress tab
2. Scroll to "Blockchain Verified Records" section
3. You should see:
   - Total credits on-chain
   - Verified quizzes count
   - Verified schedules count
   - Your wallet address

---

## 🔍 Step 9: Verify on Blockchain Explorer

1. Go to https://sepolia.etherscan.io
2. Paste your wallet address
3. Click on "Internal Txns" tab
4. You should see transactions to:
   - KramikAuth contract
   - KramikAcademicRecords contract

---

## 🐛 Troubleshooting

### Issue: "Failed to connect wallet"
**Solution:**
- Install MetaMask extension
- Switch to Sepolia network
- Refresh page

### Issue: "Insufficient funds for gas"
**Solution:**
- Get more test ETH from faucet
- https://sepoliafaucet.com

### Issue: "Contract not initialized"
**Solution:**
- Check contract addresses in `frontend/.env`
- Ensure ABIs are copied to `frontend/src/contracts/`
- Restart frontend dev server

### Issue: "Transaction failed"
**Solution:**
- Check you're on Sepolia network
- Verify you have enough test ETH
- Check gas price settings in MetaMask

### Issue: "Module not found: web3"
**Solution:**
```bash
cd frontend
npm install web3
```

---

## 📊 Local Testing (Without Sepolia)

For development without spending gas:

```bash
# Terminal 1: Start local blockchain
cd blockchain
npm run node

# Terminal 2: Deploy to local network
npm run deploy-local
npm run deploy-academic-local

# Update frontend/.env
VITE_BLOCKCHAIN_NETWORK=localhost
VITE_SEPOLIA_RPC_URL=http://127.0.0.1:8545
```

In MetaMask:
1. Add network manually
2. Network Name: Localhost 8545
3. RPC URL: http://127.0.0.1:8545
4. Chain ID: 1337
5. Currency: ETH

---

## 🎉 Success Checklist

- [ ] Dependencies installed
- [ ] Environment variables configured
- [ ] MetaMask installed and funded
- [ ] Contracts compiled successfully
- [ ] Contracts deployed to Sepolia
- [ ] Contract addresses added to `.env`
- [ ] ABIs copied to frontend
- [ ] Backend running on port 5000
- [ ] Frontend running on port 5173
- [ ] Wallet connected in dashboard
- [ ] Quiz blockchain recording works
- [ ] Schedule blockchain recording works
- [ ] Blockchain stats displayed correctly

---

## 📞 Need Help?

**Common Resources:**
- Sepolia Faucet: https://sepoliafaucet.com
- Infura Dashboard: https://infura.io/dashboard
- Sepolia Explorer: https://sepolia.etherscan.io
- MetaMask Support: https://support.metamask.io

**Check Console Logs:**
```javascript
// Browser console (F12)
// Look for blockchain-related messages

// Backend terminal
// Watch for API errors
```

---

## 🎓 What You've Achieved

✅ **Immutable Academic Records** - Quiz scores permanently on blockchain  
✅ **Verifiable Credentials** - Share wallet address for proof  
✅ **Tamper-Proof System** - No one can alter blockchain records  
✅ **Global Recognition** - Ethereum blockchain works worldwide  
✅ **Future-Ready** - Foundation for NFT credentials & DeFi features  

**Congratulations! Your educational platform is now blockchain-powered! 🚀⛓️**
