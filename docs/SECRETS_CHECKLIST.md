# GitHub Secrets Setup Checklist ✅

Quick checklist to set up CI/CD secrets in 15 minutes.

---

## 📋 Checklist

### Vercel Setup (5 minutes)

- [ ] **1. Get Vercel Token**
  - Go to: https://vercel.com/account/tokens
  - Create token named: `sokonova-github-actions`
  - Copy token: `_________________________`

- [ ] **2. Get Vercel Org ID**
  - Go to: https://vercel.com/account
  - Copy Organization ID: `team_________________`

- [ ] **3. Create Vercel Project**
  - Go to: https://vercel.com/new
  - Import GitHub repo: `Thepluscode/SOKONOVA`
  - Deploy once
  - Copy Project ID: `prj_________________`

- [ ] **4. Add to GitHub Secrets**
  - Go to: https://github.com/Thepluscode/SOKONOVA/settings/secrets/actions
  - Add `VERCEL_TOKEN`: ✅
  - Add `VERCEL_ORG_ID`: ✅
  - Add `VERCEL_PROJECT_ID`: ✅

---

### Railway Setup (5 minutes)

- [ ] **5. Get Railway Token**
  - Go to: https://railway.app/account/tokens
  - Create token: `sokonova-github-actions`
  - Copy token: `_________________________`

- [ ] **6. Create Railway Project**
  - Go to: https://railway.app/new
  - Deploy from GitHub: `Thepluscode/SOKONOVA`
  - Set root directory: `/backend`
  - Copy Project ID: `_________________________`

- [ ] **7. Add to GitHub Secrets**
  - Go to: https://github.com/Thepluscode/SOKONOVA/settings/secrets/actions
  - Add `RAILWAY_TOKEN`: ✅
  - Add `RAILWAY_PROJECT_ID`: ✅

---

### Environment Variables (5 minutes)

- [ ] **8. Vercel Environment Variables**
  - `NEXT_PUBLIC_API_URL`: Your Railway backend URL
  - `NEXTAUTH_SECRET`: `openssl rand -base64 32`
  - `NEXTAUTH_URL`: Your Vercel domain

- [ ] **9. Railway Environment Variables**
  - Add PostgreSQL plugin (auto-adds `DATABASE_URL`)
  - Add Redis plugin (auto-adds `REDIS_URL`)
  - `JWT_SECRET`: `openssl rand -base64 32`

---

### Test Deployment

- [ ] **10. Trigger First Deployment**
  ```bash
  git add .
  git commit -m "feat: setup CI/CD"
  git push origin main
  ```

- [ ] **11. Watch GitHub Actions**
  - Go to: https://github.com/Thepluscode/SOKONOVA/actions
  - Frontend Deploy: ✅
  - Backend Deploy: ✅

- [ ] **12. Verify Live Sites**
  - Frontend: https://your-domain.vercel.app ✅
  - Backend: https://your-backend.up.railway.app/health ✅

---

## 🚀 Quick Start Commands

### Generate Secrets
```bash
# For NEXTAUTH_SECRET and JWT_SECRET
openssl rand -base64 32
```

### Test Backend Health
```bash
curl https://your-backend.up.railway.app/health
```

### Run Database Seed
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login and link
railway login
cd backend
railway link

# Run seed
railway run npm run prisma:seed
```

---

## 📍 Important URLs

| Service | URL | Purpose |
|---------|-----|---------|
| GitHub Secrets | https://github.com/Thepluscode/SOKONOVA/settings/secrets/actions | Add secrets here |
| GitHub Actions | https://github.com/Thepluscode/SOKONOVA/actions | Monitor deployments |
| Vercel Dashboard | https://vercel.com | Frontend hosting |
| Railway Dashboard | https://railway.app | Backend hosting |
| Vercel Tokens | https://vercel.com/account/tokens | Create Vercel token |
| Railway Tokens | https://railway.app/account/tokens | Create Railway token |

---

## ⚡ Expected Results

After setup, every push to `main` will:
1. ✅ Run linting and type-checking
2. ✅ Deploy frontend to Vercel
3. ✅ Deploy backend to Railway
4. ✅ Run database migrations
5. ✅ Create preview deployment for PRs

---

## 🆘 Quick Troubleshooting

| Error | Solution |
|-------|----------|
| "Project not found" | Check `VERCEL_PROJECT_ID` or `RAILWAY_PROJECT_ID` |
| "Invalid token" | Regenerate token and update GitHub secret |
| "Database connection failed" | Add PostgreSQL plugin in Railway |
| Workflow not triggering | Check secrets are at repository level |

---

## ✅ Success Criteria

You're done when:
- [ ] All 5 secrets added to GitHub
- [ ] Push triggers automatic deployments
- [ ] Frontend is live on Vercel
- [ ] Backend is live on Railway
- [ ] `/health` endpoint returns healthy status

---

**Need detailed instructions?** See [GITHUB_SECRETS_SETUP.md](GITHUB_SECRETS_SETUP.md)
