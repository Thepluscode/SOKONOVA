# Backend-Frontend Integration Plan for SokoNova

## Executive Summary

This document provides a comprehensive plan to link all backend (NestJS) and frontend (Next.js + Vite/React) features in the SokoNova marketplace project. The analysis reveals:

- **Backend**: 25 NestJS modules with 165+ API endpoints
- **Frontend (Next.js)**: Main marketplace application with Next.js App Router
- **Frontend (Vite)**: `sokonova-frontend` - Comprehensive React SPA with 67 pages and 16 service modules
- **API Architecture**: Domain-specific API modules in `lib/api/` for Next.js app
- **Service Layer**: Complete service layer in `sokonova-frontend/src/lib/services/`

---

## Current Architecture

### Backend (NestJS - Port 4000)
```
backend/
├── src/modules/
│   ├── analytics-seller/        ✅ Advanced seller analytics
│   ├── analytics-rollup/        ✅ Platform-wide analytics
│   ├── api-partner-platform/    ✅ Partner API platform
│   ├── admin-control-tower/     ✅ Admin monitoring
│   ├── cart/                    ✅ Shopping cart
│   ├── chat/                    ✅ AI product Q&A
│   ├── discovery/               ✅ Product discovery
│   ├── disputes/                ✅ Dispute management
│   ├── fulfillment/             ✅ Order fulfillment
│   ├── impact-inclusion/        ✅ Impact metrics
│   ├── notifications/           ✅ Notification system
│   ├── orders/                  ✅ Order management
│   ├── payments/                ✅ Multi-provider payments
│   ├── payouts/                 ✅ Seller payouts
│   ├── products/                ✅ Product catalog
│   ├── product-views/           ✅ View tracking
│   ├── reviews/                 ✅ Review system
│   ├── seller-applications/     ✅ Seller onboarding
│   ├── seller-services/         ✅ Service marketplace
│   ├── social/                  ✅ Social shopping
│   ├── sponsored-placements/    ✅ Advertising
│   ├── storefront/              ⚠️  Partial implementation
│   ├── subscriptions/           ✅ Subscription plans
│   ├── trust/                   ✅ Trust & compliance
│   └── users/                   ✅ User management
```

### Frontend - Next.js (Main App)
```
app/
├── (auth)/                      ✅ Authentication pages
├── account/                     ✅ User account settings
├── admin/                       ✅ Admin dashboard (7 pages)
├── cart/                        ✅ Shopping cart
├── checkout/                    ✅ Checkout flow
├── discover/                    ✅ Discovery pages
├── orders/                      ✅ Order tracking
├── partner/                     ✅ Partner portal
├── products/                    ✅ Product pages
├── sell/                        ✅ Seller application
├── seller/                      ✅ Seller dashboard (4 pages)
├── services/                    ✅ Service marketplace
├── social/                      ✅ Social shopping
├── store/                       ✅ Seller storefronts
└── subscriptions/               ✅ Subscription management

lib/api/                         ✅ 27 domain-specific API modules
```

### Frontend - Vite/React (sokonova-frontend)
```
sokonova-frontend/
├── src/
│   ├── pages/                   ✅ 67 pages
│   ├── components/feature/      ✅ 48 feature components
│   ├── lib/
│   │   ├── api.ts              ✅ Core API client (port 4001)
│   │   ├── services/           ✅ 16 service modules
│   │   └── types.ts            ✅ TypeScript types
│   ├── contexts/               ✅ Auth, Theme contexts
│   ├── hooks/                  ✅ Custom hooks
│   └── i18n/                   ✅ Internationalization
```

---

## Critical Integration Issues

### 🔴 **CRITICAL: Storefront Route Mismatch**

**Problem**: Incompatible route paths between frontend and backend

**Frontend Expectation** (sokonova-frontend):
```typescript
// sokonova-frontend/src/lib/services/storefrontService.ts
GET /storefront/:handle              // Get storefront
GET /storefront/sellers              // List all sellers
GET /storefront/seller/:id           // Get seller by ID
GET /storefront/:handle/products     // Get seller products
GET /storefront/:handle/reviews      // Get seller reviews
POST /storefront/:handle/follow      // Follow seller
DELETE /storefront/:handle/follow    // Unfollow seller
GET /storefront/featured             // Featured sellers ✅
```

