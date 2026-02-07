# Ticketing System — Vercel Deployment Guide

## Overview
This project is configured for **full-Vercel deployment** (frontend + serverless API on one domain using Vercel serverless functions).

---

## Quick Deployment Steps (5 minutes)

### Step 1: Prepare Your Project Locally ✅ (Already Done)
- ✓ Serverless API functions created in `api/` folder
- ✓ Frontend configured to use `/api` (relative URLs)
- ✓ MongoDB fallback configured
- ✓ CORS simplified for production

### Step 2: Create GitHub Repository

1. **Create a new empty repo on GitHub:**
   - Go to https://github.com/new
   - Name: `ticketing-system` (or your choice)
   - ⚠️ **Do NOT initialize with README** (we'll push existing code)
   - Click "Create repository"

2. **Initialize git locally and push:**

```bash
cd "e:\projects\New folder\Ticketing_system"
git init
git add .
git commit -m "Initial commit - Ticketing System with Vercel serverless API"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/ticketing-system.git
git push -u origin main
```

⚠️ Replace `YOUR_USERNAME` with your GitHub username and use your actual repo URL.

### Step 3: Deploy to Vercel

1. **Go to Vercel:**
   - Visit https://vercel.com
   - Sign in with GitHub (click "Continue with GitHub")

2. **Import your project:**
   - Click "Add New" → "Project"
   - Find and select your `ticketing-system` repository
   - Click "Import"

3. **Configure project settings:**
   - **Root Directory:** Leave as `/` (default)
   - **Framework Preset:** `Other` (custom setup)
   - **Build Command:** `npm --prefix client run build`
   - **Output Directory:** `client/dist`
   - **Install Command:** `npm install` (default)

4. **Add Environment Variables:**
   
   In the Vercel dashboard after importing, go to **Settings → Environment Variables** and add:

   | Variable | Value | Notes |
   |----------|-------|-------|
   | `MONGO_URI` | Your MongoDB Atlas connection string | Get from MongoDB Atlas dashboard |
   | `JWT_SECRET` | A long random string (e.g., `your-secret-key-here-min-32-chars`) | Change this in production! |
   | `JWT_EXPIRE` | `7d` | Optional |
   | `NODE_ENV` | `production` | Should be set automatically |

   **Example MongoDB connection string:**
   ```
   mongodb+srv://username:password@cluster.mongodb.net/ticketing_db?retryWrites=true&w=majority
   ```

5. **Deploy:**
   - Click "Deploy"
   - Wait 2-3 minutes for build to complete
   - Your app will be live at `https://your-project-name.vercel.app`

---

## Getting Your MongoDB Atlas Connection String

1. **Log in to MongoDB Atlas:** https://account.mongodb.com/account/login
2. **Go to Deployments → Click your cluster**
3. **Click "Connect" button**
4. **Select "Drivers" tab**
5. **Choose Node.js** version 4.1 or later
6. **Copy the provided connection string:**
   ```
   mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority
   ```
7. **Replace:**
   - `<username>` and `<password>` with your DB user credentials
   - `<dbname>` with `ticketing_db` (or your DB name)

⚠️ **Important:** Make sure your IP is whitelisted in MongoDB Atlas Security → Network Access. Use `0.0.0.0/0` for testing (unrestricted access).

---

## After Deployment — Verify It Works

1. **Open your Vercel app URL** (you'll see it after deployment, e.g., `https://ticketing-system-abc123.vercel.app`)

2. **Test login:**
   - Email: `denisraj@gmail.com`
   - Password: `Lax1204`
   - You should see the Admin Dashboard

3. **If login fails:**
   - Check browser DevTools → Console for errors
   - Check Vercel Functions → Logs in the Vercel dashboard
   - Verify `MONGO_URI` and `JWT_SECRET` are set in environment variables

---

## Common Issues & Fixes

### "Cannot connect to MongoDB" Error
- **Cause:** IP not whitelisted in MongoDB Atlas or wrong connection string
- **Fix:** 
  1. Go to MongoDB Atlas → Security → Network Access
  2. Add Vercel IPs: Use `0.0.0.0/0` (all IPs) for testing, or add specific Vercel IP ranges
  3. Or set to "Allow access from anywhere"

### "CORS Error" or "Failed to fetch"
- **Cause:** Environment variables not set
- **Fix:** Double-check `MONGO_URI` and `JWT_SECRET` are set in Vercel Project Settings

### "Build failed" on Vercel
- **Cause:** Dependencies missing or build command incorrect
- **Fix:** 
  1. Check build logs in Vercel dashboard
  2. Ensure `root package.json` has Express, Mongoose, JWT dependencies
  3. Verify `client/dist` is the correct output directory

---

## Project Structure (for Vercel)

```
ticketing-system/
├── api/                          # Serverless functions (auto-deployed)
│   ├── auth/
│   │   ├── login.js
│   │   └── me.js
│   └── _db.js                    # MongoDB connection helper
├── client/                       # Frontend (React + Vite)
│   ├── src/
│   ├── package.json
│   └── vite.config.js
├── server/                       # Backend models/middleware (imported by functions)
│   ├── models/
│   ├── controllers/
│   └── middleware/
├── package.json                  # Root dependencies (for serverless functions)
├── vercel.json                   # Vercel configuration
├── .env.example                  # Example env vars
└── .gitignore
```

---

## Local Testing vs Production

### Local (Development)
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:9000`
- MongoDB: Local fallback + Atlas attempt
- CORS: Permissive (allow all origins)

### Production (Vercel)
- Frontend: `https://your-app.vercel.app`
- Backend: Serverless functions at `/api` (same domain)
- MongoDB: Atlas required
- CORS: Restricted to `CLIENT_URL`

---

## Advanced: Adding More API Endpoints

To add more serverless functions (e.g., for tickets, messages):

1. **Create a new function file:**
   ```
   api/tickets/list.js
   ```

2. **Export a handler:**
   ```javascript
   import connectToDatabase from '../_db.js';
   import Ticket from '../../server/models/Ticket.js';

   export default async function handler(req, res) {
     if (req.method !== 'GET') {
       res.setHeader('Allow', ['GET']);
       return res.status(405).json({ message: 'Method not allowed' });
     }

     try {
       await connectToDatabase();
       const tickets = await Ticket.find().limit(50);
       return res.status(200).json({ success: true, tickets });
     } catch (error) {
       return res.status(500).json({ message: 'Error fetching tickets', error: error.message });
     }
   }
   ```

3. **Frontend calls it:**
   ```javascript
   const response = await apiClient.get('/tickets/list');
   ```

4. **Redeploy:**
   ```bash
   git push origin main
   ```
   Vercel will auto-deploy the new functions.

---

## Support & Next Steps

- **Vercel Docs:** https://vercel.com/docs
- **Serverless Functions:** https://vercel.com/docs/concepts/functions/serverless-functions
- **Environment Variables:** https://vercel.com/docs/concepts/projects/environment-variables

---

**Questions?** Check the browser console (F12) and Vercel Function Logs for detailed error messages.
