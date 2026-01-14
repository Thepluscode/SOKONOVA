# SokoNova — Multi-Seller Marketplace Platform

A production-ready e-commerce marketplace platform built with NestJS, React, and PostgreSQL.

**Features:**
- 🛒 Real-time cart with PostgreSQL persistence
- 💳 Payment processing (Flutterwave, Paystack, Stripe)
- 🏪 Multi-seller marketplace with seller portal
- 💰 Commission & payout system (10% marketplace fee)
- 🚚 Fulfillment & shipping tracking (per-item status)
- 📝 Seller onboarding with admin approval workflow
- 🔐 JWT authentication with role-based access
- 📦 Order management & tracking
- 📊 Enhanced seller analytics dashboard
- 📱 **React Native mobile app (Expo)**
- 🔔 **WebSocket real-time notifications**
- 📷 **S3/R2 image uploads**
- 🔍 **Search suggestions & recent history**
- 🎨 Light/dark theme support

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Redis (optional, for sessions)

### 1. Environment Setup

**Frontend** (`.env.local`):
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:4000
REDIS_URL=redis://localhost:6379
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_strong_random_secret
```

**Backend** (`backend/.env`):
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/sokonova_db"
PORT=4000
NODE_ENV=development
```

### 2. Backend Setup

```bash
cd backend
npm install
npx prisma migrate dev
npm run start:dev
```

Backend runs on `http://localhost:4000`

### 3. Frontend Setup

```bash
# From project root
npm install
npm run dev
```

Frontend runs on `http://localhost:3000`

---

## 📚 Complete Integration Guide

This platform includes six major integrations:

### 1. Frontend ↔ Backend Integration
Real product data from PostgreSQL database with cross-device cart persistence.

📖 [Read CART_MIGRATION.md](CART_MIGRATION.md)

### 2. Payment & Order Flow
Complete payment processing with PSP integration scaffolding for Flutterwave, Paystack, and Stripe.

📖 [Read PAYMENT_INTEGRATION.md](PAYMENT_INTEGRATION.md)

### 3. Seller Portal
Multi-seller marketplace with seller dashboard, product management, and inventory tracking.

📖 [Read SELLER_PORTAL.md](SELLER_PORTAL.md)

### 4. Commission & Payouts
Marketplace revenue model with seller earnings tracking, 10% commission, and payout management.

📖 [Read PAYOUTS_COMMISSION.md](PAYOUTS_COMMISSION.md) | [Quick Summary](COMMISSION_PAYOUTS_SUMMARY.md)

### 5. Fulfillment & Shipping Tracking
Per-item shipping status tracking with proof of delivery, carrier tracking codes, and visual buyer timeline.

📖 [Read FULFILLMENT_TRACKING.md](FULFILLMENT_TRACKING.md)

### 6. Seller Onboarding & Application Review
Scalable seller recruitment with admin approval workflow for quality control.

📖 [Read SELLER_ONBOARDING.md](SELLER_ONBOARDING.md) | [Quick Setup](SETUP_SELLER_ONBOARDING.md)

---

## 🎯 Key Features

### For Buyers
- Browse products from multiple sellers
- Add items to cart with real-time updates
- Persistent cart across devices (when logged in)
- Secure checkout with multiple payment options
- **Apply to become a seller** with public application form
- **Order tracking with visual timeline** (per-item status)
- **Real-time shipping updates** with tracking codes
- **Delivery proof viewing** (photos, signatures, receipts)

### For Sellers
- Dedicated seller dashboard at `/seller`
- Create and manage products
- Update inventory in real-time
- Track orders per product
- **View earnings breakdown** (gross, fees, net)
- **Download CSV** for accounting and tax records
- Transparent commission structure (10%)
- **Fulfillment queue** with pending shipments
- **Mark items as shipped** with tracking codes
- **Confirm delivery** with proof attachments
- **Flag issues** for admin resolution

### For Platform
- Multi-seller marketplace infrastructure
- **10% commission** on all sales (configurable)
- **Automatic earnings calculation** per order
- **Payout management** with batch processing
- **CSV export** for bank transfer / mobile money
- Payment processing with PSP integration
- Order lifecycle management (PENDING → PAID → SHIPPED → DELIVERED)
- **Per-item fulfillment tracking** (PACKED → SHIPPED → DELIVERED)
- **Carrier tracking integration** (DHL, FedEx, UPS, local couriers)
- **Delivery proof system** (reduces disputes and chargebacks)
- **Seller onboarding with approval workflow** (PENDING → APPROVED/REJECTED)
- **Admin review dashboard** for seller applications
- **Scalable seller recruitment** without manual vetting
- Role-based access control (BUYER/SELLER/ADMIN ready)
- **Full audit trail** for payouts, shipments, and applications