**Backend Implementation**:
```typescript
// backend/src/modules/storefront/storefront.controller.ts
@Get('handle/:handle')               // ❌ Should be /:handle
@Get('featured')                     // ✅ Matches
// Missing: /sellers, /seller/:id, /:handle/products, /:handle/reviews, /:handle/follow
```

**Impact**: Storefront pages completely broken

---

### 🔴 **CRITICAL: Missing Wishlist Module**

**Frontend** (sokonova-frontend):
```typescript
// Complete wishlist service with 6 endpoints
GET /wishlist/user/:userId
POST /wishlist
DELETE /wishlist/:itemId
DELETE /wishlist/user/:userId/product/:productId
DELETE /wishlist/user/:userId/clear
GET /wishlist/user/:userId/check/:productId
```

**Backend**: ❌ **NO wishlist module exists**

**Impact**: Wishlist feature non-functional (currently using localStorage fallback)

---

### 🔴 **CRITICAL: Orders Endpoint Missing**

**Frontend Calls**:
```typescript
// sokonova-frontend/src/lib/services/ordersService.ts
GET /orders/:id   // ❌ NOT IMPLEMENTED
```

**Backend Implementation**:
```typescript
// backend/src/modules/orders/orders.controller.ts
GET /orders/user/:userId    // ✅ Exists
POST /orders/create         // ✅ Exists
// Missing: GET /orders/:id
```

**Impact**: Order detail pages fail

---

### 🟡 **MEDIUM: Reviews Endpoint Mismatch**

**Frontend Expectation** (sokonova-frontend):
```typescript
GET /reviews/product/:productId          // ❌ Missing
GET /reviews/product/:productId/summary  // ❌ Missing
POST /reviews                            // ❌ Should be /reviews/create
PATCH /reviews/:id                       // ❌ Missing
DELETE /reviews/:id                      // ❌ Missing
POST /reviews/:id/helpful                // ❌ Missing
GET /reviews/user/:userId                // ❌ Missing
GET /reviews/pending                     // ❌ Missing
```

**Backend Implementation**:
```typescript
POST /reviews/create                     // ✅ Exists
GET /reviews/seller/:handle              // ✅ Exists
PATCH /reviews/:id/hide                  // ⚠️  Admin only
```

**Impact**: Product reviews partially broken

---

### 🟡 **MEDIUM: User Profile Endpoint Mismatch**

**Frontend Expectation** (sokonova-frontend):
```typescript
GET /users/me                // ❌ Missing
PATCH /users/me              // ❌ Missing
POST /users/me/password      // ❌ Missing
GET /users/me/addresses      // ❌ Missing
POST /users/me/addresses     // ❌ Missing
PATCH /users/me/addresses/:id // ❌ Missing
DELETE /users/me/addresses/:id // ❌ Missing
GET /users/me/notifications   // ❌ Missing
PATCH /users/me/notifications // ❌ Missing
POST /users/me/delete         // ❌ Missing
GET /users/:id                // ✅ Exists
```

**Backend Implementation**:
```typescript
GET /users/:id                               // ✅
PATCH /users/:id/profile                     // ✅
PATCH /users/:id/storefront                  // ✅
PATCH /users/:id/notification-preferences    // ✅
GET /users/:id/notification-preferences      // ✅
```

**Impact**: User profile management requires ID-based calls instead of `/me`

---

### 🟡 **MEDIUM: Payment Verification Endpoints**

**Frontend Calls**:
```typescript
GET /payments/verify/paystack/:reference
GET /payments/verify/flutterwave/:transactionId
GET /payments/verify/stripe/:sessionId
GET /payments/user/:userId
```

**Backend**: ⚠️ **Webhook handlers exist, verification endpoints unclear**

**Impact**: Payment confirmation flow may fail

---

### 🟡 **MEDIUM: Social Features Incomplete**

**Frontend Expectation** (sokonova-frontend):
```typescript
GET /social/feed                   // ❌ Unknown
GET /social/trending               // ❌ Unknown
GET /social/suggested              // ❌ Unknown
POST /social/posts                 // ❌ Unknown
POST /social/posts/:id/like        // ❌ Unknown
POST /social/follow/:userId        // ❌ Unknown
GET /social/posts/:id/comments     // ❌ Unknown
POST /social/share                 // ❌ Unknown
```

