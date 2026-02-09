# Quick Reference Guide

## What's Been Built

✅ **Frontend ↔ Backend Integration** - Real data from PostgreSQL
✅ **Payment Processing** - Flutterwave, Paystack, Stripe scaffolding
✅ **Seller Portal** - Multi-seller marketplace infrastructure

---

## Files Created/Modified

### Backend Files (NEW)

```
backend/src/modules/
├── payments/                              # NEW MODULE
│   ├── payments.module.ts
│   ├── payments.service.ts
│   ├── payments.controller.ts
│   └── dto/
│       ├── create-intent.dto.ts
│       └── webhook.dto.ts
└── products/
    ├── seller-products.controller.ts      # NEW
    └── dto/
        ├── update-product.dto.ts          # NEW
        └── update-inventory.dto.ts        # NEW
```

**Extended:** `products.service.ts` with seller-scoped methods

### Frontend Files (NEW/UPDATED)

```
app/
└── seller/                                # NEW DIRECTORY
    ├── page.tsx                           # Auth guard
    └── seller-inner.tsx                   # Seller dashboard UI

lib/
└── api.ts                                 # EXTENDED with seller functions

app/checkout/page.tsx                      # COMPLETE REWRITE
app/cart/page.tsx                          # SIMPLIFIED
lib/cart.ts                                # COMPLETE REWRITE
```

### Documentation (NEW)

```
CART_MIGRATION.md
PAYMENT_INTEGRATION.md
SELLER_PORTAL.md
INTEGRATION_COMPLETE.md
QUICK_REFERENCE.md                         # This file
```

---

## API Endpoints Summary

### Products
```
GET  /products           Public product list
GET  /products/:id       Product details
```

### Cart
```
GET    /cart?userId=X&anonKey=Y    Get/create cart
POST   /cart/add                   Add item
DELETE /cart/remove                Remove item
DELETE /cart/clear                 Clear cart
```

### Orders
```
POST /orders/create?cartId=X       Create order from cart
```

### Payments
```
POST /payments/intent              Create payment intent
POST /payments/webhook             PSP webhook handler
GET  /payments/:orderId            Get payment status
```

### Seller
```
GET   /seller/products?sellerId=X              List seller products
POST  /seller/products                         Create product
PATCH /seller/products/:id?sellerId=X          Update product
PATCH /seller/products/:id/inventory?sellerId=X Update inventory
```

---

## Database Schema Changes

### New Models

**Payment**
```prisma
model Payment {
  id          String        @id @default(cuid())
  orderId     String        @unique
  provider    String
  externalRef String?
  amount      Decimal       @db.Decimal(12,2)
  currency    String
  status      PaymentStatus @default(INITIATED)
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt
}

enum PaymentStatus {
  INITIATED
  SUCCEEDED
  FAILED
}
```

### Updated Models

**Order** - Added payment relation and paymentRef field
**Product** - Fixed @db.Numeric → @db.Decimal, added cartItems relation

---

## Testing Quick Commands

### Start Services

**Backend:**
```bash
cd backend
npm install
npx prisma migrate dev
npm run start:dev
```

**Frontend:**
```bash
npm install
npm run dev
```

### Test Checkout Flow

1. Visit `http://localhost:3000/products`
2. Click on a product
3. Add to cart
4. Go to `/cart`
5. Go to `/checkout`
6. Select payment provider
7. Place order
8. Copy payment reference from UI

### Test Webhook

```bash
curl -X POST http://localhost:4000/payments/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "externalRef": "psp_flutterwave_ORDER_ID_12345",
    "status": "SUCCEEDED"
  }'
```

### Test Seller Portal

1. Login at `/auth/login`
2. Visit `/seller`
3. Click "New Product"
4. Fill form and submit
5. Edit product inline
6. Update inventory quantity

### Test Seller API

**List products:**
```bash
curl "http://localhost:4000/seller/products?sellerId=YOUR_USER_ID"
```

**Create product:**
```bash
curl -X POST http://localhost:4000/seller/products \
  -H "Content-Type: application/json" \
  -d '{
    "sellerId": "YOUR_USER_ID",
    "title": "Test Product",
    "description": "Test description",
    "price": 29.99,
    "currency": "USD"
  }'
```

**Update inventory:**
```bash
curl -X PATCH "http://localhost:4000/seller/products/PRODUCT_ID/inventory?sellerId=YOUR_USER_ID" \
  -H "Content-Type: application/json" \
  -d '{"quantity": 150}'
```

---

## Environment Variables

