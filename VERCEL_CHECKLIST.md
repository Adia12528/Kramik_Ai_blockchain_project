# ✅ Vercel Deployment Checklist

Use this checklist before deploying to Vercel.

---

## 📋 Pre-Deployment Checklist

### 1. Database Setup
- [ ] Create MongoDB Atlas account (free tier)
- [ ] Create a new cluster
- [ ] Create database user with password
- [ ] Whitelist IP: `0.0.0.0/0` (allow from anywhere)
- [ ] Get connection string
- [ ] Test connection locally

### 2. Environment Variables Preparation
- [ ] Copy all variables from `.env` files
- [ ] Update `DATABASE_URL` with MongoDB Atlas connection string
- [ ] Generate strong `JWT_SECRET` (min 32 characters)
- [ ] Get Gemini API key from Google AI Studio
- [ ] (Optional) Setup Cloudinary for file uploads
- [ ] (Optional) Get Groq/HuggingFace API key for AI chat

### 3. Code Preparation
- [ ] ✅ `vercel.json` created
- [ ] ✅ `.vercelignore` created
- [ ] ✅ MongoDB config updated for serverless
- [ ] ✅ Build scripts updated in `package.json`
- [ ] Test build locally: `npm run build`
- [ ] Commit and push all changes to GitHub

### 4. GitHub Repository
- [ ] All files committed
- [ ] All changes pushed to `main` branch
- [ ] Repository is public or Vercel has access

---

## 🚀 Deployment Steps

### Step 1: Import Project to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New Project"**
3. Import your GitHub repository: `Kramik_Ai_blockchain_project`
4. Select the repository

### Step 2: Configure Project

**Framework Preset**: `Other`

**Root Directory**: `./` (leave as is)

**Build & Development Settings**:
- Build Command: `npm run vercel-build`
- Output Directory: `frontend/dist`
- Install Command: `npm install`

### Step 3: Add Environment Variables

Click **"Environment Variables"** and add these:

#### Required Variables
```
DATABASE_URL=mongodb+srv://user:pass@cluster.mongodb.net/kramik
JWT_SECRET=your-super-secret-key-min-32-chars
GEMINI_API_KEY=your-gemini-key
NODE_ENV=production
```

#### Frontend Variables (Add with VITE_ prefix)
```
VITE_API_URL=https://your-app.vercel.app
VITE_BLOCKCHAIN_NETWORK=sepolia
```

#### Optional (if using Cloudinary)
```
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-secret
```

### Step 4: Deploy

1. Click **"Deploy"**
2. Wait 2-3 minutes for build
3. ✅ Check for successful deployment

---

## 🧪 Post-Deployment Testing

### Test Backend API
```bash
curl https://your-app.vercel.app/health
```

Expected response:
```json
{
  "status": "OK",
  "timestamp": "2025-11-24T...",
  "service": "Kramik Backend API",
  "version": "1.0.0"
}
```

### Test Frontend
Visit: `https://your-app.vercel.app`

Should see the login page.

### Test API Routes
```bash
curl https://your-app.vercel.app/api/auth/health
```

---

## 🐛 Troubleshooting

### Build Failed

**Check Vercel logs**:
1. Go to Deployment → Click failed build
2. Read error messages
3. Common issues:
   - Missing dependencies: `npm install` in all folders
   - Build errors: Test locally first
   - Environment variables: Check spelling

### API Returns 500 Error

**Possible causes**:
- MongoDB connection failed
  - ✅ Check `DATABASE_URL` in environment variables
  - ✅ Verify IP whitelist in MongoDB Atlas
- Missing environment variables
  - ✅ Add all required variables in Vercel dashboard

### CORS Errors

Update `backend/server.js`:
```javascript
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-app.vercel.app']
    : ['http://localhost:3000'],
  credentials: true
}))
```

### Frontend Can't Connect to Backend

1. Check `VITE_API_URL` environment variable
2. Should be: `https://your-app.vercel.app`
3. Rebuild frontend after changing env vars

---

## 📊 Performance Monitoring

### Check Logs
1. Go to Vercel Dashboard
2. Click your project
3. Go to "Logs" tab
4. Monitor real-time requests

### Check Function Duration
1. Go to "Analytics" tab
2. Check function execution time
3. If timeout errors (>10s on free tier):
   - Optimize database queries
   - Add indexes to MongoDB
   - Consider upgrading Vercel plan

---

## 🔒 Security Post-Deployment

- [ ] Update CORS to only allow your domain
- [ ] Verify all sensitive data is in environment variables (not code)
- [ ] Enable MongoDB IP whitelist (if possible)
- [ ] Review API rate limiting
- [ ] Test authentication flows
- [ ] Check JWT token expiration

---

## 🎯 Optional Improvements

### Custom Domain
1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records
4. Wait for SSL certificate

### Automatic Deployments
- ✅ Already enabled for `main` branch
- Every push triggers new deployment
- Preview deployments for pull requests

### Environment-Specific Settings
- Production: Use separate MongoDB cluster
- Staging: Use test database
- Development: Use local MongoDB

---

## 📝 Final Checklist

- [ ] Deployment successful
- [ ] Health check returns 200
- [ ] Frontend loads correctly
- [ ] Login/signup works
- [ ] Database operations work
- [ ] AI features respond
- [ ] No console errors
- [ ] Mobile responsive
- [ ] HTTPS enabled (automatic)

---

## 🆘 Need Help?

1. **Check Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
2. **MongoDB Atlas Docs**: [mongodb.com/docs/atlas](https://mongodb.com/docs/atlas)
3. **Review Logs**: Vercel Dashboard → Logs
4. **Test Locally First**: `npm run build` and `npm run preview`

---

**Ready? Start with Step 1! 🚀**