**Backend Implementation**:
```typescript
GET /social/stories/community                // ✅ Exists
POST /social/stories                         // ✅ Exists
GET /social/influencers/storefronts          // ✅ Exists
GET /social/influencers/:handle/storefront   // ✅ Exists
```

**Impact**: Social feed vs. community stories feature mismatch

---

## Integration Priorities

### Phase 1: Critical Fixes (Week 1) 🔴

#### 1.1 Fix Storefront Routes
```bash
File: backend/src/modules/storefront/storefront.controller.ts
```

**Changes Needed**:
```typescript
// BEFORE
@Get('handle/:handle')

// AFTER
@Get(':handle')  // Make this the primary route

// ADD NEW ENDPOINTS
@Get('sellers')  // List all sellers
@Get('seller/:id')  // Get seller by ID
@Get(':handle/products')  // Get seller products
@Get(':handle/reviews')  // Get seller reviews
@Post(':handle/follow')  // Follow seller
@Delete(':handle/follow')  // Unfollow seller
```

**Files to Update**:
- `backend/src/modules/storefront/storefront.controller.ts`
- `backend/src/modules/storefront/storefront.service.ts`

**Testing**:
- Test all storefront pages in both frontends
- Verify `/store/[handle]` page works
- Check featured sellers strip

---

#### 1.2 Create Wishlist Module
```bash
Files to Create:
backend/src/modules/wishlist/
├── wishlist.module.ts
├── wishlist.controller.ts
├── wishlist.service.ts
└── dto/
    ├── add-to-wishlist.dto.ts
    └── wishlist-item.dto.ts
```

**Required Endpoints**:
```typescript
GET    /wishlist/user/:userId                      // Get wishlist
POST   /wishlist                                   // Add item
DELETE /wishlist/:itemId                           // Remove by ID
DELETE /wishlist/user/:userId/product/:productId   // Remove by product
DELETE /wishlist/user/:userId/clear                // Clear all
GET    /wishlist/user/:userId/check/:productId     // Check if in wishlist
```

**Database Schema**:
```prisma
model WishlistItem {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  productId String
  product   Product  @relation(fields: [productId], references: [id])
  addedAt   DateTime @default(now())

  @@unique([userId, productId])
  @@index([userId])
}
```

**Update App Module**:
```typescript
// backend/src/modules/app.module.ts
import { WishlistModule } from './wishlist/wishlist.module';

@Module({
  imports: [
    // ... existing modules
    WishlistModule,
  ],
})
```

---

#### 1.3 Add Missing Orders Endpoint
```typescript
// backend/src/modules/orders/orders.controller.ts

@Get(':id')
async getOrderById(@Param('id') orderId: string) {
  return this.ordersService.findById(orderId);
}
```

**Service Method**:
```typescript
// backend/src/modules/orders/orders.service.ts

async findById(orderId: string) {
  return this.prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: {
          product: true,
          seller: true,
        },
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
}
```

---

### Phase 2: Medium Priority (Week 2) 🟡

#### 2.1 Enhance Reviews Module

**Add Missing Endpoints**:
```typescript
// backend/src/modules/reviews/reviews.controller.ts

@Get('product/:productId')
async getProductReviews(@Param('productId') productId: string) {
  return this.reviews.getProductReviews(productId);
}

@Get('product/:productId/summary')
async getReviewSummary(@Param('productId') productId: string) {
  return this.reviews.getReviewSummary(productId);
}

@Post()  // Instead of /create
async createReview(@Body() dto: CreateReviewDto) {
  return this.reviews.createReview(dto);
}

@Patch(':id')
async updateReview(@Param('id') id: string, @Body() dto: UpdateReviewDto) {
  return this.reviews.updateReview(id, dto);
}

@Delete(':id')
async deleteReview(@Param('id') id: string) {
  return this.reviews.deleteReview(id);
}

@Post(':id/helpful')
async markHelpful(@Param('id') id: string, @Body() body: { userId: string }) {
  return this.reviews.markHelpful(id, body.userId);
}

@Get('user/:userId')
async getUserReviews(@Param('userId') userId: string) {
  return this.reviews.getUserReviews(userId);
}

@Get('pending')
async getPendingReviews() {
  return this.reviews.getPendingReviews();
}
```

