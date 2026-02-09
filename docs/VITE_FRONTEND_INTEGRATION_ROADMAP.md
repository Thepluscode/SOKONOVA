# Vite Frontend Integration Roadmap

## Decision: Using sokonova-frontend (Vite/React) as Primary Frontend

You've chosen the Vite/React frontend as your primary application. This is the right choice because:

✅ **67 pages** vs 40 in Next.js
✅ **More complete feature set** - Wishlist, Social, Reviews, Services, etc.
✅ **16 comprehensive service modules** with well-structured API integration
✅ **Modern development experience** - Fast HMR, better DX
✅ **Complete UI components** - 48 feature components ready to use

---

## Critical Backend Work Required

Based on your Vite frontend's expectations, here's what needs to be built in the backend:

---

## Phase 1: Critical Fixes (Days 1-3) 🔴

### Task 1: Fix API URL Configuration (5 minutes)
**File**: `sokonova-frontend/src/lib/api.ts`

**Change**:
```typescript
// BEFORE
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4001';

// AFTER
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
```

**Also update** `sokonova-frontend/.env`:
```env
VITE_API_URL=http://localhost:4000
```

---

### Task 2: Create Wishlist Module (Day 1)
**Priority**: CRITICAL - Wishlist is completely non-functional without this

#### 2.1 Add Database Schema
**File**: `backend/prisma/schema.prisma`

```prisma
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
  @@map("wishlist_items")
}

// Add to User model
model User {
  // ... existing fields
  wishlistItems WishlistItem[]
}

// Add to Product model
model Product {
  // ... existing fields
  wishlistItems WishlistItem[]
}
```

**Run migration**:
```bash
cd backend
npx prisma migrate dev --name add_wishlist
npx prisma generate
```

#### 2.2 Create Wishlist Module Files

**Create**: `backend/src/modules/wishlist/wishlist.module.ts`
```typescript
import { Module } from '@nestjs/common';
import { WishlistController } from './wishlist.controller';
import { WishlistService } from './wishlist.service';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [WishlistController],
  providers: [WishlistService, PrismaService],
  exports: [WishlistService],
})
export class WishlistModule {}
```

**Create**: `backend/src/modules/wishlist/wishlist.controller.ts`
```typescript
import { Controller, Get, Post, Delete, Param, Body, Query } from '@nestjs/common';
import { WishlistService } from './wishlist.service';

@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  // GET /wishlist/user/:userId
  @Get('user/:userId')
  async getUserWishlist(@Param('userId') userId: string) {
    return this.wishlistService.getWishlistItems(userId);
  }

  // POST /wishlist
  @Post()
  async addToWishlist(@Body() body: { userId: string; productId: string }) {
    return this.wishlistService.addItem(body.userId, body.productId);
  }

  // DELETE /wishlist/:itemId
  @Delete(':itemId')
  async removeFromWishlist(@Param('itemId') itemId: string) {
    return this.wishlistService.removeItem(itemId);
  }

  // DELETE /wishlist/user/:userId/product/:productId
  @Delete('user/:userId/product/:productId')
  async removeByProduct(
    @Param('userId') userId: string,
    @Param('productId') productId: string,
  ) {
    return this.wishlistService.removeByProduct(userId, productId);
  }

  // DELETE /wishlist/user/:userId/clear
  @Delete('user/:userId/clear')
  async clearWishlist(@Param('userId') userId: string) {
    return this.wishlistService.clearAll(userId);
  }

  // GET /wishlist/user/:userId/check/:productId
  @Get('user/:userId/check/:productId')
  async checkInWishlist(
    @Param('userId') userId: string,
    @Param('productId') productId: string,
  ) {
    const inWishlist = await this.wishlistService.isInWishlist(userId, productId);
    return { inWishlist };
  }
}
```

