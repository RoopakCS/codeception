# 🎯 Quick Deployment Commands

## 1. Generate JWT Secret
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
**Copy the output** - you'll need it for Render environment variables.

---

## 2. Test Locally Before Deploy
```bash
# Make sure your local .env is set up
npm install
npm start

# Visit http://localhost:3000
# Test registration and login
```

---

## 3. Push to GitHub
```bash
git add .
git commit -m "Production ready"
git push origin main
```

---

## 4. Environment Variables for Render

When creating your web service on Render, add these:

| Variable | Value | Example |
|----------|-------|---------|
| `NODE_ENV` | `production` | `production` |
| `PORT` | `10000` | `10000` |
| `MONGODB_URI` | Your Atlas connection string | `mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/codeception` |
| `JWT_SECRET` | From step 1 above | `a1b2c3d4e5f6...` (64 chars) |
| `FRONTEND_URL` | Your Render URL | `https://codeception-2025.onrender.com` |
| `PRODUCTION_URL` | Same as FRONTEND_URL | `https://codeception-2025.onrender.com` |

---

## 5. MongoDB Atlas Quick Setup

1. Go to https://cloud.mongodb.com
2. Create free M0 cluster
3. Create database user
4. Network Access → Allow 0.0.0.0/0
5. Get connection string
6. Replace `<password>` with actual password

**Connection String Format**:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/codeception?retryWrites=true&w=majority
```

---

## 6. Render Deploy Steps

1. https://render.com → Sign up with GitHub
2. New + → Web Service
3. Connect your `codeception` repo
4. Name: `codeception-2025`
5. Build: `npm install`
6. Start: `npm start`
7. Add environment variables from step 4
8. Click "Create Web Service"
9. Wait 5-10 minutes ⏳
10. Done! 🎉

---

## 7. Test Deployment

```bash
# Test health check
curl https://your-app.onrender.com/api/health

# Should return:
# {"status":"ok","message":"Codeception 2025 API is running",...}
```

Or visit in browser:
- Home: `https://your-app.onrender.com`
- Health: `https://your-app.onrender.com/api/health`
- Leaderboard: `https://your-app.onrender.com/leaderboard`

---

## 8. Common Issues & Fixes

### Issue: "Application Error"
**Fix**: Check Render logs for specific error

### Issue: Database connection failed
**Fix**: Verify MongoDB connection string, check Atlas IP whitelist

### Issue: JWT Secret error
**Fix**: Ensure JWT_SECRET is set in Render environment variables

### Issue: CORS error
**Fix**: Update FRONTEND_URL and PRODUCTION_URL to match actual Render URL

---

## Files Created

✅ `render.yaml` - Render configuration (auto-detected)
✅ `RENDER_DEPLOYMENT.md` - Detailed deployment guide
✅ `.env.example` - Environment variables template

---

## Your URLs After Deployment

Replace `codeception-2025` with your actual app name:

- **Main Site**: `https://codeception-2025.onrender.com`
- **API Health**: `https://codeception-2025.onrender.com/api/health`
- **Register**: `https://codeception-2025.onrender.com/register`
- **Login**: `https://codeception-2025.onrender.com/login`
- **Leaderboard**: `https://codeception-2025.onrender.com/leaderboard`

---

**Total deployment time**: ~15 minutes (including MongoDB setup)

**Cost**: $0 (Free tier)

Good luck! 🚀