### Frontend `.env.local`

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:4000
REDIS_URL=redis://localhost:6379
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_strong_random_secret
```

### Backend `backend/.env`

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/sokonova_db"
PORT=4000
NODE_ENV=development

# PSP Credentials (for production)
# FLUTTERWAVE_SECRET_KEY=xxx
# FLUTTERWAVE_WEBHOOK_SECRET=xxx
# PAYSTACK_SECRET_KEY=xxx
# STRIPE_SECRET_KEY=xxx
```

---

## Key Concepts

### 1. Cart Persistence

**Guest users:**
- Cart linked to `anonKey` (localStorage)
- Single-device persistence

**Logged-in users:**
- Cart linked to `userId`
- Cross-device persistence

### 2. Payment Flow

```
CHECKOUT → CREATE ORDER → CREATE PAYMENT INTENT → PSP REDIRECT → WEBHOOK → UPDATE STATUS
```

**States:**
- Order: PENDING → PAID → SHIPPED → DELIVERED
- Payment: INITIATED → SUCCEEDED/FAILED

### 3. Seller Authorization

All seller endpoints verify ownership:

```typescript
if (existing.sellerId !== sellerId) {
  throw new ForbiddenException('Not authorized');
}
```

---

## Production Checklist

### Critical (Before Launch)

- [ ] Add JWT authentication guards
- [ ] Implement RBAC (role field on User)
- [ ] Verify PSP webhook signatures
- [ ] Configure CORS for production domain
- [ ] Set up SSL certificates
- [ ] Add environment-specific configs

### Important (Week 1)

- [ ] Add image upload (Cloudinary/S3)
- [ ] Implement soft delete
- [ ] Add error monitoring (Sentry)
- [ ] Set up logging infrastructure
- [ ] Add rate limiting
- [ ] Configure caching

### Enhancement (Month 1)

- [ ] Seller analytics dashboard
- [ ] Commission tracking system
- [ ] "Become a Seller" workflow
- [ ] Admin panel
- [ ] Email notifications
- [ ] Product search & filtering

---

## Common Issues

### "Cannot find module @nestjs/common"

**Issue:** Backend dependencies not installed
**Fix:** `cd backend && npm install`

### "Access Denied" on `/seller`

**Issue:** Not authenticated
**Fix:** Login at `/auth/login` first

### Products not loading

**Issue:** Backend not running or CORS error
**Fix:**
1. Check backend is running on port 4000
2. Verify `NEXT_PUBLIC_BACKEND_URL` in `.env.local`
3. Check browser console for errors

### Payment webhook not working

**Issue:** PSP signature verification would fail in production
**Fix:** See [PAYMENT_INTEGRATION.md](PAYMENT_INTEGRATION.md) for signature verification code

---

## Next Immediate Steps

1. **Test the complete flow:**
   - Products → Cart → Checkout → Payment → Seller Portal

2. **Add role field to User model:**
   ```prisma
   enum UserRole {
     BUYER
     SELLER
     ADMIN
   }

   model User {
     role UserRole @default(BUYER)
   }
   ```
   Then run: `npx prisma migrate dev --name add_user_role`

3. **Implement JWT guards:**
   - Create auth guards in backend
   - Add `@UseGuards(JwtAuthGuard, RolesGuard)` to controllers
   - Extract user from JWT instead of query params

4. **Deploy to staging:**
   - Backend: Railway/Render/AWS
   - Frontend: Vercel/Netlify
   - Database: Supabase/Neon/managed PostgreSQL

---

## Documentation Index

| File | What's Inside |
|------|---------------|
| [README.md](README.md) | Project overview, quick start, tech stack |
| [INTEGRATION_COMPLETE.md](INTEGRATION_COMPLETE.md) | Complete summary of all integrations |
| [CART_MIGRATION.md](CART_MIGRATION.md) | Cart architecture, Redis → PostgreSQL migration |
| [PAYMENT_INTEGRATION.md](PAYMENT_INTEGRATION.md) | Payment flow, PSP integration examples |
| [SELLER_PORTAL.md](SELLER_PORTAL.md) | Seller portal guide, API reference |
| [QUICK_REFERENCE.md](QUICK_REFERENCE.md) | This file - quick commands & reference |

---

## Support

If you encounter issues:

1. Check browser console for errors
2. Check backend logs for API errors
3. Verify environment variables are set
4. Review documentation files above
5. Check database schema is up-to-date: `npx prisma migrate status`

---

**Built with:** Next.js 14, NestJS, Prisma, PostgreSQL, TypeScript

**Status:** ✅ Ready for Testing