---

#### 2.2 Add User Profile Shortcuts

**Add `/me` Convenience Endpoints**:
```typescript
// backend/src/modules/users/users.controller.ts

@Get('me')
async getCurrentUser(@Req() req) {
  // Extract userId from JWT token
  return this.users.findById(req.user.id);
}

@Patch('me')
async updateCurrentUser(@Req() req, @Body() dto: UpdateProfileDto) {
  return this.users.updateProfile(req.user.id, dto);
}

@Post('me/password')
async updatePassword(@Req() req, @Body() dto: UpdatePasswordDto) {
  return this.users.updatePassword(req.user.id, dto);
}

@Get('me/addresses')
async getAddresses(@Req() req) {
  return this.users.getAddresses(req.user.id);
}

@Post('me/addresses')
async addAddress(@Req() req, @Body() dto: AddAddressDto) {
  return this.users.addAddress(req.user.id, dto);
}

@Patch('me/addresses/:addressId')
async updateAddress(@Req() req, @Param('addressId') addressId: string, @Body() dto: UpdateAddressDto) {
  return this.users.updateAddress(req.user.id, addressId, dto);
}

@Delete('me/addresses/:addressId')
async deleteAddress(@Req() req, @Param('addressId') addressId: string) {
  return this.users.deleteAddress(req.user.id, addressId);
}

@Get('me/notifications')
async getNotificationSettings(@Req() req) {
  return this.users.getNotificationPreferences(req.user.id);
}

@Patch('me/notifications')
async updateNotificationSettings(@Req() req, @Body() dto: UpdateNotificationPrefsDto) {
  return this.users.updateNotificationPreferences(req.user.id, dto);
}

@Post('me/delete')
async deleteAccount(@Req() req, @Body() body: { password: string }) {
  return this.users.deleteAccount(req.user.id, body.password);
}
```

**Database Schema for Addresses**:
```prisma
model Address {
  id         String   @id @default(cuid())
  userId     String
  user       User     @relation(fields: [userId], references: [id])
  label      String?  // "Home", "Work", etc.
  fullName   String
  phone      String
  address1   String
  address2   String?
  city       String
  state      String?
  postalCode String
  country    String
  isDefault  Boolean  @default(false)
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  @@index([userId])
}
```

---

#### 2.3 Add Payment Verification Endpoints

```typescript
// backend/src/modules/payments/payments.controller.ts

@Get('verify/paystack/:reference')
async verifyPaystack(@Param('reference') reference: string) {
  return this.payments.verifyPaystackPayment(reference);
}

@Get('verify/flutterwave/:transactionId')
async verifyFlutterwave(@Param('transactionId') transactionId: string) {
  return this.payments.verifyFlutterwavePayment(transactionId);
}

@Get('verify/stripe/:sessionId')
async verifyStripe(@Param('sessionId') sessionId: string) {
  return this.payments.verifyStripePayment(sessionId);
}

@Get('user/:userId')
async getPaymentHistory(@Param('userId') userId: string) {
  return this.payments.getUserPaymentHistory(userId);
}
```

---

### Phase 3: Frontend Alignment (Week 3) 🟢

#### 3.1 Consolidate Frontend Applications

**Decision Point**: Choose primary frontend

**Option A: Keep Next.js App (Recommended)**
- Production-ready with SSR/SSG
- Better SEO
- Deployed and working
- Has proper API integration via `lib/api/`

**Option B: Keep Vite App**
- Faster development
- Better HMR
- Comprehensive feature set
- Modern build tooling

**Recommendation**: **Keep Next.js as primary**, migrate missing features from Vite app

**Migration Tasks**:
1. Audit missing features in Next.js app vs. Vite app
2. Port over missing components from `sokonova-frontend/src/components/feature/`
3. Integrate service modules from `sokonova-frontend/src/lib/services/`
4. Update API calls in Next.js app to use new backend endpoints
5. Add missing pages from Vite app to Next.js app

---

#### 3.2 Standardize API Client

**Current State**:
- Next.js: Uses `lib/api/*.ts` modules (27 files) → Port 4000
- Vite: Uses `lib/services/*.ts` modules (16 files) → Port 4001

