# 🚀 Vercel Deployment Guide

## ⚠️ Important Notes

Your project has a **monorepo structure** with frontend and backend. Vercel deployment requires some adjustments.

---

## 📋 Prerequisites

1. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository** - Your code must be on GitHub
3. **Environment Variables** - Prepare all `.env` values

---

## 🔧 Required Changes Before Deployment

### 1. Backend Serverless Adaptation

**Issue**: Express server needs to run as serverless functions on Vercel.

**Solution**: Your backend is already configured with `vercel.json`, but you need to:

- **Use MongoDB Atlas** (not local MongoDB)
- **Use Cloudinary/AWS S3** for file uploads (already configured)
- **Enable connection pooling** for MongoDB

### 2. Environment Variables

Set these in Vercel Dashboard → Settings → Environment Variables:

#### Backend Variables
```
DATABASE_URL=mongodb+srv://user:pass@cluster.mongodb.net/kramik
JWT_SECRET=your-super-secret-key-min-32-chars
JWT_EXPIRES_IN=7d
GEMINI_API_KEY=your-gemini-api-key
NODE_ENV=production
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

#### Frontend Variables
```
VITE_API_URL=https://your-app.vercel.app
VITE_CONTRACT_ADDRESS=0x...
VITE_ACADEMIC_CONTRACT_ADDRESS=0x...
VITE_BLOCKCHAIN_NETWORK=sepolia
```

### 3. MongoDB Connection Pooling

Update `backend/src/config/mongodb.js`:

```javascript
const options = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
}
```

---

## 📦 Deployment Steps

### Option 1: Deploy via Vercel Dashboard

1. **Go to Vercel Dashboard**
   - Click "Add New Project"
   - Import your GitHub repository

2. **Configure Build Settings**
   - **Framework Preset**: Other
   - **Root Directory**: `./`
   - **Build Command**: `npm run build:frontend`
   - **Output Directory**: `frontend/dist`
   - **Install Command**: `npm install`

3. **Add Environment Variables**
   - Copy all variables from `.env` files
   - Add them in Settings → Environment Variables

4. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes for build

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

---

## 🔍 Deployment Configuration

The `vercel.json` file is already configured:

- ✅ Routes API calls to backend serverless functions
- ✅ Serves frontend static files from `frontend/dist`
- ✅ Health check endpoint
- ✅ Production environment

---

## ⚠️ Known Limitations

### 1. **Serverless Function Timeout**
- Free tier: 10 seconds max
- Pro tier: 60 seconds max
- **Fix**: Optimize slow database queries

### 2. **File Uploads**
- Local storage doesn't work on Vercel
- **Fix**: Use Cloudinary (already configured in your backend)

### 3. **MongoDB Connections**
- Don't create new connection on every request
- **Fix**: Use connection pooling (see above)

### 4. **Blockchain Interactions**
- Long-running blockchain calls may timeout
- **Fix**: Use webhook/background jobs for long processes

---

## 🧪 Testing After Deployment

1. **Health Check**
   ```
   https://your-app.vercel.app/health
   ```

2. **API Test**
   ```
   https://your-app.vercel.app/api/auth/health
   ```

3. **Frontend**
   ```
   https://your-app.vercel.app
   ```

---

## 🐛 Common Issues & Fixes

### Build Fails

**Error**: `Module not found`
```bash
# Fix: Install all dependencies
cd frontend && npm install
cd ../backend && npm install
```

### API Routes Not Working

**Error**: `404 on /api/*`
- Check `vercel.json` routes configuration
- Ensure backend functions are in correct directory

### Database Connection Issues

**Error**: `MongooseServerSelectionError`
- Whitelist Vercel IP: `0.0.0.0/0` in MongoDB Atlas
- Check DATABASE_URL environment variable
- Verify network access in MongoDB Atlas

### CORS Errors

Add your Vercel domain to CORS config in `backend/server.js`:
```javascript
app.use(cors({
  origin: ['https://your-app.vercel.app', 'http://localhost:3000']
}))
```

---

## 📊 Performance Optimization

1. **Enable Edge Caching**
   ```json
   {
     "headers": [
       {
         "source": "/api/(.*)",
         "headers": [
           {
             "key": "Cache-Control",
             "value": "s-maxage=60, stale-while-revalidate"
           }
         ]
       }
     ]
   }
   ```

2. **Optimize Frontend Build**
   - Enable code splitting
   - Compress images
   - Use lazy loading

3. **Database Indexing**
   - Index frequently queried fields
   - Use MongoDB aggregation pipelines

---

## 🔒 Security Checklist

- ✅ Environment variables set in Vercel (not in code)
- ✅ JWT secret is strong (min 32 characters)
- ✅ CORS configured for your domain only
- ✅ MongoDB Atlas IP whitelist configured
- ✅ API rate limiting enabled
- ✅ HTTPS enforced (automatic on Vercel)

---

## 🎯 Alternative: Split Deployments

For better performance, deploy separately:

### Frontend → Vercel
- Deploy only `frontend/` directory
- Set `VITE_API_URL` to backend URL

### Backend → Railway/Render
- Deploy `backend/` as traditional Node.js app
- Better for long-running processes
- No serverless limitations

---

## 📝 Post-Deployment

1. **Custom Domain** (Optional)
   - Add domain in Vercel Settings
   - Update DNS records

2. **Monitor Logs**
   - Check Vercel Dashboard → Logs
   - Monitor for errors

3. **Update Blockchain Config**
   - Update contract ABIs if redeployed
   - Test wallet connections

---

## 🆘 Support

If deployment fails:
1. Check Vercel build logs
2. Test locally first: `npm run build`
3. Verify all environment variables
4. Check MongoDB Atlas network access

---

**Ready to deploy? Follow the steps above! 🚀**