**Create**: `backend/src/modules/wishlist/wishlist.service.ts`
```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class WishlistService {
  constructor(private prisma: PrismaService) {}

  async getWishlistItems(userId: string) {
    return this.prisma.wishlistItem.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            inventory: true,
            seller: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: { addedAt: 'desc' },
    });
  }

  async addItem(userId: string, productId: string) {
    // Check if already exists
    const existing = await this.prisma.wishlistItem.findUnique({
      where: {
        userId_productId: { userId, productId },
      },
    });

    if (existing) {
      return existing;
    }

    return this.prisma.wishlistItem.create({
      data: { userId, productId },
      include: {
        product: true,
      },
    });
  }

  async removeItem(itemId: string) {
    try {
      await this.prisma.wishlistItem.delete({
        where: { id: itemId },
      });
      return { success: true };
    } catch (error) {
      throw new NotFoundException('Wishlist item not found');
    }
  }

  async removeByProduct(userId: string, productId: string) {
    try {
      await this.prisma.wishlistItem.delete({
        where: {
          userId_productId: { userId, productId },
        },
      });
      return { success: true };
    } catch (error) {
      throw new NotFoundException('Wishlist item not found');
    }
  }

  async clearAll(userId: string) {
    await this.prisma.wishlistItem.deleteMany({
      where: { userId },
    });
    return { success: true };
  }

  async isInWishlist(userId: string, productId: string): Promise<boolean> {
    const item = await this.prisma.wishlistItem.findUnique({
      where: {
        userId_productId: { userId, productId },
      },
    });
    return !!item;
  }
}
```

#### 2.3 Register Module
**File**: `backend/src/modules/app.module.ts`

```typescript
import { WishlistModule } from './wishlist/wishlist.module';

@Module({
  imports: [
    // ... existing modules
    WishlistModule,
  ],
})
```

---

### Task 3: Add Missing Orders Endpoint (15 minutes)

**File**: `backend/src/modules/orders/orders.controller.ts`

**Add**:
```typescript
@Get(':id')
async getOrderById(@Param('id') orderId: string) {
  return this.ordersService.findById(orderId);
}
```

**File**: `backend/src/modules/orders/orders.service.ts`

**Add**:
```typescript
async findById(orderId: string) {
  const order = await this.prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: {
          product: {
            include: {
              inventory: true,
            },
          },
          seller: {
            select: {
              id: true,
              name: true,
              email: true,
              shopName: true,
            },
          },
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

  if (!order) {
    throw new NotFoundException(`Order ${orderId} not found`);
  }

  return order;
}
```

---

### Task 4: Fix Storefront Routes (30 minutes)

**File**: `backend/src/modules/storefront/storefront.controller.ts`

**Replace**:
```typescript
import { Controller, Get, Post, Delete, Param, Query } from '@nestjs/common';
import { StorefrontService } from './storefront.service';

@Controller('storefront')
export class StorefrontController {
  constructor(private readonly sf: StorefrontService) {}

  // GET /storefront/:handle (Changed from /storefront/handle/:handle)
  @Get(':handle')
  getStorefrontByHandle(@Param('handle') handle: string) {
    return this.sf.getSellerByHandle(handle);
  }

  // GET /storefront/sellers (NEW)
  @Get('sellers')
  listSellers(
    @Query('category') category?: string,
    @Query('location') location?: string,
    @Query('search') search?: string,
  ) {
    return this.sf.listSellers({ category, location, search });
  }

  // GET /storefront/seller/:id (NEW)
  @Get('seller/:id')
  getSellerById(@Param('id') id: string) {
    return this.sf.getSellerById(id);
  }

  // GET /storefront/:handle/products (NEW)
  @Get(':handle/products')
  getSellerProducts(
    @Param('handle') handle: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('category') category?: string,
  ) {
    return this.sf.getSellerProducts(handle, {
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 20,
      category,
    });
  }

  // GET /storefront/:handle/reviews (NEW)
  @Get(':handle/reviews')
  getSellerReviews(
    @Param('handle') handle: string,
    @Query('page') page?: string,
  ) {
    return this.sf.getSellerReviews(handle, page ? parseInt(page) : 1);
  }

  // POST /storefront/:handle/follow (NEW)
  @Post(':handle/follow')
  followSeller(@Param('handle') handle: string, @Body() body: { userId: string }) {
    return this.sf.followSeller(handle, body.userId);
  }

  // DELETE /storefront/:handle/follow (NEW)
  @Delete(':handle/follow')
  unfollowSeller(@Param('handle') handle: string, @Query('userId') userId: string) {
    return this.sf.unfollowSeller(handle, userId);
  }

  // GET /storefront/featured
  @Get('featured')
  getFeaturedSellers(@Query('limit') limit?: string) {
    const limitNum = limit ? parseInt(limit, 10) : 10;
    return this.sf.getFeaturedSellers(limitNum);
  }
}
```