---

## 🗂️ Project Structure

```
sokonova-starter-nextjs-tailwind-redis-auth/
├── app/                          # Next.js app directory
│   ├── products/[id]/            # Product detail pages
│   ├── cart/                     # Cart page
│   ├── checkout/                 # Checkout flow
│   ├── seller/                   # Seller portal
│   │   ├── page.tsx              # Auth guard
│   │   └── seller-inner.tsx      # Dashboard UI
│   ├── sell/apply/               # Public seller application form
│   │   └── page.tsx
│   └── admin/applications/       # Admin review dashboard
│       └── page.tsx
├── components/
│   ├── Navbar.tsx                # Navigation with theme toggle
│   └── ui/                       # UI components
├── lib/
│   ├── api.ts                    # API client
│   ├── cart.ts                   # Cart state management
│   └── auth.ts                   # NextAuth configuration
├── backend/
│   └── src/
│       └── modules/
│           ├── products/         # Product module + seller endpoints
│           ├── cart/             # Cart module
│           ├── orders/           # Orders module
│           ├── payments/         # Payments module
│           ├── payouts/          # Payouts & commission module
│           ├── fulfillment/      # Fulfillment & shipping tracking
│           └── seller-applications/ # Seller onboarding & review
├── CART_MIGRATION.md             # Cart architecture guide
├── PAYMENT_INTEGRATION.md        # Payment integration guide
├── SELLER_PORTAL.md              # Seller portal guide
├── PAYOUTS_COMMISSION.md         # Commission & payouts guide
├── COMMISSION_PAYOUTS_SUMMARY.md # Payouts quick summary
├── FULFILLMENT_TRACKING.md       # Fulfillment & shipping tracking guide
└── INTEGRATION_COMPLETE.md       # Complete integration summary
```

---

## 🔌 API Endpoints

### Public Endpoints

```
GET    /products           - List all products
GET    /products/:id       - Get product details
GET    /cart               - Get or create cart
POST   /cart/add           - Add item to cart
DELETE /cart/remove        - Remove item from cart
DELETE /cart/clear         - Clear cart
POST   /orders/create      - Create order from cart
```

### Payment Endpoints

```
POST   /payments/intent    - Create payment intent
POST   /payments/webhook   - PSP webhook handler
GET    /payments/:orderId  - Get payment status
```

### Seller Endpoints

```
GET    /seller/products                     - List seller's products
POST   /seller/products                     - Create product
PATCH  /seller/products/:id                 - Update product
PATCH  /seller/products/:id/inventory       - Update inventory
```

### Payout Endpoints

```
# Seller endpoints
GET    /payouts/seller/pending              - Get pending earnings summary
GET    /payouts/seller/all                  - Get all earnings history
GET    /payouts/seller/csv                  - Download CSV export

# Admin endpoints
POST   /payouts/admin/mark-paid             - Mark items as paid out
GET    /payouts/admin/summary               - Get payout summary for all sellers
```

### Fulfillment Endpoints

```
# Buyer endpoints
GET    /fulfillment/tracking/:orderId       - Get order tracking status

# Seller endpoints
GET    /fulfillment/seller/open             - Get pending fulfillment queue
GET    /fulfillment/seller/stats            - Get fulfillment statistics
PATCH  /fulfillment/seller/ship/:itemId     - Mark item as shipped
PATCH  /fulfillment/seller/deliver/:itemId  - Mark item as delivered
PATCH  /fulfillment/seller/issue/:itemId    - Flag item for issue resolution
```

### Seller Application Endpoints

```
# Buyer endpoints
POST   /seller-applications/apply           - Submit seller application
GET    /seller-applications/mine            - Check application status

# Admin endpoints
GET    /seller-applications/pending         - Get pending applications
PATCH  /seller-applications/:id/approve     - Approve application (promotes to SELLER)
PATCH  /seller-applications/:id/reject      - Reject application
```

---

## 🎨 Tech Stack

**Frontend:**
- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- NextAuth.js

