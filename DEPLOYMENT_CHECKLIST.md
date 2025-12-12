# 🚀 Deployment Readiness Checklist

## ✅ Backend (Render) - READY

**Files Present:**
- ✅ `server.js` - Main server file
- ✅ `package.json` - Dependencies configured
- ✅ `prisma/schema.prisma` - Database schema
- ✅ `.env` - Environment variables (local)

**Render Configuration:**
```
Build Command: npm install && npx prisma generate
Start Command: node server.js
```

**Environment Variables for Render:**
```
DATABASE_URL=mongodb+srv://mrmohit1540_db_user:rbScMScQWDY2oLQc@cluster0.ezh4zrn.mongodb.net/myProjectDB?appName=Cluster0
JWT_SECRET=sanwaliya-photo-studio-secret-2024
PORT=3000
```

---

## ✅ Frontend (Vercel) - NEEDS ENV UPDATE

**Files Present:**
- ✅ `frontend/package.json`
- ✅ `frontend/src/App.jsx`
- ✅ Login & Dashboard components

**⚠️ ACTION REQUIRED:**
Create `frontend/.env.production` with:
```env
VITE_API_URL=https://your-backend.onrender.com
```

---

## 📋 Deployment Steps

### Step 1: Deploy Backend to Render

1. Push code to GitHub:
   ```bash
   cd C:\Desktop\coding\sanwaliya-memories-main
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. Go to [render.com](https://render.com) → New Web Service
3. Connect GitHub repo
4. Configure:
   - **Build**: `npm install && npx prisma generate`
   - **Start**: `node server.js`
   - **Add Environment Variables** (see above)
5. Deploy!
6. **Copy the Render URL** (e.g., `https://sanwaliya-xyz.onrender.com`)

### Step 2: Update Frontend for Production

1. Create `frontend/.env.production`:
   ```bash
   cd C:\Desktop\coding\sanwaliya-memories-main\frontend
   echo VITE_API_URL=https://your-render-url.onrender.com > .env.production
   ```
   Replace `your-render-url` with actual Render URL

2. Push to GitHub:
   ```bash
   git add .
   git commit -m "Add production API URL"
   git push origin main
   ```

### Step 3: Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repo
3. **Root Directory**: `frontend`
4. **Framework Preset**: Vite (or auto-detect)
5. **Build Command**: `npm run build`
6. **Output Directory**: `dist`
7. Deploy!

---

## ✅ Post-Deployment Verification

1. **Test Backend**: Visit `https://your-backend.onrender.com/api/health`
   - Should return: `{"status":"ok","message":"Sanwaliya Photo Studio API"}`

2. **Test Frontend**: Visit `https://your-site.vercel.app/login`
   - Should show login page
   - Login with: `roshanlalyadav30408@gmail.com` / `07081978`

3. **Test Full Flow**:
   - Login → Should redirect to admin dashboard
   - Dashboard should load orders and users

---

## 🔧 Troubleshooting

**Backend won't start on Render:**
- Check Render logs for errors
- Verify `DATABASE_URL` is set correctly
- Ensure MongoDB Atlas allows Render IPs (set to `0.0.0.0/0`)

**Frontend can't connect to backend:**
- Verify `.env.production` has correct Render URL
- Check browser console for CORS errors
- Ensure backend has `cors()` middleware

**Login doesn't work:**
- Run `node scripts/create-admin.js` on Render (or locally connected to prod DB)
- Verify `JWT_SECRET` matches between backend deployments

---

## 🎯 Summary

**READY TO DEPLOY:**
- ✅ Backend code complete
- ✅ Frontend code complete
- ✅ MongoDB configured
- ✅ Authentication working locally

**BEFORE DEPLOYING:**
- ⚠️ Create `frontend/.env.production` with Render backend URL
- ⚠️ Push all code to GitHub
- ⚠️ Set environment variables in Render dashboard

**YOU'RE 95% READY!** Just need to add the production env file and deploy! 🚀