**Note**: You'll need to implement these methods in `StorefrontService`

---

## Phase 2: Medium Priority (Days 4-7) 🟡

### Task 5: Enhance Reviews Module (Day 4)

**File**: `backend/src/modules/reviews/reviews.controller.ts`

**Add all missing endpoints**:
```typescript
import { Controller, Get, Post, Patch, Delete, Param, Body, Query } from '@nestjs/common';
import { ReviewsService } from './reviews.service';

@Controller('reviews')
export class ReviewsController {
  constructor(private reviews: ReviewsService) {}

  // GET /reviews/product/:productId (NEW)
  @Get('product/:productId')
  async getProductReviews(@Param('productId') productId: string) {
    return this.reviews.getProductReviews(productId);
  }

  // GET /reviews/product/:productId/summary (NEW)
  @Get('product/:productId/summary')
  async getReviewSummary(@Param('productId') productId: string) {
    return this.reviews.getReviewSummary(productId);
  }

  // POST /reviews (NEW - alternative to /reviews/create)
  @Post()
  async createReview(@Body() body: any) {
    return this.reviews.createReview(body);
  }

  // Keep existing POST /reviews/create for backward compatibility
  @Post('create')
  async create(@Body() body: any) {
    return this.reviews.createReview(body);
  }

  // PATCH /reviews/:id (NEW)
  @Patch(':id')
  async updateReview(@Param('id') id: string, @Body() body: any) {
    return this.reviews.updateReview(id, body);
  }

  // DELETE /reviews/:id (NEW)
  @Delete(':id')
  async deleteReview(@Param('id') id: string) {
    return this.reviews.deleteReview(id);
  }

  // POST /reviews/:id/helpful (NEW)
  @Post(':id/helpful')
  async markHelpful(@Param('id') id: string, @Body() body: { userId: string }) {
    return this.reviews.markHelpful(id, body.userId);
  }

  // GET /reviews/user/:userId (NEW)
  @Get('user/:userId')
  async getUserReviews(@Param('userId') userId: string) {
    return this.reviews.getUserReviews(userId);
  }

  // GET /reviews/pending (NEW)
  @Get('pending')
  async getPendingReviews() {
    return this.reviews.getPendingReviews();
  }

  // GET /reviews/seller/:handle (EXISTING)
  @Get('seller/:handle')
  async listForSeller(@Param('handle') handle: string) {
    return this.reviews.listForSellerHandle(handle);
  }

  // PATCH /reviews/:id/hide (EXISTING - Admin)
  @Patch(':id/hide')
  async hide(@Param('id') reviewId: string, @Body() body: any) {
    return this.reviews.hideReview(reviewId, body);
  }
}
```

**Add ReviewHelpful to schema**:
```prisma
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
  @@map("review_helpful")
}

// Add to Review model
model Review {
  // ... existing fields
  helpfulMarks ReviewHelpful[]
}
```

---

### Task 6: Add User /me Endpoints (Day 5)

**Add Address model first**:
```prisma
model Address {
  id         String   @id @default(cuid())
  userId     String
  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)
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
  @@map("addresses")
}

// Add to User model
model User {
  // ... existing fields
  addresses Address[]
}
```

**File**: `backend/src/modules/users/users.controller.ts`