**Backend:**
- NestJS
- Prisma ORM
- PostgreSQL
- TypeScript
- Class Validator

**Integrations:**
- Flutterwave (PSP)
- Paystack (PSP)
- Stripe (PSP)
- Redis (sessions)

---

## 🔐 Authentication

Uses NextAuth.js with session-based authentication.

**Demo Accounts:**
- buyer@sokonova.dev / buyer123
- seller@sokonova.dev / seller123
- admin@sokonova.dev / admin123

**Routes:**
- `/auth/login` — Sign in
- `/auth/signup` — Register
- `/seller` — Seller dashboard (requires auth)

---

## 💳 Payment Integration

### Supported Providers
- **Flutterwave** (African markets)
- **Paystack** (African markets)
- **Stripe** (Global)

### Payment Flow
1. Customer selects payment provider at checkout
2. Backend creates payment intent and stores reference
3. Customer redirected to PSP checkout (in production)
4. PSP sends webhook on success/failure
5. Order status updated automatically

### Testing Webhooks

Simulate successful payment:
```bash
curl -X POST http://localhost:4000/payments/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "externalRef": "YOUR_PAYMENT_REF",
    "status": "SUCCEEDED"
  }'
```

---

## 🧪 Testing

### Test the Complete Flow

1. **Browse Products:** Visit `/products`
2. **Add to Cart:** Click product, add to cart
3. **View Cart:** Go to `/cart`
4. **Checkout:** Go to `/checkout`, select payment provider
5. **Seller Dashboard:** Go to `/seller` (requires login)
6. **Create Product:** Use "New Product" button
7. **Manage Inventory:** Update quantities inline

### API Testing

See [INTEGRATION_COMPLETE.md](INTEGRATION_COMPLETE.md) for cURL examples.

---

## 🚧 Production Checklist

Before deploying to production:

- [ ] Add JWT authentication guards to backend
- [ ] Implement role-based access control (RBAC)
- [ ] Verify PSP webhook signatures
- [ ] Add User role field to Prisma schema
- [ ] Implement image upload (Cloudinary/AWS S3)
- [ ] Add soft delete for products
- [ ] Create "Become a Seller" workflow
- [ ] Set up error monitoring (Sentry)
- [ ] Configure CORS for production domains
- [ ] Set up SSL certificates
- [ ] Add rate limiting
- [ ] Implement caching strategy

See individual documentation files for detailed implementation guides.

---

## 📊 Database Schema

### Core Models

**User** (NextAuth)
```prisma
model User {
  id       String   @id @default(cuid())
  email    String   @unique
  name     String?
  // TODO: Add role field (BUYER/SELLER/ADMIN)
  carts    Cart[]
  orders   Order[]
  products Product[] @relation("SellerProducts")
}
```

**Product**
```prisma
model Product {
  id          String      @id @default(cuid())
  sellerId    String
  seller      User        @relation("SellerProducts", fields: [sellerId], references: [id])
  title       String
  description String
  price       Decimal     @db.Decimal(12,2)
  currency    String      @default("USD")
  imageUrl    String?
  inventory   Inventory?
  createdAt   DateTime    @default(now())
}
```

**Order**
```prisma
model Order {
  id          String      @id @default(cuid())
  userId      String
  total       Decimal     @db.Decimal(12,2)
  status      OrderStatus @default(PENDING)
  payment     Payment?
  items       OrderItem[]
  createdAt   DateTime    @default(now())
}

enum OrderStatus {
  PENDING
  PAID
  SHIPPED
  DELIVERED
  CANCELLED
}
```

**Payment**
```prisma
model Payment {
  id          String        @id @default(cuid())
  orderId     String        @unique
  provider    String        // "flutterwave" | "paystack" | "stripe"
  externalRef String?       // PSP transaction reference
  amount      Decimal       @db.Decimal(12,2)
  status      PaymentStatus @default(INITIATED)
  createdAt   DateTime      @default(now())
}

enum PaymentStatus {
  INITIATED
  SUCCEEDED
  FAILED
}
```

---

## 🎯 Next Steps

### Immediate
1. Add role field to User model
2. Implement JWT authentication guards
3. Test payment flow with real PSP credentials
4. Deploy to staging environment

