# Quick Deployment Guide

## 🎯 Choose Your Deployment Strategy

Not sure which option? See **[DEPLOYMENT_COMPARISON.md](DEPLOYMENT_COMPARISON.md)** for detailed comparison.

**Recommended**: Split deployment (Frontend: Vercel, Backend: Render) - 100% FREE ⭐

---

## 🚀 Deploy in 3 Steps

### 1. Database (5 minutes)
- Sign up at [MongoDB Atlas](https://mongodb.com/cloud/atlas/register)
- Create FREE cluster
- Get connection string

### 2. Backend (10 minutes)
- Sign up at [Render.com](https://render.com)
- Connect GitHub repository
- Add environment variables
- Deploy!

### 3. Frontend (5 minutes)
- Sign up at [Vercel.com](https://vercel.com)
- Import GitHub repository
- Add `VITE_API_URL` environment variable
- Deploy!

---

## 📚 Full Guides

- **Complete Free Deployment**: See `FREE_DEPLOYMENT_GUIDE.md`
- **Vercel Only**: See `docs/guides/VERCEL_DEPLOYMENT.md`
- **Quick Checklist**: See `VERCEL_CHECKLIST.md`

---

## 🆓 100% Free Hosting

| Service | What | Free Tier |
|---------|------|-----------|
| **Render** | Backend API | 750 hours/month |
| **Vercel** | Frontend | 100GB bandwidth |
| **MongoDB Atlas** | Database | 512MB storage |
| **Cloudinary** | File Storage | 25GB |
| **Sepolia** | Blockchain | Unlimited test ETH |

---

## 🔗 Quick Links

- [MongoDB Atlas Setup](https://www.mongodb.com/cloud/atlas/register)
- [Render Dashboard](https://dashboard.render.com)
- [Vercel Dashboard](https://vercel.com/dashboard)
- [Cloudinary Setup](https://cloudinary.com/users/register_free)
- [Gemini API Key](https://ai.google.dev/gemini-api/docs/api-key)
- [Sepolia Faucet](https://sepoliafaucet.com)

---

## ⚡ Environment Variables Needed

### Backend (Render)
```env
DATABASE_URL=mongodb+srv://...
JWT_SECRET=your-secret-key
GEMINI_API_KEY=your-key
CLOUDINARY_CLOUD_NAME=your-name
CLOUDINARY_API_KEY=your-key
CLOUDINARY_API_SECRET=your-secret
```

### Frontend (Vercel)
```env
VITE_API_URL=https://your-backend.onrender.com
VITE_CONTRACT_ADDRESS=0x...
VITE_ACADEMIC_CONTRACT_ADDRESS=0x...
```

---

**Start with `FREE_DEPLOYMENT_GUIDE.md` for step-by-step instructions! 🎯**