**Add all /me endpoints**:
```typescript
import { Controller, Get, Patch, Post, Delete, Param, Body, Req } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  // GET /users/me (NEW)
  @Get('me')
  async getCurrentUser(@Req() req: any) {
    const userId = req.user?.id; // Extract from JWT
    return this.users.findById(userId);
  }

  // PATCH /users/me (NEW)
  @Patch('me')
  async updateCurrentUser(@Req() req: any, @Body() body: any) {
    const userId = req.user?.id;
    return this.users.updateProfile(userId, body);
  }

  // POST /users/me/password (NEW)
  @Post('me/password')
  async updatePassword(
    @Req() req: any,
    @Body() body: { currentPassword: string; newPassword: string },
  ) {
    const userId = req.user?.id;
    return this.users.updatePassword(userId, body.currentPassword, body.newPassword);
  }

  // GET /users/me/addresses (NEW)
  @Get('me/addresses')
  async getAddresses(@Req() req: any) {
    const userId = req.user?.id;
    return this.users.getAddresses(userId);
  }

  // POST /users/me/addresses (NEW)
  @Post('me/addresses')
  async addAddress(@Req() req: any, @Body() body: any) {
    const userId = req.user?.id;
    return this.users.addAddress(userId, body);
  }

  // PATCH /users/me/addresses/:addressId (NEW)
  @Patch('me/addresses/:addressId')
  async updateAddress(
    @Req() req: any,
    @Param('addressId') addressId: string,
    @Body() body: any,
  ) {
    const userId = req.user?.id;
    return this.users.updateAddress(userId, addressId, body);
  }

  // DELETE /users/me/addresses/:addressId (NEW)
  @Delete('me/addresses/:addressId')
  async deleteAddress(@Req() req: any, @Param('addressId') addressId: string) {
    const userId = req.user?.id;
    return this.users.deleteAddress(userId, addressId);
  }

  // GET /users/me/notifications (NEW)
  @Get('me/notifications')
  async getNotificationSettings(@Req() req: any) {
    const userId = req.user?.id;
    return this.users.getNotificationPreferences(userId);
  }

  // PATCH /users/me/notifications (NEW)
  @Patch('me/notifications')
  async updateNotificationSettings(@Req() req: any, @Body() body: any) {
    const userId = req.user?.id;
    return this.users.updateNotificationPreferences(userId, body);
  }

  // POST /users/me/delete (NEW)
  @Post('me/delete')
  async deleteAccount(@Req() req: any, @Body() body: { password: string }) {
    const userId = req.user?.id;
    return this.users.deleteAccount(userId, body.password);
  }

  // EXISTING endpoints
  @Get(':id')
  async getUser(@Param('id') id: string) {
    return this.users.findById(id);
  }

  @Patch(':id/profile')
  async updateProfile(@Param('id') id: string, @Body() body: any) {
    return this.users.updateProfile(id, body);
  }

  @Patch(':id/storefront')
  async updateStorefront(@Param('id') id: string, @Body() body: any) {
    return this.users.updateStorefront(id, body);
  }

  @Get(':id/notification-preferences')
  async getPreferences(@Param('id') id: string) {
    return this.users.getNotificationPreferences(id);
  }

  @Patch(':id/notification-preferences')
  async updatePreferences(@Param('id') id: string, @Body() body: any) {
    return this.users.updateNotificationPreferences(id, body);
  }
}
```

---

## Phase 3: Testing & Validation (Days 8-10) ✅

### Task 7: Test All Features

**Create**: `VITE_INTEGRATION_TEST_CHECKLIST.md`