**Action**:
1. Standardize on single API base URL (Port 4000)
2. Update Vite app's API URL from 4001 to 4000
3. Merge best patterns from both approaches
4. Create unified TypeScript types

**Update**:
```typescript
// sokonova-frontend/src/lib/api.ts
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';  // Changed from 4001
```

---

#### 3.3 Align Social Features

**Audit Required**:
- Map social/stories backend endpoints to frontend expectations
- Determine if frontend needs updating or backend needs new endpoints
- Consider renaming for consistency

**Backend (Current)**:
```typescript
GET /social/stories/community
POST /social/stories
GET /social/influencers/storefronts
GET /social/influencers/:handle/storefront
```

**Frontend (Expected)**:
```typescript
GET /social/feed
GET /social/trending
POST /social/posts
POST /social/posts/:id/like
```

**Resolution**: Update frontend to use backend's "stories" terminology OR add backend aliases

---

### Phase 4: Testing & Documentation (Week 4) 📋

#### 4.1 Create Integration Tests

**Test Coverage**:
- [ ] E2E tests for critical user flows
- [ ] API endpoint coverage tests
- [ ] Frontend-backend integration tests
- [ ] Payment flow tests
- [ ] Seller onboarding flow tests

**Tools**:
- Backend: Jest + Supertest
- Frontend: Playwright or Cypress
- API: Postman/Newman collections

---

#### 4.2 Generate API Documentation

**Tasks**:
1. Add Swagger/OpenAPI to NestJS backend
2. Generate API documentation from controllers
3. Create endpoint mapping document
4. Document authentication requirements
5. Add request/response examples

**Install Swagger**:
```bash
cd backend
npm install @nestjs/swagger swagger-ui-express
```

**Configure**:
```typescript
// backend/src/main.ts
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

const config = new DocumentBuilder()
  .setTitle('SokoNova API')
  .setDescription('Marketplace API documentation')
  .setVersion('1.0')
  .addBearerAuth()
  .build();

const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api/docs', app, document);
```

**Access**: `http://localhost:4000/api/docs`

---

#### 4.3 Create Developer Guide

**Document**:
1. Architecture overview
2. Setup instructions
3. API endpoint reference
4. Frontend-backend communication patterns
5. Authentication flow
6. Error handling
7. Deployment guide

---

## Feature-by-Feature Integration Status

### ✅ **WORKING** (Confirmed Integration)

| Feature | Backend Module | Next.js App | Vite App | Status |
|---------|---------------|-------------|----------|--------|
| Products | `products/` | ✅ `/products` | ✅ 67 pages | 🟢 Working |
| Cart | `cart/` | ✅ `/cart` | ✅ Service | 🟢 Working |
| Orders | `orders/` | ✅ `/orders` | ✅ Service | 🟡 Partial (missing /:id) |
| Payments | `payments/` | ✅ `/checkout` | ✅ Service | 🟢 Working |
| Notifications | `notifications/` | ✅ Bell + Page | ✅ Service | 🟢 Working |
| Seller Dashboard | `analytics-seller/` | ✅ `/seller` | ✅ Pages | 🟢 Working |
| Discovery | `discovery/` | ✅ `/discover` | ✅ Pages | 🟢 Working |
| Fulfillment | `fulfillment/` | ✅ Tracking | ✅ Service | 🟢 Working |

---

### ⚠️ **PARTIAL** (Needs Work)

| Feature | Backend Module | Next.js App | Vite App | Issue |
|---------|---------------|-------------|----------|-------|
| Storefront | `storefront/` | ✅ `/store` | ✅ Service | 🔴 Route mismatch |
| Reviews | `reviews/` | ⚠️ Limited | ✅ Service | 🟡 Missing endpoints |
| User Profile | `users/` | ✅ `/account` | ✅ Service | 🟡 No /me endpoints |
| Social | `social/` | ✅ `/social` | ✅ Service | 🟡 Feature mismatch |
| Admin | Multiple | ✅ `/admin` | ✅ Pages | 🟡 Some gaps |

---

### ❌ **MISSING** (Not Implemented)

| Feature | Frontend | Backend | Action Required |
|---------|----------|---------|-----------------|
| Wishlist | ✅ Vite app has full service | ❌ No module | 🔴 Create backend module |
| Addresses | ✅ User service expects | ❌ Not in DB schema | 🟡 Add to Prisma schema |
| Saved Searches | ✅ Vite page exists | ❌ No backend | 🟢 Low priority |

