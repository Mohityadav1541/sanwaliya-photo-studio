# 🚀 Deployment Architecture & Setup Guide (Neon, Render & Vercel)

This production deployment guide covers the complete serverless architecture:
1. **Neon Serverless PostgreSQL** (Database layer)
2. **Render Web Service** (Express + Prisma backend API)
3. **Vercel Edge & Static** (Vite + React 19 + Three.js frontend)

---

## Part 1: Neon Serverless PostgreSQL Database Setup

1. Go to [neon.tech](https://neon.tech) and sign up / log in with your GitHub account.
2. Click **Create Project**:
   - **Project Name**: `sanwaliya-db`
   - **Postgres Version**: 16 (default)
   - **Region**: Choose closest to India/Europe (e.g. `ap-southeast-1` Singapore, or `eu-central-1` Frankfurt).
3. On your Neon Dashboard:
   - Under **Connection Details**, ensure **Pooled connection** checkbox is checked (uses port `5432` with `-pooler` hostname, optimized for serverless).
   - Copy the connection string:
     ```
     postgresql://neondb_owner:password@ep-cool-fog-123456-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
     ```
4. Push the schema to your Neon database from your local terminal:
   ```bash
   cd backend
   # In backend/.env, set DATABASE_URL to your Neon connection string:
   # DATABASE_URL="postgresql://neondb_owner:password@ep-cool-fog-123456-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
   npx prisma db push
   node src/createRoshanAdmin.js
   ```
   *This automatically generates the PostgreSQL tables and creates the Admin credentials.*

---

## Part 2: Backend API Deployment on Render

### Option A: Using the Render Blueprint (`render.yaml`) - 1 Click
1. Go to [dashboard.render.com](https://dashboard.render.com).
2. Click **New +** → **Blueprint**.
3. Select your GitHub repository: `Mohityadav1541/sanwaliya-photo-studio`.
4. Render will read `render.yaml` automatically and configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npx prisma generate`
   - **Start Command**: `node src/index.js`
5. Under Environment Variables:
   - Add `DATABASE_URL`: *(Paste your Neon pooled PostgreSQL connection string)*
   - Add `FRONTEND_URL`: `https://sanwaliya-photo-studio.vercel.app` (or your Vercel URL)
6. Click **Apply**.
7. Copy your Render service URL (e.g., `https://sanwaliya-photo-studio-api.onrender.com`).

### Option B: Manual Web Service on Render
- **Name**: `sanwaliya-photo-studio-api`
- **Root Directory**: `backend`
- **Environment**: `Node`
- **Build Command**: `npm install && npx prisma generate`
- **Start Command**: `node src/index.js`
- **Environment Variables**:
  - `DATABASE_URL`: `postgresql://...` (from Neon)
  - `JWT_SECRET`: `your_random_secret_string`
  - `PORT`: `5000`
  - `NODE_ENV`: `production`

---

## Part 3: Frontend Deployment on Vercel

1. Go to [vercel.com](https://vercel.com) and log in.
2. Click **Add New...** → **Project**.
3. Select your GitHub repository: `Mohityadav1541/sanwaliya-photo-studio`.
4. Configure Project Settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click `Edit` and select `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. **Environment Variables**:
   - `VITE_API_URL`: `https://sanwaliya-photo-studio-api.onrender.com/api` (your Render URL)
6. Click **Deploy**!
   - Vercel will install dependencies and compile the production bundle.
   - Any future push to `main` will automatically build and deploy new changes.

---

## Verification & Health Check

1. **Test Database & Backend API**:
   - Visit: `https://your-backend.onrender.com/`
   - Expected Response:
     ```json
     {
       "name": "Sanwaliya Photo Studio API",
       "theme": "Daylight Atelier 3D Suite",
       "status": "online"
     }
     ```

2. **Test Admin Login**:
   - Visit: `https://your-site.vercel.app/admin/login`
   - Credentials:
     - Email: `roshanlalyadav30408@gmail.com`
     - Password: `rambhajan1540`
