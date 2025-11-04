# Vercel Deployment Guide for Codeception

## 📋 Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **MongoDB Atlas**: Your MongoDB database should be accessible from anywhere (whitelist 0.0.0.0/0)
3. **GitHub Repository**: Push your code to GitHub (recommended)

## 🚀 Deployment Steps

### Option 1: Deploy via Vercel CLI (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy from your project directory**
   ```bash
   vercel
   ```

4. **Follow the prompts:**
   - Set up and deploy? **Y**
   - Which scope? Select your account
   - Link to existing project? **N** (first time)
   - Project name? **codeception** (or your preferred name)
   - In which directory is your code? **./** (current directory)
   - Want to override settings? **N**

5. **Set environment variables** (during deployment or after):
   ```bash
   vercel env add MONGODB_URI production
   vercel env add JWT_SECRET production
   ```

6. **Deploy to production**
   ```bash
   vercel --prod
   ```

### Option 2: Deploy via Vercel Dashboard

1. **Go to [vercel.com/new](https://vercel.com/new)**

2. **Import your Git repository**
   - Connect your GitHub account
   - Select the repository
   - Click "Import"

3. **Configure Project**
   - Framework Preset: **Other**
   - Root Directory: **./** (leave as is)
   - Build Command: (leave empty)
   - Output Directory: **public**
   - Install Command: `npm install`

4. **Add Environment Variables**
   Click "Environment Variables" and add:
   
   | Name | Value |
   |------|-------|
   | `MONGODB_URI` | Your MongoDB connection string |
   | `JWT_SECRET` | Your secret key (generate with `openssl rand -base64 32`) |
   | `NODE_ENV` | `production` |
   | `FRONTEND_URL` | Your Vercel URL (e.g., `https://codeception.vercel.app`) |
   | `PRODUCTION_URL` | Same as FRONTEND_URL |

5. **Click "Deploy"**

## 🔧 Environment Variables Required

Create these in your Vercel project settings:

```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/codeception?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-here
NODE_ENV=production
FRONTEND_URL=https://your-app.vercel.app
PRODUCTION_URL=https://your-app.vercel.app
```

## 📝 Important Notes

### MongoDB Atlas Setup
1. Go to MongoDB Atlas → Network Access
2. Add IP Address: `0.0.0.0/0` (Allow access from anywhere)
3. This is required because Vercel uses dynamic IPs

### Custom Domain (Optional)
1. Go to your project → Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Update `FRONTEND_URL` and `PRODUCTION_URL` environment variables

### After Deployment

1. **Test your deployment:**
   - Visit your Vercel URL
   - Try registering a new user
   - Test login functionality
   - Check leaderboard

2. **Monitor logs:**
   ```bash
   vercel logs
   ```

3. **Redeploy if needed:**
   ```bash
   vercel --prod
   ```

## 🔍 Troubleshooting

### Issue: "Cannot GET /"
- Check that `server.js` is serving static files correctly
- Verify `vercel.json` routes configuration

### Issue: "Database connection failed"
- Verify `MONGODB_URI` is correct in Vercel environment variables
- Check MongoDB Atlas IP whitelist includes `0.0.0.0/0`
- Ensure database user has read/write permissions

### Issue: "API endpoints not working"
- Check `vercel.json` routes configuration
- Verify all environment variables are set
- Check Vercel function logs for errors

### Issue: "CORS errors"
- Update `FRONTEND_URL` and `PRODUCTION_URL` to match your Vercel domain
- Redeploy after changing environment variables

## 📊 Post-Deployment Checklist

- [ ] All pages load correctly
- [ ] Registration works
- [ ] Login authentication works
- [ ] Challenges are accessible
- [ ] Leaderboard displays correctly
- [ ] All environment variables are set
- [ ] MongoDB connection is working
- [ ] No console errors in browser
- [ ] Custom domain configured (if applicable)

## 🔄 Continuous Deployment

Once connected to GitHub:
- Every push to `main` branch will auto-deploy
- Pull requests create preview deployments
- Monitor deployments in Vercel dashboard

## 🌐 Vercel URLs

After deployment, you'll get:
- **Production**: `https://codeception.vercel.app`
- **Preview**: Unique URL for each PR/branch
- **Deployment**: Individual deployment URLs

## 💡 Tips

1. **Use environment variables for all secrets** - Never commit sensitive data
2. **Test locally first** - Use `npm run dev` to test before deploying
3. **Monitor Vercel Analytics** - Track performance and usage
4. **Set up notifications** - Get alerts for deployment failures
5. **Use preview deployments** - Test changes before merging to main

---

Need help? Contact the Tech Society team or check [Vercel Documentation](https://vercel.com/docs)