---

## Database Schema Updates Required

### Add to Prisma Schema

```prisma
// prisma/schema.prisma

model WishlistItem {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  productId String
  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  addedAt   DateTime @default(now())

  @@unique([userId, productId])
  @@index([userId])
  @@index([productId])
}

model Address {
  id         String   @id @default(cuid())
  userId     String
  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  label      String?
  fullName   String
  phone      String
  address1   String
  address2   String?
  city       String
  state      String?
  postalCode String
  country    String
  isDefault  Boolean  @default(false)
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  @@index([userId])
}

model ReviewHelpful {
  id        String   @id @default(cuid())
  reviewId  String
  review    Review   @relation(fields: [reviewId], references: [id], onDelete: Cascade)
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())

  @@unique([reviewId, userId])
  @@index([reviewId])
  @@index([userId])
}

// Add to existing User model
model User {
  // ... existing fields
  wishlistItems  WishlistItem[]
  addresses      Address[]
  reviewsHelpful ReviewHelpful[]
}

// Add to existing Product model
model Product {
  // ... existing fields
  wishlistItems WishlistItem[]
}

// Add to existing Review model (if exists)
model Review {
  // ... existing fields
  helpfulMarks ReviewHelpful[]
}
```

**Run Migration**:
```bash
cd backend
npx prisma migrate dev --name add_wishlist_addresses_review_helpful
npx prisma generate
```

---

## Implementation Checklist

### Week 1: Critical Fixes 🔴

- [ ] **Fix Storefront Routes**
  - [ ] Update controller route from `handle/:handle` to `:handle`
  - [ ] Add `GET /storefront/sellers`
  - [ ] Add `GET /storefront/seller/:id`
  - [ ] Add `GET /storefront/:handle/products`
  - [ ] Add `GET /storefront/:handle/reviews`
  - [ ] Add `POST /storefront/:handle/follow`
  - [ ] Add `DELETE /storefront/:handle/follow`
  - [ ] Implement service methods
  - [ ] Test all storefront pages

- [ ] **Create Wishlist Module**
  - [ ] Add Prisma schema for WishlistItem
  - [ ] Run migration
  - [ ] Create wishlist module, controller, service
  - [ ] Implement all 6 endpoints
  - [ ] Add to AppModule
  - [ ] Test with frontend

- [ ] **Add Missing Orders Endpoint**
  - [ ] Add `GET /orders/:id` controller method
  - [ ] Implement service method with relations
  - [ ] Test order detail pages

### Week 2: Medium Priority 🟡

- [ ] **Enhance Reviews Module**
  - [ ] Add ReviewHelpful model to schema
  - [ ] Run migration
  - [ ] Add 8 missing review endpoints
  - [ ] Implement service methods
  - [ ] Test product review pages

- [ ] **Add User Profile Shortcuts**
  - [ ] Add Address model to schema
  - [ ] Run migration
  - [ ] Add 10 `/me` endpoints
  - [ ] Implement address CRUD
  - [ ] Implement password change
  - [ ] Implement account deletion
  - [ ] Test profile pages

- [ ] **Add Payment Verification**
  - [ ] Implement Paystack verification
  - [ ] Implement Flutterwave verification
  - [ ] Implement Stripe verification
  - [ ] Add payment history endpoint
  - [ ] Test checkout flow

### Week 3: Frontend Alignment 🟢

- [ ] **Choose Primary Frontend**
  - [ ] Audit features in both apps
  - [ ] Make decision (recommend Next.js)
  - [ ] Create migration plan

- [ ] **Standardize API Client**
  - [ ] Update port from 4001 to 4000
  - [ ] Merge service patterns
  - [ ] Create unified types
  - [ ] Test all API calls

- [ ] **Align Social Features**
  - [ ] Map backend endpoints to frontend
  - [ ] Update frontend OR backend
  - [ ] Test social pages

### Week 4: Testing & Documentation 📋

- [ ] **Integration Tests**
  - [ ] E2E test suite
  - [ ] API coverage tests
  - [ ] Payment flow tests
  - [ ] Seller onboarding tests

- [ ] **API Documentation**
  - [ ] Install Swagger
  - [ ] Add decorators to controllers
  - [ ] Generate OpenAPI spec
  - [ ] Create Postman collection

