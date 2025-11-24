# 🆓 Complete Free Deployment Guide

Deploy your entire Kramik project **100% FREE** with all features working!

---

## 🎯 Deployment Strategy

Since your project has **Frontend + Backend + Database + Blockchain**, we'll use multiple free services:

| Component | Service | Why | Cost |
|-----------|---------|-----|------|
| **Frontend** | Vercel | Fast, React-optimized | FREE |
| **Backend API** | Render | Always-on free tier | FREE |
| **Database** | MongoDB Atlas | 512MB free tier | FREE |
| **File Storage** | Cloudinary | 25GB free storage | FREE |
| **Blockchain** | Sepolia Testnet | Test network | FREE |

---

## 📋 Part 1: Database Setup (MongoDB Atlas)

### Step 1: Create MongoDB Atlas Account

1. **Go to**: [mongodb.com/cloud/atlas/register](https://www.mongodb.com/cloud/atlas/register)
2. **Sign up** with Google/GitHub (fastest)
3. **Choose**: FREE M0 Cluster (Shared)

### Step 2: Create Cluster

1. **Cloud Provider**: AWS
2. **Region**: Choose closest to you (e.g., `us-east-1`, `eu-west-1`)
3. **Cluster Name**: `kramik-cluster`
4. Click **"Create Cluster"** (takes 3-5 minutes)

### Step 3: Create Database User

1. **Security** → **Database Access**
2. Click **"Add New Database User"**
   - Username: `kramik_admin`
   - Password: Generate secure password (save it!)
   - Database User Privileges: **Read and write to any database**
3. Click **"Add User"**

### Step 4: Whitelist All IPs

1. **Security** → **Network Access**
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"**
4. IP: `0.0.0.0/0` (allows Render and Vercel)
5. Click **"Confirm"**

### Step 5: Get Connection String

1. Click **"Connect"** on your cluster
2. Choose **"Connect your application"**
3. Copy the connection string:
   ```
   mongodb+srv://kramik_admin:<password>@kramik-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
4. Replace `<password>` with your actual password
5. Add database name: `mongodb+srv://kramik_admin:PASSWORD@kramik-cluster.xxxxx.mongodb.net/kramik?retryWrites=true&w=majority`

✅ **Save this connection string!** You'll need it for backend deployment.

---

## 📋 Part 2: File Storage Setup (Cloudinary)

### Step 1: Create Cloudinary Account

1. **Go to**: [cloudinary.com/users/register_free](https://cloudinary.com/users/register_free)
2. **Sign up** (25GB free storage + 25GB bandwidth/month)
3. **Verify email**

### Step 2: Get API Credentials

1. Go to **Dashboard**
2. Copy these values:
   - **Cloud Name**: e.g., `dxxxxx`
   - **API Key**: e.g., `123456789012345`
   - **API Secret**: e.g., `abcdefghijklmnop`

✅ **Save these credentials!**

---

## 📋 Part 3: Backend Deployment (Render.com)

### Step 1: Prepare Backend for Deployment

First, let's create a `render.yaml` configuration:

1. **Create file**: `render.yaml` in your project root
2. **Add this content**:

```yaml
services:
  - type: web
    name: kramik-backend
    env: node
    region: oregon
    plan: free
    buildCommand: cd backend && npm install
    startCommand: cd backend && npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 5000
      - key: DATABASE_URL
        sync: false
      - key: JWT_SECRET
        generateValue: true
      - key: JWT_EXPIRES_IN
        value: 7d
      - key: GEMINI_API_KEY
        sync: false
      - key: CLOUDINARY_CLOUD_NAME
        sync: false
      - key: CLOUDINARY_API_KEY
        sync: false
      - key: CLOUDINARY_API_SECRET
        sync: false
```

### Step 2: Push Changes to GitHub

```bash
git add .
git commit -m "Add Render deployment configuration"
git push origin main
```

### Step 3: Deploy to Render

1. **Go to**: [render.com](https://render.com)
2. **Sign up** with GitHub
3. Click **"New +"** → **"Web Service"**
4. **Connect** your GitHub repository: `Kramik_Ai_blockchain_project`
5. **Configure**:
   - **Name**: `kramik-backend`
   - **Region**: Oregon (US West) or Frankfurt (Europe)
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: **FREE**

### Step 4: Add Environment Variables

Click **"Environment"** → **"Add Environment Variable"**:

```env
DATABASE_URL=mongodb+srv://kramik_admin:PASSWORD@kramik-cluster.xxxxx.mongodb.net/kramik?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-key-minimum-32-characters-long-for-security
JWT_EXPIRES_IN=7d
GEMINI_API_KEY=your-gemini-api-key-from-google-ai-studio
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
NODE_ENV=production
PORT=5000
```

💡 **Get Gemini API Key**: [ai.google.dev/gemini-api/docs/api-key](https://ai.google.dev/gemini-api/docs/api-key) (FREE)

### Step 5: Deploy

1. Click **"Create Web Service"**
2. Wait 5-10 minutes for deployment
3. Your backend URL: `https://kramik-backend.onrender.com`

### Step 6: Test Backend

Visit: `https://kramik-backend.onrender.com/health`

Expected response:
```json
{
  "status": "OK",
  "timestamp": "2025-11-24T...",
  "service": "Kramik Backend API",
  "version": "1.0.0"
}
```

✅ **Backend is live!**

⚠️ **Note**: Free tier spins down after 15 minutes of inactivity. First request after spin-down takes ~30 seconds.

---

## 📋 Part 4: Frontend Deployment (Vercel)

### Step 1: Update Frontend Environment

Create `frontend/.env.production`:

```env
VITE_API_URL=https://kramik-backend.onrender.com
VITE_CONTRACT_ADDRESS=0x... (your deployed contract address)
VITE_ACADEMIC_CONTRACT_ADDRESS=0x... (your academic contract address)
VITE_BLOCKCHAIN_NETWORK=sepolia
```

### Step 2: Push to GitHub

```bash
git add .
git commit -m "Add production environment configuration"
git push origin main
```

### Step 3: Deploy to Vercel

1. **Go to**: [vercel.com](https://vercel.com)
2. **Sign up** with GitHub
3. Click **"Add New Project"**
4. **Import** your repository: `Kramik_Ai_blockchain_project`
5. **Configure**:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### Step 4: Add Environment Variables

Click **"Environment Variables"**:

```env
VITE_API_URL=https://kramik-backend.onrender.com
VITE_BLOCKCHAIN_NETWORK=sepolia
```

(Add contract addresses after blockchain deployment)

### Step 5: Deploy

1. Click **"Deploy"**
2. Wait 2-3 minutes
3. Your app URL: `https://kramik-hub.vercel.app`

✅ **Frontend is live!**

---

## 📋 Part 5: Blockchain Deployment (Sepolia Testnet)

### Step 1: Get Test ETH

1. **Get a wallet**: Install [MetaMask](https://metamask.io)
2. **Switch to Sepolia network**
3. **Get free test ETH** from faucets:
   - [sepoliafaucet.com](https://sepoliafaucet.com)
   - [cloud.google.com/application/web3/faucet/ethereum/sepolia](https://cloud.google.com/application/web3/faucet/ethereum/sepolia)
   - Need ~0.1 ETH for deployment

### Step 2: Setup Deployment Environment

Create `blockchain/.env`:

```env
SEPOLIA_RPC_URL=https://ethereum-sepolia-rpc.publicnode.com
PRIVATE_KEY=your_wallet_private_key_here
ETHERSCAN_API_KEY=your_etherscan_api_key (optional, for verification)
```

💡 **Get RPC URL**: Use free public RPC or [Infura](https://infura.io) (free tier)

💡 **Export Private Key**: MetaMask → Account Details → Export Private Key

⚠️ **NEVER commit .env to GitHub!** Add to `.gitignore`

### Step 3: Deploy Contracts

```bash
cd blockchain
npm install
npx hardhat compile
npx hardhat run scripts/deploy.js --network sepolia
npx hardhat run scripts/deploy-academic.js --network sepolia
```

**Save the contract addresses** printed in console!

### Step 4: Update Frontend with Contract Addresses

Update Vercel environment variables:

```env
VITE_CONTRACT_ADDRESS=0xYourAuthContractAddress
VITE_ACADEMIC_CONTRACT_ADDRESS=0xYourAcademicContractAddress
```

Redeploy frontend (automatic on Vercel when you update env vars and trigger redeploy).

✅ **Blockchain contracts deployed!**

---

## 📋 Part 6: Final Configuration & Testing

### Update CORS in Backend

Edit `backend/server.js`:

```javascript
app.use(cors({
  origin: [
    'https://kramik-hub.vercel.app', // Your Vercel domain
    'http://localhost:3000' // For local testing
  ],
  credentials: true
}))
```

Push to GitHub:
```bash
git add .
git commit -m "Update CORS for production"
git push origin main
```

Render will auto-deploy the update.

---

## 🧪 Complete Testing Checklist

### Test Backend
- [ ] Visit `https://kramik-backend.onrender.com/health` → Should return JSON
- [ ] Check Render logs for errors
- [ ] Test API endpoint: `/api/auth/health`

### Test Frontend
- [ ] Visit `https://kramik-hub.vercel.app`
- [ ] Login page loads
- [ ] No console errors (F12)
- [ ] API calls work (check Network tab)

### Test Full Flow
- [ ] Create student account
- [ ] Login successfully
- [ ] Dashboard loads with subjects
- [ ] Quiz system works
- [ ] Schedule system works
- [ ] AI features respond
- [ ] Connect MetaMask wallet
- [ ] Blockchain recording works

### Test Admin
- [ ] Login with admin credentials:
  - Email: `admin@kramik.com`
  - Password: `admin123`
- [ ] View students
- [ ] Create assignments
- [ ] Create schedules
- [ ] AI assistant works

---

## 💰 Cost Breakdown (All FREE!)

| Service | Free Tier | Limits | Cost |
|---------|-----------|--------|------|
| **MongoDB Atlas** | 512MB storage | Shared cluster, 100 connections | $0 |
| **Render** | 750 hours/month | Spins down after 15min idle | $0 |
| **Vercel** | 100GB bandwidth | 100 deployments/day | $0 |
| **Cloudinary** | 25GB storage + 25GB bandwidth | 25,000 transformations/month | $0 |
| **Sepolia ETH** | Test network | Unlimited (free test ETH) | $0 |
| **Gemini API** | 60 requests/minute | 1500 requests/day | $0 |
| **Total** | - | - | **$0/month** |

---

## ⚡ Performance Optimization

### Reduce Backend Cold Start (Render)

Add this to your backend:

Create `backend/keep-alive.js`:

```javascript
import fetch from 'node-fetch';

const BACKEND_URL = 'https://kramik-backend.onrender.com';

// Ping every 10 minutes to prevent spin-down
setInterval(async () => {
  try {
    await fetch(`${BACKEND_URL}/health`);
    console.log('Keep-alive ping sent');
  } catch (error) {
    console.error('Keep-alive failed:', error);
  }
}, 10 * 60 * 1000); // 10 minutes
```

### Optimize MongoDB Queries

Add indexes in MongoDB Atlas:
1. Go to your cluster → Collections
2. Create indexes:
   - `users`: Index on `email`
   - `subjects`: Index on `createdAt`
   - `schedules`: Index on `studentId`

### Enable Caching

Update `vercel.json`:

```json
{
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

---

## 🐛 Common Issues & Solutions

### 1. Backend Returns 500 Error

**Cause**: MongoDB connection failed

**Solution**:
- Check `DATABASE_URL` in Render environment variables
- Verify MongoDB Atlas IP whitelist: `0.0.0.0/0`
- Check MongoDB Atlas user permissions

### 2. Frontend Can't Connect to Backend

**Cause**: CORS or wrong API URL

**Solution**:
- Update `VITE_API_URL` in Vercel to match Render URL
- Update CORS in `backend/server.js` to include Vercel domain
- Redeploy both services

### 3. Slow First Request

**Cause**: Render free tier spins down

**Solution**:
- This is normal on free tier
- First request takes ~30 seconds after 15min idle
- Upgrade to paid tier ($7/month) for always-on
- Or use keep-alive script (see optimization)

### 4. Blockchain Transactions Fail

**Cause**: Insufficient test ETH or wrong network

**Solution**:
- Get more test ETH from faucet
- Verify MetaMask is on Sepolia network
- Check contract addresses in frontend env vars

### 5. File Upload Fails

**Cause**: Cloudinary not configured

**Solution**:
- Verify Cloudinary credentials in Render env vars
- Check Cloudinary dashboard for quota
- Test upload with small files first

---

## 🔒 Security Checklist

- [ ] All `.env` files in `.gitignore`
- [ ] Strong JWT_SECRET (32+ characters)
- [ ] MongoDB user has limited permissions
- [ ] CORS only allows your domains
- [ ] Private keys never committed to GitHub
- [ ] Cloudinary credentials secure
- [ ] Environment variables in hosting platforms, not code

---

## 📊 Monitoring & Logs

### Render Logs
1. Go to Render Dashboard
2. Click your service
3. View **Logs** tab for real-time logs

### Vercel Logs
1. Go to Vercel Dashboard
2. Click your project
3. View **Deployments** → Click deployment → View **Function Logs**

### MongoDB Monitoring
1. Go to MongoDB Atlas
2. Click **Metrics** tab
3. Monitor connections, operations, storage

---

## 🚀 Deployment Summary

### Your Live URLs

```
Frontend:  https://kramik-hub.vercel.app
Backend:   https://kramik-backend.onrender.com
Database:  MongoDB Atlas (internal)
Storage:   Cloudinary (internal)
Blockchain: Sepolia Testnet
```

### Default Admin Login

```
Email:    admin@kramik.com
Password: admin123
```

### Student Test Account

Create via signup form on frontend.

---

## 📝 Maintenance Tips

1. **Monitor Usage**:
   - Check Render, Vercel, MongoDB Atlas dashboards monthly
   - Stay within free tier limits

2. **Update Dependencies**:
   ```bash
   npm outdated
   npm update
   ```

3. **Backup Database**:
   - MongoDB Atlas has automatic backups
   - Export manually: Cluster → Collections → Export

4. **Update Secrets**:
   - Rotate `JWT_SECRET` every 6 months
   - Update in Render environment variables

---

## 🎉 Congratulations!

Your full-stack blockchain-enabled educational platform is now live and completely FREE!

**Share your project**: `https://kramik-hub.vercel.app`

---

## 📞 Support Resources

- **Render Docs**: [render.com/docs](https://render.com/docs)
- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **MongoDB Atlas**: [mongodb.com/docs/atlas](https://www.mongodb.com/docs/atlas/)
- **Cloudinary**: [cloudinary.com/documentation](https://cloudinary.com/documentation)
- **Hardhat**: [hardhat.org/docs](https://hardhat.org/getting-started/)

---

**Need help? Check the logs first, then review this guide! 🚀**
