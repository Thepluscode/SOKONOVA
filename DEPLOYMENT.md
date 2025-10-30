# SokoNova Deployment Guide 🚀

Complete guide to deploying SokoNova to production using the modern serverless stack.

**Stack:**
- Frontend: Vercel (Edge CDN + Image Optimization)
- Backend: Railway (Auto-scaling NestJS)
- Database: Neon Postgres (Serverless)
- Redis: Upstash (Serverless Redis)
- Storage: Cloudflare R2 (S3-compatible)
- Email: Resend/SendGrid
- SMS: Africa's Talking
- Monitoring: Sentry + Logtail

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Infrastructure Setup](#infrastructure-setup)
3. [Environment Variables](#environment-variables)
4. [Database Setup](#database-setup)
5. [CI/CD Setup](#cicd-setup)
6. [Deployment](#deployment)
7. [Post-Deployment](#post-deployment)
8. [Monitoring](#monitoring)
9. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Accounts

✅ **GitHub** - For CI/CD
✅ **Vercel** - Frontend hosting
✅ **Railway** - Backend hosting
✅ **Neon** - Postgres database
✅ **Upstash** - Redis cache
✅ **Cloudflare** - R2 storage
✅ **Sentry** - Error tracking

### Optional Services

- **Resend** or **SendGrid** - Email delivery
- **Africa's Talking** - SMS for African markets
- **Logtail** - Structured logging

### Tools

```bash
# Install required CLIs
npm install -g vercel @railway/cli
```

---

## Infrastructure Setup

### 1. Vercel (Frontend)

**Create Project:**
```bash
cd sokonova-frontend
vercel
```

**Configure:**
- Framework: Next.js
- Root Directory: `./`
- Build Command: `npm run build`
- Output Directory: `.next`

**Add Domains:**
- Production: `sokonova.com`
- Preview: Auto-generated

### 2. Railway (Backend)

**Create Project:**
```bash
cd backend
railway init
```

**Configure:**
- Runtime: Node.js 18
- Build Command: `npm run build`
- Start Command: `npm run start:prod`
- Port: 4000

**Add Domains:**
- Production: `api.sokonova.com`
- Staging: `api-staging.sokonova.com`

### 3. Neon Postgres

**Create Database:**
1. Go to [neon.tech](https://neon.tech)
2. Create project: `sokonova-production`
3. Copy connection string

**Features:**
- Auto-scaling
- Branching (great for PRs)
- Serverless (scales to zero)

### 4. Upstash Redis

**Create Database:**
1. Go to [upstash.com](https://upstash.com)
2. Create database: `sokonova-cache`
3. Copy Redis URL

**Features:**
- REST API (serverless-friendly)
- Global replication
- Redis 7 compatible

### 5. Cloudflare R2

**Create Bucket:**
1. Go to Cloudflare dashboard
2. Create R2 bucket: `sokonova-uploads`
3. Generate API token

**Features:**
- S3-compatible API
- Zero egress fees
- Global CDN

---

## Environment Variables

### Frontend (.env.production)

```bash
# Backend API
NEXT_PUBLIC_BACKEND_URL=https://api.sokonova.com

# Authentication
NEXTAUTH_URL=https://sokonova.com
NEXTAUTH_SECRET=<generate-with-openssl-rand-base64-32>

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Sentry
NEXT_PUBLIC_SENTRY_DSN=https://...@sentry.io/...
SENTRY_AUTH_TOKEN=sntrys_...

# Analytics (Optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

**Add to Vercel:**
```bash
vercel env add NEXT_PUBLIC_BACKEND_URL production
vercel env add NEXTAUTH_SECRET production
# ... repeat for all variables
```

### Backend (.env on Railway)

```bash
# Database
DATABASE_URL=postgresql://user:pass@neon.tech/sokonova?sslmode=require

# Redis
REDIS_URL=rediss://default:xxx@upstash.io:6379

# Server
PORT=4000
NODE_ENV=production
CORS_ORIGIN=https://sokonova.com

# JWT
JWT_SECRET=<generate-with-openssl-rand-base64-32>
JWT_EXPIRATION=7d

# Email
SENDGRID_API_KEY=SG.xxx
SENDGRID_FROM_EMAIL=notifications@sokonova.com

# SMS
AFRICASTALKING_API_KEY=xxx
AFRICASTALKING_USERNAME=sandbox
AFRICASTALKING_SHORT_CODE=SokoNova

# Payments
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
FLUTTERWAVE_SECRET_KEY=FLWSECK-xxx
PAYSTACK_SECRET_KEY=sk_live_xxx

# Storage
S3_ENDPOINT=https://xxx.r2.cloudflarestorage.com
S3_ACCESS_KEY_ID=xxx
S3_SECRET_ACCESS_KEY=xxx
S3_BUCKET_NAME=sokonova-uploads
S3_REGION=auto

# Monitoring
SENTRY_DSN=https://...@sentry.io/...
```

**Add to Railway:**
```bash
railway variables set DATABASE_URL=postgresql://...
railway variables set REDIS_URL=rediss://...
# ... repeat for all variables
```

---

## Database Setup

### 1. Run Migrations

**Railway:**
```bash
# Automatic on deploy (see Dockerfile)
# Manual trigger:
railway run npx prisma migrate deploy
```

### 2. Seed Data (Optional)

```bash
# Connect to production database
railway run npx prisma db seed
```

**⚠️ Warning:** Only seed on first deploy!

### 3. Verify Schema

```bash
railway run npx prisma studio
```

---

## CI/CD Setup

### GitHub Secrets

Add these to your GitHub repository settings:

**Vercel:**
- `VERCEL_TOKEN` - Vercel auth token
- `VERCEL_ORG_ID` - Vercel organization ID
- `VERCEL_PROJECT_ID` - Vercel project ID

**Railway:**
- `RAILWAY_TOKEN` - Railway auth token
- `RAILWAY_TOKEN_STAGING` - Staging environment token

**Sentry:**
- `SENTRY_AUTH_TOKEN` - For uploading source maps

### Workflows

**`.github/workflows/frontend-deploy.yml`**
- Triggers on push to `main`
- Lints and type-checks
- Deploys to Vercel
- Comments PR with URL

**`.github/workflows/backend-deploy.yml`**
- Triggers on push to `main` (backend changes)
- Runs tests
- Deploys to Railway
- Runs migrations

**`.github/workflows/pr-preview.yml`**
- Triggers on PR open/update
- Creates preview deployment
- Runs Lighthouse CI
- Comments results

---

## Deployment

### Initial Deployment

**1. Push to main branch:**
```bash
git add .
git commit -m "chore: production setup"
git push origin main
```

**2. GitHub Actions will:**
- ✅ Run tests
- ✅ Build frontend & backend
- ✅ Deploy to Vercel & Railway
- ✅ Run database migrations
- ✅ Comment deployment URLs

**3. Verify deployment:**
```bash
curl https://api.sokonova.com/health
curl https://sokonova.com
```

### Staging Deployment

**1. Create staging branch:**
```bash
git checkout -b staging
git push origin staging
```

**2. Configure Railway:**
- Create staging service
- Point to `staging` branch
- Add staging environment variables

**3. Access:**
- Frontend: `https://sokonova-git-staging.vercel.app`
- Backend: `https://api-staging.sokonova.com`

---

## Post-Deployment

### 1. DNS Configuration

**Add DNS records:**
```
Type  Name              Value
----  ----              -----
CNAME sokonova.com      cname.vercel-dns.com
CNAME api.sokonova.com  proxy.railway.app
```

### 2. SSL Certificates

**Vercel:**
- Auto-generated (Let's Encrypt)
- No action needed

**Railway:**
- Auto-generated
- Verifies via DNS

### 3. Webhook Configuration

**Stripe:**
```bash
# Add webhook endpoint
https://api.sokonova.com/webhooks/stripe

# Events to listen:
- payment_intent.succeeded
- payment_intent.payment_failed
- charge.refunded
```

**Flutterwave:**
```bash
https://api.sokonova.com/webhooks/flutterwave
```

### 4. Test Production

**Create test order:**
```bash
# Use Stripe test cards
# Use Flutterwave test accounts
# Verify webhook delivery
```

---

## Monitoring

### Sentry Dashboard

**Error Tracking:**
- Frontend: https://sentry.io/organizations/sokonova/projects/frontend
- Backend: https://sentry.io/organizations/sokonova/projects/backend

**Alerts:**
- New error type detected
- Error rate > 1% of requests
- Response time > 2s for 5 minutes

### Health Checks

**Endpoints:**
```bash
# Liveness (is process running?)
GET https://api.sokonova.com/health/live

# Readiness (ready to serve traffic?)
GET https://api.sokonova.com/health/ready

# Full health check
GET https://api.sokonova.com/health
```

**Expected Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-10-30T12:00:00.000Z",
  "uptime": 3600,
  "environment": "production",
  "checks": {
    "database": {
      "status": "healthy",
      "latency": "15ms"
    },
    "redis": {
      "status": "healthy"
    }
  }
}
```

### Uptime Monitoring

**Recommended Services:**
- **Better Uptime** - https://betteruptime.com
- **UptimeRobot** - https://uptimerobot.com
- **Checkly** - https://checklyhq.com

**Configure:**
- Check every 1 minute
- Alert on 2 consecutive failures
- Monitor: `/health`, `/health/ready`

### Logs

**Railway Logs:**
```bash
railway logs --tail
```

**Filter by level:**
```bash
railway logs --filter "error"
```

### Performance Monitoring

**Vercel Analytics:**
- Real User Monitoring (RUM)
- Core Web Vitals
- Geographic performance

**Access:**
https://vercel.com/sokonova/analytics

---

## Troubleshooting

### Frontend Issues

**Problem:** 500 error on page load
**Solution:**
```bash
# Check Vercel logs
vercel logs

# Verify env vars
vercel env ls
```

**Problem:** Images not loading
**Solution:**
- Check `next.config.js` image domains
- Verify R2 bucket is public

### Backend Issues

**Problem:** Database connection error
**Solution:**
```bash
# Test connection
railway run npx prisma db pull

# Check connection string
railway variables
```

**Problem:** Redis connection timeout
**Solution:**
- Verify Upstash URL format
- Check firewall rules

### Deployment Issues

**Problem:** GitHub Action fails
**Solution:**
```bash
# Check secrets are set
gh secret list

# Re-run workflow
gh workflow run frontend-deploy.yml
```

**Problem:** Migration fails
**Solution:**
```bash
# Check migration history
railway run npx prisma migrate status

# Reset database (⚠️ destructive)
railway run npx prisma migrate reset
```

---

## Scaling

### Horizontal Scaling

**Railway:**
- Auto-scales based on CPU/memory
- Configure in Railway dashboard

**Vercel:**
- Edge functions (auto-scale)
- No configuration needed

### Database Scaling

**Neon:**
- Auto-scales compute
- Configure max connections
- Enable read replicas

### Caching Strategy

**Redis:**
- Cache frequently accessed data
- Set TTL based on data freshness
- Use Redis Pub/Sub for real-time updates

---

## Backup & Recovery

### Database Backups

**Neon:**
- Daily automatic backups (7 days retention)
- Manual backup:
```bash
pg_dump $DATABASE_URL > backup.sql
```

**Restore:**
```bash
psql $DATABASE_URL < backup.sql
```

### File Backups

**R2:**
- Enable versioning
- Lifecycle policies for old files
- Replicate to second bucket

---

## Cost Estimates

### Monthly Costs (Small Scale)

| Service | Plan | Cost |
|---------|------|------|
| Vercel | Pro | $20/month |
| Railway | Hobby | $5/month |
| Neon | Free | $0 (up to 0.5GB) |
| Upstash | Free | $0 (up to 10K commands/day) |
| Cloudflare R2 | Pay-as-you-go | $0.015/GB |
| SendGrid | Free | $0 (up to 100 emails/day) |
| Sentry | Developer | $0 (up to 5K events/month) |
| **Total** | | **~$25/month** |

### Medium Scale (1000 users/day)

| Service | Plan | Cost |
|---------|------|------|
| Vercel | Pro | $20/month |
| Railway | Starter | $20/month |
| Neon | Launch | $19/month |
| Upstash | Pro | $10/month |
| Cloudflare R2 | Pay-as-you-go | ~$5/month |
| SendGrid | Essentials | $20/month |
| Sentry | Team | $26/month |
| **Total** | | **~$120/month** |

---

## Security Checklist

✅ **Environment Variables**
- [ ] All secrets in environment variables (not code)
- [ ] Different secrets for staging/production
- [ ] Rotate secrets every 90 days

✅ **Authentication**
- [ ] JWT secrets are strong (32+ chars)
- [ ] Session expiry configured
- [ ] HTTPS enforced

✅ **Database**
- [ ] Connection pooling enabled
- [ ] SSL/TLS required
- [ ] Principle of least privilege (user permissions)

✅ **API Security**
- [ ] Rate limiting enabled
- [ ] CORS configured correctly
- [ ] Input validation on all endpoints

✅ **Monitoring**
- [ ] Error tracking (Sentry)
- [ ] Uptime monitoring
- [ ] Log aggregation

---

## Next Steps

1. ✅ **Week 1:** Deploy to production
2. 🔄 **Week 2:** Add search (Meilisearch)
3. 🔄 **Week 3:** Implement payment reconciliation
4. 🔄 **Week 4:** Add multi-currency support

---

## Support

**Documentation:** https://docs.sokonova.com
**Status Page:** https://status.sokonova.com
**Support:** support@sokonova.com

---

**Last Updated:** October 30, 2025
**Version:** 1.0.0
**Author:** SokoNova DevOps Team