- [ ] **Developer Guide**
  - [ ] Architecture documentation
  - [ ] Setup guide
  - [ ] API reference
  - [ ] Deployment guide

---

## Testing Strategy

### Unit Tests
```bash
# Backend
cd backend
npm run test

# Frontend
npm run test
```

### Integration Tests
```bash
# E2E tests
npm run test:e2e
```

### Manual Testing Checklist

#### Buyer Flow
- [ ] Browse products
- [ ] Add to wishlist
- [ ] Add to cart
- [ ] Checkout flow
- [ ] Payment (test mode)
- [ ] Order tracking
- [ ] Leave review

#### Seller Flow
- [ ] Apply to sell
- [ ] Admin approval
- [ ] Create product
- [ ] Manage inventory
- [ ] View analytics
- [ ] Mark order shipped
- [ ] Request payout

#### Admin Flow
- [ ] Approve seller applications
- [ ] View platform metrics
- [ ] Manage sponsored placements
- [ ] Review disputes
- [ ] Trust dashboard

---

## Deployment Considerations

### Environment Variables

**Backend (.env)**:
```env
DATABASE_URL=
JWT_SECRET=
PAYSTACK_SECRET_KEY=
FLUTTERWAVE_SECRET_KEY=
STRIPE_SECRET_KEY=
REDIS_URL=
PORT=4000
```

**Next.js (.env.local)**:
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:4000
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
```

**Vite (.env)**:
```env
VITE_API_URL=http://localhost:4000  # Update from 4001
```

### Production URLs

Update all references from localhost to production URLs:
- Backend: `https://api.sokonova.com`
- Frontend: `https://sokonova.com`

---

## Success Metrics

### Technical KPIs
- [ ] 100% API endpoint coverage
- [ ] < 5% error rate on API calls
- [ ] < 200ms average API response time
- [ ] 90%+ test coverage

### Feature Completeness
- [ ] All 67 Vite pages functional
- [ ] All 40+ Next.js pages functional
- [ ] All 25 backend modules integrated
- [ ] Zero critical bugs

### User Experience
- [ ] Smooth checkout flow
- [ ] Working wishlist
- [ ] Functional seller dashboard
- [ ] Real-time notifications
- [ ] Accurate order tracking

---

## Risk Mitigation

### Potential Issues

1. **Breaking Changes**: Route changes may break existing deployments
   - **Mitigation**: Version API, support both old and new routes temporarily

2. **Data Migration**: Schema changes require data migration
   - **Mitigation**: Write migration scripts, test on staging

3. **Performance**: New endpoints may be slow
   - **Mitigation**: Add caching, optimize queries, use Redis

4. **Authentication**: JWT changes may log out users
   - **Mitigation**: Refresh token mechanism, graceful degradation

---

## Next Steps

### Immediate (This Week)
1. Review this plan with team
2. Set up development environment
3. Create feature branches for Phase 1 tasks
4. Begin storefront route fix

### Short-term (Next 2 Weeks)
1. Complete Phase 1 & 2 implementations
2. Daily testing of new endpoints
3. Update frontend to use new endpoints
4. Monitor error logs

### Long-term (Next Month)
1. Complete Phase 3 & 4
2. Deploy to staging
3. Comprehensive QA
4. Production deployment
5. Monitor and iterate

---

## Resources

### Documentation
- NestJS Docs: https://docs.nestjs.com/
- Next.js Docs: https://nextjs.org/docs
- Prisma Docs: https://www.prisma.io/docs
- Swagger NestJS: https://docs.nestjs.com/openapi/introduction

### Tools
- API Testing: Postman, Insomnia
- E2E Testing: Playwright, Cypress
- Monitoring: Sentry, LogRocket
- Performance: Lighthouse, WebPageTest

---

## Conclusion

This comprehensive plan provides a clear roadmap for linking all backend and frontend features in the SokoNova marketplace. By following the phased approach, you can systematically address critical issues first, then enhance features, and finally align and test the complete integration.

**Estimated Timeline**: 4 weeks
**Effort**: 1-2 full-time developers
**Priority**: High - Critical for production readiness

The success of this integration will result in a fully functional, production-ready marketplace with seamless backend-frontend communication across all features.
