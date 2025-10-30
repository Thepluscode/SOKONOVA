# SokoNova Application - Startup Guide

## ✅ Your App is Running!

**Frontend:** http://localhost:54112
**Backend API:** http://localhost:4000

---

## 🚀 How to Start the Application

### Option 1: Start Both Servers (Recommended)

Open **2 terminal windows**:

**Terminal 1 - Backend:**
```bash
cd "/Users/theophilusogieva/Downloads/sokonova-frontend/backend"
NODE_ENV=development PORT=4000 DATABASE_URL="postgresql://postgres:MY12databas@db.xefijjbzljftiqkjvszs.supabase.co:5432/postgres" npm run start:dev
```

**Terminal 2 - Frontend:**
```bash
cd "/Users/theophilusogieva/Downloads/sokonova-frontend"
NODE_ENV=development npm run dev
```

---

## 🔧 Project Structure

```
sokonova-frontend/
├── app/                    # Next.js App Router pages
├── components/             # React components
├── lib/                    # Utilities (cart, auth, etc.)
├── prisma/                 # Database schema
├── backend/                # NestJS API server
│   ├── src/
│   │   ├── modules/       # All API modules
│   │   │   ├── products/
│   │   │   ├── cart/
│   │   │   ├── orders/
│   │   │   ├── payments/
│   │   │   ├── disputes/
│   │   │   ├── reviews/
│   │   │   ├── storefront/
│   │   │   └── discovery/
│   │   └── main.ts        # Backend entry point
│   └── prisma/            # Backend Prisma schema
└── public/                # Static assets

```

---

## ⚠️ CRITICAL: NODE_ENV Issue

**Problem:** Your system has `NODE_ENV=production` set globally, which prevents `devDependencies` (like tailwindcss) from installing.

**Solution:** Always prefix commands with `NODE_ENV=development`

**To Fix Permanently:**
```bash
# Check where it's set:
grep -r "NODE_ENV" ~/.bash_profile ~/.bashrc ~/.zshrc ~/.zprofile 2>/dev/null

# Remove or comment out the line that sets NODE_ENV=production
```

---

## 📦 Features Included

✅ **Payment Integration** - Paystack, Flutterwave, Stripe webhooks
✅ **Disputes & Trust** - Order dispute resolution system
✅ **Storefronts** - Seller-specific branded pages
✅ **Reviews** - Product and seller rating system
✅ **Discovery** - Category and region-based browsing
✅ **Fulfillment** - Order tracking and shipping
✅ **Seller Applications** - Onboarding workflow
✅ **Payouts** - Commission calculation and seller payments

---

## 🗄️ Database

**Provider:** Supabase PostgreSQL
**Status:** Connected ✅
**Migrations:** Applied ✅

To run new migrations:
```bash
cd "/Users/theophilusogieva/Downloads/sokonova-frontend"
npx prisma migrate dev --name your_migration_name
```

---

## 🐛 Known Issues (Non-Critical)

1. **mock-product.png** - Placeholder images returning 404 (just cosmetic)
2. **Logo** - Basic SVG placeholder created, replace with your design later

---

## 📝 Development Tips

### Add New Products
```bash
curl -X POST http://localhost:4000/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Product",
    "price": 2999,
    "description": "A test product",
    "category": "Electronics"
  }'
```

### View Cart
```bash
curl "http://localhost:4000/cart?anonKey=test123"
```

### Check All API Routes
Visit http://localhost:4000 and check the logs for all mapped routes

---

## 🎯 Next Steps

1. Replace logo at `/public/sokonova-logo.svg`
2. Add product images to `/public/products/`
3. Configure payment provider API keys in `.env.local`
4. Customize theme colors in `tailwind.config.ts`
5. Set up Redis for session storage (optional)

---

**Built with:**
- Next.js 14.2.5 (App Router)
- NestJS (Backend API)
- Prisma ORM
- PostgreSQL (Supabase)
- Tailwind CSS
- NextAuth.js

**Status:** ✅ Fully operational!