```markdown
# Vite Frontend Integration Test Checklist

## Authentication
- [ ] Sign up new user
- [ ] Sign in existing user
- [ ] JWT token stored correctly
- [ ] Auto-redirect after login
- [ ] Logout clears token

## Products
- [ ] Browse products on homepage
- [ ] Product search works
- [ ] Filter by category
- [ ] View product details
- [ ] Product images load

## Wishlist ⭐ NEW
- [ ] Add product to wishlist
- [ ] View wishlist page
- [ ] Remove item from wishlist
- [ ] Clear all wishlist items
- [ ] Wishlist persists after refresh
- [ ] Check if product in wishlist (heart icon)

## Cart
- [ ] Add product to cart
- [ ] Update quantity
- [ ] Remove item
- [ ] Cart total calculates correctly
- [ ] Anonymous cart works

## Orders ⭐ NEW
- [ ] Create order
- [ ] View order history
- [ ] View single order detail (new endpoint)
- [ ] Order status updates
- [ ] Track shipment

## Reviews ⭐ NEW
- [ ] View product reviews
- [ ] Leave review after purchase
- [ ] Edit own review
- [ ] Delete own review
- [ ] Mark review helpful
- [ ] View review summary/stats
- [ ] View own reviews in profile

## User Profile ⭐ NEW
- [ ] View profile (/users/me)
- [ ] Update profile info
- [ ] Change password
- [ ] Add shipping address
- [ ] Edit address
- [ ] Delete address
- [ ] Set default address
- [ ] Update notification preferences
- [ ] Delete account

## Storefront ⭐ FIXED
- [ ] View seller storefront by handle
- [ ] Browse seller products
- [ ] View seller reviews
- [ ] Follow seller
- [ ] Unfollow seller
- [ ] View featured sellers

## Seller Features
- [ ] Apply to become seller
- [ ] Create product
- [ ] Edit product
- [ ] Update inventory
- [ ] View analytics
- [ ] Manage orders
- [ ] View payouts

## Admin Features
- [ ] Approve seller applications
- [ ] View platform metrics
- [ ] Manage trust scores
- [ ] View all orders
```

---

## Database Migrations Summary

Run all these migrations in order:

```bash
cd backend

# 1. Add Wishlist
npx prisma migrate dev --name add_wishlist

# 2. Add Address
npx prisma migrate dev --name add_address

# 3. Add Review Helpful
npx prisma migrate dev --name add_review_helpful

# Generate Prisma client
npx prisma generate

# Push to database
npx prisma db push
```

---

## Quick Start Script

**Create**: `start-vite-integration.sh`

```bash
#!/bin/bash

echo "🚀 Starting SokoNova Vite Integration..."

# Start Redis
echo "Starting Redis..."
redis-server &

# Start PostgreSQL (if using Docker)
echo "Starting PostgreSQL..."
docker start sokonova-postgres || docker run --name sokonova-postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:15

# Start Backend
echo "Starting Backend API..."
cd backend
npm run start:dev &
BACKEND_PID=$!

# Wait for backend to be ready
sleep 5

# Start Vite Frontend
echo "Starting Vite Frontend..."
cd ../sokonova-frontend
npm run dev &
VITE_PID=$!

echo "✅ All services started!"
echo "Backend: http://localhost:4000"
echo "Frontend: http://localhost:5173 (or check console)"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for interrupt
wait
```

Make executable:
```bash
chmod +x start-vite-integration.sh
```

---

## Timeline Summary

| Phase | Duration | Tasks |
|-------|----------|-------|
| Phase 1 | 3 days | Fix API URL, Create Wishlist, Add Orders endpoint, Fix Storefront |
| Phase 2 | 4 days | Enhance Reviews, Add User /me endpoints, Add Address management |
| Phase 3 | 3 days | Testing, Bug fixes, Documentation |
| **Total** | **10 days** | **Full integration complete** |

---

## Success Criteria

✅ All 67 Vite pages functional
✅ All 16 service modules connected
✅ Wishlist fully working
✅ Reviews system complete
✅ User profile management working
✅ Storefront pages loading
✅ Orders detail view working
✅ Zero critical errors in console
✅ 100% API endpoint coverage

---

## Next Steps

Would you like me to:

1. **Start implementing immediately** - Begin with Task 1 (Fix API URL)?
2. **Create module scaffolding** - Generate all the wishlist module files?
3. **Fix storefront routes first** - Quick win to get stores working?
4. **Run migration** - Add database schema changes?

Let me know which task to start with!