### Future Enhancements
- Seller analytics dashboard (revenue charts, trends)
- **Automated payouts** (Stripe Connect, Flutterwave)
- Dynamic commission rates (tiered, category-based)
- Product variations (size, color, etc.)
- Bulk operations (CSV import/export)
- Customer reviews & ratings
- Messaging system (buyer ↔ seller)
- Admin panel
- Tax management (1099-K, VAT)

---

## 📖 Documentation

| Document | Purpose |
|----------|---------|
| [INTEGRATION_COMPLETE.md](INTEGRATION_COMPLETE.md) | Complete integration summary |
| [CART_MIGRATION.md](CART_MIGRATION.md) | Cart architecture & migration guide |
| [PAYMENT_INTEGRATION.md](PAYMENT_INTEGRATION.md) | Payment flow & PSP integration |
| [SELLER_PORTAL.md](SELLER_PORTAL.md) | Seller portal complete guide |
| [PAYOUTS_COMMISSION.md](PAYOUTS_COMMISSION.md) | Commission & payouts system guide |
| [COMMISSION_PAYOUTS_SUMMARY.md](COMMISSION_PAYOUTS_SUMMARY.md) | Payouts quick reference |
| [FULFILLMENT_TRACKING.md](FULFILLMENT_TRACKING.md) | Fulfillment & shipping tracking guide |
| [SETUP_FULFILLMENT.md](SETUP_FULFILLMENT.md) | Fulfillment setup & testing guide |
| [FULFILLMENT_COMPLETE.md](FULFILLMENT_COMPLETE.md) | Fulfillment implementation summary |
| [FULFILLMENT_QUICKSTART.md](FULFILLMENT_QUICKSTART.md) | Fulfillment 3-minute quick start |
| [SELLER_ONBOARDING.md](SELLER_ONBOARDING.md) | Seller onboarding & application review guide |
| [SETUP_SELLER_ONBOARDING.md](SETUP_SELLER_ONBOARDING.md) | Seller onboarding setup & testing |
| [QUICK_REFERENCE.md](QUICK_REFERENCE.md) | Quick commands & testing guide |
| [PROJECT_STATUS.md](PROJECT_STATUS.md) | Overall project status |

---

## 🤝 Contributing

Contributions welcome! Key areas:
- Authentication improvements (OAuth, 2FA)
- Payment provider integrations
- UI/UX enhancements
- Performance optimization
- Testing (Jest, Playwright)

### Toast Copy & Severity Guide
- success: confirms a completed action; short, past-tense sentence; no exclamation.
- info: neutral status or confirmation when no action is required; keep it brief.
- warning: validation or missing input the user can fix; instructive, not alarming.
- error: system or network failure; state what failed and suggest retry when possible.
- style: sentence case, period at the end, avoid jargon, keep to one line.

### Inline Error Copy Guide
- scope: show inline errors for form fields or modals tied to a specific action.
- wording: state what is wrong and how to fix it; avoid blame.
- tone: neutral, brief, sentence case with a period.
- length: one sentence; prefer "Please" only when giving a clear next step.
- consistency: use the same term as the field label (e.g., "Phone number").

---

## 📄 License

[Your License Here]

---

## 🙏 Acknowledgments

Built with Next.js, NestJS, Prisma, PostgreSQL, and TypeScript.

---

**Status:** ✅ Production-Ready Marketplace Platform | 🚀 Ready for Pilot Launch

**Last Updated:** 2026-01-14

**Latest Features:**
- 📱 React Native Mobile App (Expo)
- 🔔 WebSocket Real-time Notifications
- 📊 Enhanced Seller Analytics Dashboard
- 🔍 Search Suggestions with Recent History
- 📷 S3/Cloudflare R2 Image Uploads

---

## 📱 Mobile App (React Native)

A cross-platform mobile app built with Expo and TypeScript.

**Location:** `sokonova-mobile/`

### Tech Stack
- Expo SDK 54 with TypeScript
- expo-router (file-based routing)
- React Query for data fetching
- Cross-platform storage (localStorage/SecureStore)

### Run Mobile App
```bash
cd sokonova-mobile
npm install
npm start
# Scan QR code with Expo Go app
```

### Screens
| Screen | Description |
|--------|-------------|
| Home | Featured products, categories |
| Discover | Search, filters, product grid |
| Cart | Shopping cart, checkout |
| Account | Profile, settings, seller menu |
| Login | Authentication |

---

## 🔔 WebSocket Real-time Notifications

Real-time push notifications via WebSocket.

