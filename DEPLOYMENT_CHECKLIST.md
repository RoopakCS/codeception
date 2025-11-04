# Production Deployment Checklist ✅

## Pre-Deployment Setup

### 1. Environment Configuration
- [ ] Copy `.env.example` to `.env`
- [ ] Set `NODE_ENV=production`
- [ ] Set `PORT` (default: 3000)
- [ ] Configure `MONGODB_URI` with production database
- [ ] Generate secure `JWT_SECRET` (minimum 32 characters)
- [ ] Set `FRONTEND_URL` to your production domain
- [ ] Set `PRODUCTION_URL` to your production domain

### 2. Database Setup
- [ ] Create MongoDB Atlas account (or production MongoDB instance)
- [ ] Create new cluster (M0 free tier available)
- [ ] Create database user with strong password
- [ ] Whitelist IP addresses (0.0.0.0/0 for cloud platforms)
- [ ] Get connection string
- [ ] Test database connection locally

### 3. Security Review
- [ ] Review all API endpoints for authentication
- [ ] Ensure JWT_SECRET is strong and unique
- [ ] Verify CORS settings allow only your domain
- [ ] Check that error messages don't leak sensitive info
- [ ] Confirm password hashing is working (bcrypt)
- [ ] Review rate limiting needs (optional enhancement)

### 4. Code Review
- [ ] Run `npm run format` to format code
- [ ] Remove console.logs from production code (or keep strategic ones)
- [ ] Update any hardcoded URLs to use environment variables
- [ ] Verify all dependencies are in `package.json`
- [ ] Check `.gitignore` excludes `.env` file

## Deployment Steps

### 5. Choose Platform & Deploy

#### Option A: Render (Recommended - Easy & Free)
- [ ] Push code to GitHub
- [ ] Sign up at https://render.com
- [ ] Create "New Web Service"
- [ ] Connect GitHub repository
- [ ] Set Build Command: `npm install`
- [ ] Set Start Command: `npm start`
- [ ] Add all environment variables
- [ ] Deploy

#### Option B: Railway
- [ ] Push code to GitHub
- [ ] Sign up at https://railway.app
- [ ] Create new project from GitHub
- [ ] Add environment variables
- [ ] Auto-deploys on git push

#### Option C: Heroku
- [ ] Install Heroku CLI
- [ ] Run `heroku login`
- [ ] Run `heroku create app-name`
- [ ] Set config vars with `heroku config:set`
- [ ] Run `git push heroku main`

#### Option D: VPS (DigitalOcean, AWS, etc.)
- [ ] SSH into server
- [ ] Install Node.js (v14+)
- [ ] Clone repository
- [ ] Run `npm install --production`
- [ ] Create `.env` file
- [ ] Install PM2: `npm install -g pm2`
- [ ] Start app: `pm2 start server.js`
- [ ] Configure Nginx reverse proxy
- [ ] Set up SSL with Let's Encrypt

## Post-Deployment Verification

### 6. Test Application
- [ ] Visit production URL
- [ ] Test registration flow
- [ ] Test login flow
- [ ] Complete a challenge and verify points
- [ ] Check leaderboard updates
- [ ] Test on mobile devices
- [ ] Verify all pages load correctly

### 7. API Testing
- [ ] Test `/api/health` endpoint
- [ ] Test `/api/register` with new user
- [ ] Test `/api/login` with credentials
- [ ] Test `/api/leaderboard` displays correctly
- [ ] Test `/api/challenges/award-points` with auth
- [ ] Test `/api/participant-stats` returns data

### 8. Database Verification
- [ ] Verify MongoDB connection is stable
- [ ] Check participants collection has data
- [ ] Check scores collection updates correctly
- [ ] Verify completedStages array updates
- [ ] Test data persistence after server restart

### 9. Monitoring & Logs
- [ ] Check server logs for errors
- [ ] Verify no sensitive data in logs
- [ ] Set up error monitoring (optional: Sentry, LogRocket)
- [ ] Test graceful shutdown (SIGTERM/SIGINT)
- [ ] Monitor memory usage

### 10. Security Final Check
- [ ] Verify HTTPS is working (if applicable)
- [ ] Test CORS only allows your domain
- [ ] Confirm JWT tokens expire correctly (24h)
- [ ] Check MongoDB connection uses SSL/TLS
- [ ] Review production error messages (no stack traces)

## Maintenance

### 11. Backup & Recovery
- [ ] Set up MongoDB automated backups (Atlas has this)
- [ ] Document recovery procedures
- [ ] Test backup restoration process

### 12. Documentation
- [ ] Update README with production URL
- [ ] Document any production-specific configurations
- [ ] Create runbook for common issues
- [ ] Share credentials securely with team (use password manager)

## Quick Commands Reference

```bash
# Generate secure JWT secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Test production mode locally
NODE_ENV=production npm start

# Check Node.js version
node --version

# Check npm version
npm --version

# Install dependencies (production only)
npm install --production

# View PM2 logs (if using PM2)
pm2 logs codeception

# Restart PM2 process
pm2 restart codeception
```

## Rollback Plan

If something goes wrong:
1. Check logs immediately
2. Verify environment variables are set correctly
3. Test database connection
4. Roll back to previous git commit if needed
5. Redeploy from working version

## Success Criteria

✅ Application loads without errors
✅ Users can register successfully
✅ Users can login and access challenges
✅ Points award correctly
✅ Leaderboard updates in real-time
✅ All 10 stages work properly
✅ Progress tracking syncs correctly
✅ No console errors in browser
✅ Mobile responsive works perfectly

---

**Last Updated**: Before Production Deployment
**Deployed By**: [Your Name]
**Platform**: [Render/Railway/Heroku/VPS]
**Production URL**: [https://your-domain.com]
