# GitHub Secrets Setup Guide for CI/CD

This guide will walk you through setting up all required GitHub Secrets for automated deployments.

## Overview

You need to configure secrets for:
- **Vercel** (Frontend deployment)
- **Railway** (Backend deployment)
- **GitHub** (Repository secrets)

---

## Part 1: Vercel Secrets (Frontend)

### Step 1: Get Vercel Token

1. Go to https://vercel.com/account/tokens
2. Click **"Create Token"**
3. Name it: `sokonova-github-actions`
4. Scope: **Full Account**
5. Expiration: **No Expiration** (or custom)
6. Click **"Create"**
7. **Copy the token immediately** (you won't see it again)

### Step 2: Get Vercel Organization ID

1. Go to https://vercel.com/account
2. Look for **"Your ID"** or **"Organization ID"**
3. Or go to your team settings: https://vercel.com/teams/[your-team]/settings
4. Copy the **Organization ID** (looks like: `team_xxxxxxxxxxxxx`)

### Step 3: Get Vercel Project ID

**Option A: If project doesn't exist yet:**
1. Go to https://vercel.com/new
2. Import your GitHub repository: `Thepluscode/SOKONOVA`
3. Configure:
   - Framework Preset: **Next.js**
   - Root Directory: **/** (leave as root)
   - Build Command: `npm run build`
   - Output Directory: `.next`
4. Add environment variables (see below)
5. Click **"Deploy"**
6. After deployment, go to **Settings** → **General**
7. Copy the **Project ID** (looks like: `prj_xxxxxxxxxxxxx`)

**Option B: Via Vercel CLI:**
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link project
cd /Users/theophilusogieva/Downloads/sokonova-frontend
vercel link

# Get project details
vercel project ls
```

### Step 4: Add Vercel Secrets to GitHub

1. Go to https://github.com/Thepluscode/SOKONOVA/settings/secrets/actions
2. Click **"New repository secret"**
3. Add these three secrets:

**Secret 1:**
- Name: `VERCEL_TOKEN`
- Value: [paste your Vercel token from Step 1]

**Secret 2:**
- Name: `VERCEL_ORG_ID`
- Value: [paste your Organization ID from Step 2]

**Secret 3:**
- Name: `VERCEL_PROJECT_ID`
- Value: [paste your Project ID from Step 3]

---

## Part 2: Railway Secrets (Backend)

### Step 1: Create Railway Account

1. Go to https://railway.app
2. Sign up with GitHub (recommended)
3. Verify your account

### Step 2: Create Railway Project

1. Go to https://railway.app/new
2. Click **"Deploy from GitHub repo"**
3. Connect your GitHub account if not connected
4. Select repository: `Thepluscode/SOKONOVA`
5. Configure:
   - Name: `sokonova-backend`
   - Root Directory: `/backend`
   - Build Command: `npm install && npx prisma generate && npm run build`
   - Start Command: `npx prisma migrate deploy && npm run start:prod`
6. Click **"Deploy"**

### Step 3: Get Railway Token

1. Go to https://railway.app/account/tokens
2. Click **"Create Token"**
3. Name it: `sokonova-github-actions`
4. Copy the token immediately

### Step 4: Get Railway Project ID

1. Go to your Railway project dashboard
2. Click on **Settings** (gear icon)
3. Look for **"Project ID"** in the settings
4. Copy the ID (looks like: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`)

**Or via Railway CLI:**
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link project
cd /Users/theophilusogieva/Downloads/sokonova-frontend/backend
railway link

# Get project info
railway status
```

### Step 5: Add Railway Secrets to GitHub

1. Go to https://github.com/Thepluscode/SOKONOVA/settings/secrets/actions
2. Add these two secrets:

**Secret 4:**
- Name: `RAILWAY_TOKEN`
- Value: [paste your Railway token from Step 3]

**Secret 5:**
- Name: `RAILWAY_PROJECT_ID`
- Value: [paste your Project ID from Step 4]

---

## Part 3: Configure Environment Variables

### Vercel Environment Variables

1. Go to your Vercel project: https://vercel.com/[your-username]/sokonova
2. Go to **Settings** → **Environment Variables**
3. Add these variables (for Production, Preview, and Development):

```env
# Backend API
NEXT_PUBLIC_API_URL=https://your-railway-backend.up.railway.app

# NextAuth
NEXTAUTH_SECRET=[generate with: openssl rand -base64 32]
NEXTAUTH_URL=https://your-vercel-domain.vercel.app

# Sentry (Optional for now)
NEXT_PUBLIC_SENTRY_DSN=https://your-sentry-dsn
SENTRY_AUTH_TOKEN=your-sentry-auth-token
```

### Railway Environment Variables

1. Go to your Railway project dashboard
2. Click on your service
3. Go to **Variables** tab
4. Add these variables:

```env
# Database (Railway provides this automatically if you add PostgreSQL)
DATABASE_URL=postgresql://user:pass@host:port/db

# JWT
JWT_SECRET=[generate with: openssl rand -base64 32]

# Africa's Talking (Optional for now)
AFRICASTALKING_USERNAME=sandbox
AFRICASTALKING_API_KEY=your-api-key

# SendGrid (Optional for now)
SENDGRID_API_KEY=your-api-key
SENDGRID_FROM_EMAIL=noreply@sokonova.com

# Paystack (Optional for now)
PAYSTACK_SECRET_KEY=your-secret-key

# Cloudinary (Optional for now)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Redis (Add Upstash Redis plugin in Railway)
REDIS_URL=redis://default:password@host:port

# Sentry (Optional for now)
SENTRY_DSN=https://your-sentry-dsn
```

---

## Part 4: Verify Setup

### Test 1: Check GitHub Secrets

1. Go to https://github.com/Thepluscode/SOKONOVA/settings/secrets/actions
2. You should see 5 secrets:
   - ✅ VERCEL_TOKEN
   - ✅ VERCEL_ORG_ID
   - ✅ VERCEL_PROJECT_ID
   - ✅ RAILWAY_TOKEN
   - ✅ RAILWAY_PROJECT_ID

### Test 2: Trigger Deployment

1. Make a small change to your code (e.g., update README.md)
2. Commit and push:
   ```bash
   git add .
   git commit -m "test: trigger CI/CD"
   git push origin main
   ```
3. Go to https://github.com/Thepluscode/SOKONOVA/actions
4. Watch the workflows run:
   - ✅ Frontend Deploy
   - ✅ Backend Deploy

### Test 3: Check Deployments

**Vercel:**
1. Go to https://vercel.com/[your-username]/sokonova
2. Check deployment status
3. Click on the deployment to see logs
4. Visit your live URL

**Railway:**
1. Go to https://railway.app
2. Click on your project
3. Check deployment logs
4. Visit your backend URL (Settings → Domains)

---

## Quick Reference Commands

### Generate Secrets
```bash
# Generate JWT Secret
openssl rand -base64 32

# Generate NextAuth Secret
openssl rand -base64 32

# Generate API Key
openssl rand -hex 32
```

### Vercel CLI Commands
```bash
# Deploy manually
vercel --prod

# Check deployment status
vercel ls

# View logs
vercel logs
```

### Railway CLI Commands
```bash
# Deploy manually
railway up

# Check status
railway status

# View logs
railway logs
```

---

## Troubleshooting

### Issue: Vercel deployment fails with "Project not found"
**Solution:** Double-check `VERCEL_PROJECT_ID` matches your project ID in Vercel settings.

### Issue: Railway deployment fails with "Database connection error"
**Solution:**
1. Add PostgreSQL plugin in Railway dashboard
2. Copy the `DATABASE_URL` from Railway variables
3. Make sure `DATABASE_URL` is set in Railway environment variables

### Issue: GitHub Actions workflow doesn't trigger
**Solution:**
1. Check that secrets are added at repository level (not environment level)
2. Make sure branch name is `main` (not `master`)
3. Check workflow file is in `.github/workflows/` directory

### Issue: "Invalid token" error
**Solution:**
1. Regenerate the token (Vercel or Railway)
2. Update the GitHub secret with the new token
3. Re-run the workflow

---

## Next Steps After Setup

1. ✅ All secrets configured
2. ✅ First deployment successful
3. 🔄 Run database seed:
   ```bash
   railway run npm run prisma:seed
   ```
4. 🔄 Test your live app
5. 🔄 Set up custom domain (optional)
6. 🔄 Configure Sentry for monitoring

---

## Support

- **Vercel Docs:** https://vercel.com/docs
- **Railway Docs:** https://docs.railway.app
- **GitHub Actions:** https://docs.github.com/en/actions

Need help? Check the deployment logs in GitHub Actions for detailed error messages.