### Backend Gateway
```typescript
// notifications.gateway.ts
- JWT authentication on connect
- Room-based per-user subscriptions
- Heartbeat ping/pong for connection health
- Auto-emit on notification creation
```

### Event Types
| Event | Description |
|-------|-------------|
| `order:created` | New order placed |
| `order:updated` | Order status changed |
| `payment:success` | Payment completed |
| `notification:new` | New notification |
| `chat:message` | Chat message received |
| `product:sold` | Seller product sold |

### Frontend Usage
```typescript
import { websocketService, WS_EVENTS } from './websocketService';

websocketService.connect(token);
websocketService.subscribe(WS_EVENTS.ORDER_CREATED, (data) => {
  console.log('New order:', data);
});
```

---

## 📷 S3/Cloudflare R2 Image Uploads

Product images stored in S3-compatible storage.

### Backend Service
```typescript
// upload.service.ts
- S3-compatible API (AWS S3, Cloudflare R2, DigitalOcean Spaces)
- Presigned URLs for direct browser uploads
- Automatic public URL generation
```

### Environment Variables
```env
S3_ENDPOINT=https://xxx.r2.cloudflarestorage.com
S3_ACCESS_KEY_ID=your_access_key
S3_SECRET_ACCESS_KEY=your_secret_key
S3_BUCKET_NAME=sokonova-uploads
S3_PUBLIC_URL=https://pub-xxx.r2.dev
S3_REGION=auto
```

### API Endpoints
```
POST   /upload/presigned-url      - Get presigned URL for upload
POST   /upload/product-image      - Upload product image (multipart)
DELETE /upload/:key               - Delete uploaded file
```

---

## 📊 Enhanced Seller Analytics

Comprehensive analytics dashboard for sellers.

### Features
- **Profitability Metrics** - Revenue, fees, net profit
- **Inventory Insights** - Stock levels, velocity, risk analysis
- **Buyer Segmentation** - Customer cohorts, demographics
- **Stockout Predictions** - AI-powered inventory alerts

### API Endpoints
```
GET /analytics/seller/:id/profitability      - Revenue & fees breakdown
GET /analytics/seller/:id/inventory-risk     - Low stock, overstock alerts
GET /analytics/seller/:id/stockout-predictions - Stockout forecasts
GET /analytics/seller/:id/inventory-velocity - Fast/slow moving items
GET /analytics/seller/:id/buyer-segments     - Customer demographics
GET /analytics/seller/:id/top-products       - Best selling products
```

---

## 🔍 Search Improvements

Enhanced product discovery with suggestions.

### Backend
```
GET /discovery/suggestions?q=query   - Product, category, seller suggestions
GET /discovery/products-search       - Full-text product search
```

### Frontend Features
- Real-time search suggestions
- Recent search history (localStorage)
- Category and seller suggestions

---

## 🛠️ Environment Variables

### Backend (.env)
```env
# Database
DATABASE_URL="postgresql://..."

# Authentication
JWT_SECRET=your_jwt_secret

# Payments
PAYSTACK_SECRET_KEY=sk_test_xxx
FLUTTERWAVE_SECRET_KEY=FLWSECK_TEST-xxx

# Email
SENDGRID_API_KEY=SG.xxx
SENDGRID_FROM_EMAIL=noreply@sokonova.com

# Storage
S3_ENDPOINT=https://xxx.r2.cloudflarestorage.com
S3_ACCESS_KEY_ID=xxx
S3_SECRET_ACCESS_KEY=xxx
S3_BUCKET_NAME=sokonova-uploads

# Monitoring
SENTRY_DSN=https://xxx@sentry.io/xxx
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:4001
VITE_WS_URL=ws://localhost:4001
```

### Mobile (.env)
```env
EXPO_PUBLIC_API_URL=https://sokonova-backend-production.up.railway.app
```

---

## 🚀 Deployment

### Railway (Production)
- Backend: Auto-deploys from `main` branch
- Frontend: Vite build with static hosting
- Database: PostgreSQL addon

### Run Locally
```bash
# Backend
cd backend && npm run start:dev

# Frontend
cd sokonova-frontend && npm run dev

# Mobile
cd sokonova-mobile && npm start
```

---

## 📄 License

[Your License Here]

---

## 🙏 Acknowledgments

Built with Next.js, NestJS, Prisma, PostgreSQL, React Native (Expo), and TypeScript.

