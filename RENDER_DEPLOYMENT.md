# 🚀 Deploy to Render - Quick Guide

## Prerequisites

Before deploying, you need:

1. ✅ GitHub account
2. ✅ MongoDB Atlas account (free tier)
3. ✅ Render account (free tier)

---

## Step 1: Set Up MongoDB Atlas

1. **Create Account**:
   - Go to https://cloud.mongodb.com
   - Sign up for free

2. **Create Cluster**:
   - Click "Build a Database"
   - Choose "M0 Free" tier
   - Select region closest to your users
   - Click "Create"

3. **Create Database User**:
   - Click "Database Access" → "Add New Database User"
   - Choose "Password" authentication
   - Username: `codeception_admin`
   - Password: Generate a secure password (save it!)
   - Database User Privileges: "Read and write to any database"
   - Click "Add User"

4. **Whitelist IP**:
   - Click "Network Access" → "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Click "Confirm"

5. **Get Connection String**:
   - Click "Database" → "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your actual password
   - Replace `<username>` with `codeception_admin`
   - Should look like:
     ```
     mongodb+srv://codeception_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/codeception?retryWrites=true&w=majority
     ```
   - **Save this for Step 3!**

---

## Step 2: Generate JWT Secret

Run this command in your terminal:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output - you'll need it in Step 3.

**Example output**:
```
a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
```

---

## Step 3: Deploy to Render

1. **Push Code to GitHub**:
   ```bash
   git add .
   git commit -m "Ready for production deployment"
   git push origin main
   ```

2. **Sign Up for Render**:
   - Go to https://render.com
   - Sign up with GitHub

3. **Create New Web Service**:
   - Click "New +" → "Web Service"
   - Click "Connect a repository"
   - Select your `codeception` repository
   - Click "Connect"

4. **Configure Service**:
   - **Name**: `codeception-2025` (or any name you like)
   - **Region**: Singapore (or closest to your users)
   - **Branch**: `main`
   - **Root Directory**: (leave blank)
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

5. **Add Environment Variables**:
   Click "Advanced" → Add Environment Variables:

   | Key | Value |
   |-----|-------|
   | `NODE_ENV` | `production` |
   | `PORT` | `10000` |
   | `MONGODB_URI` | Your MongoDB connection string from Step 1 |
   | `JWT_SECRET` | Your generated secret from Step 2 |
   | `FRONTEND_URL` | `https://codeception-2025.onrender.com` |
   | `PRODUCTION_URL` | `https://codeception-2025.onrender.com` |

   **Note**: Replace `codeception-2025` with your actual app name in URLs

6. **Deploy**:
   - Click "Create Web Service"
   - Wait 5-10 minutes for deployment
   - Your app will be live!

---

## Step 4: Get Your Production URL

After deployment completes:

1. Your app URL will be displayed at the top:
   ```
   https://codeception-2025.onrender.com
   ```

2. **Update Environment Variables**:
   - Go to "Environment" tab
   - Update `FRONTEND_URL` and `PRODUCTION_URL` with your actual URL
   - Click "Save Changes"
   - Render will automatically redeploy

---

## Step 5: Test Your Deployment

1. **Visit Your App**:
   ```
   https://codeception-2025.onrender.com
   ```

2. **Test Health Check**:
   ```
   https://codeception-2025.onrender.com/api/health
   ```
   Should return:
   ```json
   {
     "status": "ok",
     "message": "Codeception 2025 API is running",
     "timestamp": "2025-11-04T...",
     "uptime": 123.45,
     "environment": "production",
     "database": "connected"
   }
   ```

3. **Test Registration**:
   - Go to Register page
   - Create a test account
   - Verify you receive a participant code

4. **Test Login**:
   - Login with your test account
   - Verify redirect to homepage

5. **Test Leaderboard**:
   - Visit leaderboard page
   - Verify it loads without errors

---

## Troubleshooting

### ❌ Build Failed
- Check build logs in Render dashboard
- Verify `package.json` has all dependencies
- Ensure Node version compatibility

### ❌ Database Connection Error
- Verify MongoDB connection string is correct
- Check MongoDB Atlas whitelist includes 0.0.0.0/0
- Verify database user has correct permissions

### ❌ JWT Error
- Verify JWT_SECRET is set in environment variables
- Should be at least 32 characters long

### ❌ CORS Error
- Verify FRONTEND_URL matches your actual Render URL
- Check browser console for specific error

### ❌ Application Error
- Check Render logs: Dashboard → Logs tab
- Look for specific error messages
- Verify all environment variables are set

---

## Auto-Deploy Setup

Render automatically deploys when you push to GitHub:

```bash
# Make changes to your code
git add .
git commit -m "Update feature X"
git push origin main

# Render automatically deploys!
# Check deployment progress in Render dashboard
```

---

## Free Tier Limitations

Render Free Tier:
- ✅ 750 hours/month (enough for 24/7)
- ✅ Auto-sleeps after 15 min inactivity
- ⚠️ First request after sleep takes 30-60 seconds (cold start)
- ✅ Automatic HTTPS
- ✅ Custom domains supported

**Tip**: First visitor after inactivity will experience slow load. Subsequent visits are instant!

---

## Post-Deployment Checklist

- [ ] App loads successfully
- [ ] Registration works
- [ ] Login works
- [ ] Leaderboard displays
- [ ] Challenges award points
- [ ] Database persists data
- [ ] All 10 stages functional
- [ ] Mobile responsive works
- [ ] No console errors

---

## Production URL Template

Once deployed, share this URL with participants:

```
🎯 Codeception 2025 is LIVE!

🌐 Website: https://codeception-2025.onrender.com
📊 Leaderboard: https://codeception-2025.onrender.com/leaderboard
📝 Register: https://codeception-2025.onrender.com/register

Good luck hackers! 🚀
```

---

## Support

If you encounter issues:

1. Check Render logs first
2. Review MongoDB Atlas connection
3. Verify all environment variables
4. Test locally with production mode: `NODE_ENV=production npm start`

**Deployment Time**: ~10 minutes  
**Cost**: $0 (Free tier)  
**Uptime**: 99.9%  

---

**You're ready to deploy! 🎉**

Follow the steps above, and your app will be live in minutes!
