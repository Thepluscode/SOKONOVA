# Deploy to Railway - Quick Start

## Option 1: Railway CLI (FASTEST - 5 minutes)

### Step 1: Install Railway CLI
```bash
# Mac
brew install railway

# Or using npm
npm i -g @railway/cli
```

### Step 2: Login to Railway
```bash
railway login
```
This opens your browser to authenticate.

### Step 3: Initialize Project
```bash
cd backend
railway init
```
- Select "Create new project"
- Name it: "sokonova-backend"

### Step 4: Add PostgreSQL Database
```bash
railway add --database postgresql
railway add --database redis
```

### Step 5: Link Environment Variables
```bash
# Railway will auto-generate DATABASE_URL and REDIS_URL
# You need to add your Stripe keys:

railway variables set STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY

railway variables set STRIPE_PUBLIC_KEY=pk_test_YOUR_PUBLIC_KEY

railway variables set NODE_ENV=production
railway variables set PORT=4000
```

### Step 6: Deploy
```bash
railway up
```

This will:
1. Build your app
2. Run Prisma migrations
3. Start the server
4. Give you a public URL

### Step 7: Get Your URL
```bash
railway domain
```

Or add a custom domain:
```bash
railway domain add
```

---

## Option 2: Railway Dashboard (7 minutes)

### Step 1: Create Account
1. Go to https://railway.app
2. Sign up with GitHub
3. Create new project

### Step 2: Add PostgreSQL
1. Click "New" → "Database" → "PostgreSQL"
2. Wait ~30 seconds for provisioning

80: ### Step 3: Add Redis
81: 1. Click "New" → "Database" → "Redis"
82: 2. Wait ~30 seconds for provisioning

### Step 4: Deploy from GitHub
1. Click "New" → "GitHub Repo"
2. Select your sokonova repository
3. Select `/backend` as root directory
4. Railway auto-detects NestJS

### Step 4: Add Environment Variables
In the Railway dashboard:
```
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLIC_KEY=pk_test_...
NODE_ENV=production
PORT=4000
```

DATABASE_URL and REDIS_URL are automatically set by Railway.

### Step 5: Deploy
1. Click "Deploy"
2. Wait 2-3 minutes
3. Click "Settings" → "Generate Domain"
4. Copy your public URL!

---

## Option 3: Render (Alternative - 10 minutes)

### Step 1: Create Account
Go to https://render.com and sign up.

### Step 2: New Web Service
1. Click "New +" → "Web Service"
2. Connect your GitHub repo
3. Select `backend` directory
4. Name: `sokonova-backend`

### Step 3: Configure
```
Build Command: npm install && npx prisma generate && npm run build
Start Command: npx prisma migrate deploy && npm run start:prod
```

### Step 4: Add PostgreSQL
1. Click "New +" → "PostgreSQL"
2. Name: `sokonova-db`
3. Copy the "Internal Database URL"

### Step 5: Environment Variables
Add in Render dashboard:
```
DATABASE_URL=[paste internal database URL]
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLIC_KEY=pk_test_...
NODE_ENV=production
PORT=4000
```

### Step 6: Deploy
Click "Create Web Service" - takes ~5 minutes.

---

## Post-Deployment Checklist

### 1. Test Health Endpoint
```bash
curl https://your-app.railway.app/health
```

Expected response:
```json
{
  "status": "healthy",
  "database": {"status": "healthy"},
  "redis": {"status": "healthy"}
}
```

### 2. Test User Registration
```bash
curl -X POST https://your-app.railway.app/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'
```

### 3. Test Seller Activation
```bash
curl -X POST https://your-app.railway.app/seller-applications/activate-instant \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "USER_ID_FROM_STEP_2",
    "businessName": "Test Shop",
    "phone": "+254712345678",
    "country": "Kenya",
    "city": "Nairobi",
    "storefrontDesc": "Test",
    "bankName": "Test Bank",
    "accountNumber": "123456",
    "accountName": "Test",
    "bankCode": "TEST"
  }'
```

### 4. Verify Stripe Integration
```bash
curl -X POST https://your-app.railway.app/payments/intent \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "ORDER_ID",
    "provider": "stripe"
  }'
```

---

## Troubleshooting

### Build Fails
- Check Railway logs: `railway logs`
- Ensure all dependencies in package.json
- Verify Prisma schema is valid

### Database Connection Fails
- Verify DATABASE_URL is set
- Check Railway database is running
- Ensure Prisma migrations ran

### App Crashes on Start
- Check environment variables are set
- Review Railway logs for errors
- Ensure PORT is set correctly

### Health Check Fails
- Verify health endpoint works locally first
- Check Redis connection (if using)
- Ensure database migrations completed

---

## Cost Estimate

### Railway (Recommended)
- **Hobby Plan**: $5/month
- Includes: 500 hours execution, PostgreSQL database
- **Start with $5 free credit**

### Render
- **Free Tier**: $0/month
- Web services spin down after 15 min inactivity
- PostgreSQL: $7/month (separate)

**Recommendation**: Start with Railway free credit, upgrade to Hobby ($5/mo) when you have revenue.

---

## Security Checklist

Before going live:
- [ ] STRIPE_SECRET_KEY is set (test keys for now)
- [ ] DATABASE_URL is using SSL
- [ ] NODE_ENV=production
- [ ] CORS configured for your frontend domain
- [ ] No .env file committed to git
- [ ] Health endpoint returns 200

---

## Next Steps After Deployment

1. Update frontend API URL to production URL
2. Test complete flow from frontend
3. Enable Stripe webhooks (point to your production URL)
4. Set up monitoring (Railway has built-in)
5. Configure custom domain (optional)

---

## Quick Reference

### Railway Commands
```bash
railway login          # Authenticate
railway init           # Create/link project
railway up             # Deploy
railway logs           # View logs
railway variables      # Manage env vars
railway domain         # Get/set domain
railway open           # Open in browser
```

### Useful URLs
- Railway Dashboard: https://railway.app/dashboard
- Railway Docs: https://docs.railway.app
- Render Dashboard: https://dashboard.render.com
- Render Docs: https://render.com/docs

---

**Estimated Time to Deploy**: 5-10 minutes
**Estimated Cost**: $0 (using free credits) → $5/month when scaled

**YOU'RE ONE COMMAND AWAY FROM PRODUCTION.**

```bash
railway up
```

GO.
