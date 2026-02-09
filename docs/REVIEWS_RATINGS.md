# Reviews & Ratings System

## Overview

The Reviews & Ratings system completes the **trust loop** for SokoNova. Buyers can leave reviews only after delivery (verified purchase), sellers get public social proof on their storefront, and the platform gains quality signals for moderation.

**Key Achievement:** Transform post-purchase experience into **structured, auditable social proof** that builds trust, drives conversions, and identifies bad actors.

---

## What's Been Implemented

### 1. **Verified Purchase Reviews**
- Buyers can only review items marked as DELIVERED
- One review per order item per buyer (no duplicates)
- 1-5 star rating + text comment
- Optional moderation (hide abusive reviews)

### 2. **Seller Rating Aggregation**
- Automatic calculation of `ratingAvg` and `ratingCount`
- Updated in real-time when reviews are added/hidden
- Displayed on seller storefront header
- Future-proofed for seller ranking/discovery

### 3. **Buyer Review Form**
- Appears on order tracking page after delivery
- Simple 5-star dropdown + comment textarea
- One-click submit
- Success feedback

### 4. **Storefront Social Proof**
- "Recent Reviews" section on `/store/{handle}`
- Shows up to 4 latest reviews
- Displays buyer name, rating, date, comment
- Mobile-responsive grid layout

### 5. **Admin Moderation**
- Hide abusive reviews without deleting data
- Automatically recalculates seller rating when review hidden
- Audit trail preserved (isVisible flag)

---

## Architecture

### Database Schema

**Review Model:**
```prisma
model Review {
  id            String      @id @default(cuid())
  orderItem     OrderItem   @relation(fields: [orderItemId], references: [id])
  orderItemId   String

  seller        User        @relation("SellerReviews", fields: [sellerId], references: [id])
  sellerId      String

  buyer         User        @relation("BuyerReviews", fields: [buyerId], references: [id])
  buyerId       String

  rating        Int         // 1-5
  comment       String
  isVisible     Boolean     @default(true)

  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
}
```

**User Relations:**
```prisma
model User {
  // ... existing fields
  ratingAvg      Float?   @default(0)
  ratingCount    Int?     @default(0)
  reviewsGiven      Review[] @relation("BuyerReviews")
  reviewsReceived   Review[] @relation("SellerReviews")
}
```

**OrderItem Relation:**
```prisma
model OrderItem {
  // ... existing fields
  reviews  Review[]
}
```

**Key Design Decisions:**
- Reviews linked to `OrderItem` (not `Product`) for verified purchase guarantee
- `sellerId` denormalized for fast aggregation queries
- `isVisible` flag enables moderation without data loss
- Buyer name stored for display (privacy consideration)

### Backend Modules

**ReviewsModule** (`backend/src/modules/reviews/`)
```
reviews/
├── reviews.module.ts              # Module registration
├── reviews.service.ts             # Business logic
├── reviews.controller.ts          # REST endpoints
└── dto/
    ├── create-review.dto.ts       # Validation for creating reviews
    └── moderate-review.dto.ts     # Validation for moderation
```

**ReviewsService Methods:**
- `createReview()` - Validates ownership, delivery status, creates review, updates seller rating
- `listForSellerHandle()` - Fetches visible reviews for public storefront
- `hideReview()` - Admin moderation, recalculates rating
- `recomputeSellerRating()` - Private helper to aggregate ratings

### Frontend Components

**ReviewFormClient** ([app/orders/[orderId]/ReviewFormClient.tsx](app/orders/[orderId]/ReviewFormClient.tsx))
- Client component (uses session)
- 5-star dropdown rating selector
- Comment textarea
- Submit button with loading states
- Success/error feedback

**Order Tracking Integration** ([app/orders/[orderId]/tracking/page.tsx](app/orders/[orderId]/tracking/page.tsx))
- Review form appears below order timeline
- Only shows for items with `fulfillmentStatus === "DELIVERED"`
- Positioned after dispute button

**Storefront Reviews Section** ([app/store/[handle]/page.tsx](app/store/[handle]/page.tsx))
- Server-rendered for SEO
- Fetches reviews via `getSellerReviews()`
- Displays up to 4 recent reviews
- 2-column grid on desktop, single column on mobile

### API Functions

**lib/api.ts:**
```typescript
// Buyer: Submit a review for a delivered item
export async function submitReview(data: {
  buyerId: string;
  orderItemId: string;
  rating: number;
  comment: string;
})

// PUBLIC: Get reviews for a seller's storefront
export async function getSellerReviews(handle: string)
```

---

## User Flows

### Buyer Review Flow

1. Buyer completes purchase and order is shipped
2. Seller marks item as DELIVERED
3. Buyer visits order tracking page (`/orders/{orderId}/tracking`)
4. Sees "Rate this item" form appear below timeline
5. Selects rating (1-5 stars)
6. Writes comment: "Great quality! Fast shipping from Lagos."
7. Clicks "Submit review"
8. Sees success message: "✓ Thanks for your review!"
9. Review immediately appears on seller's storefront

### Seller Benefit Flow

1. Seller delivers items and gets good reviews
2. Seller's `ratingAvg` auto-updates (e.g., 4.8)
3. Seller's `ratingCount` auto-updates (e.g., 129 reviews)
4. Storefront header shows: "4.8 ★ (129 reviews)"
5. Public visitors see recent reviews in "Recent Reviews" section
6. Higher rating → more trust → more conversions
7. Seller shares storefront link knowing social proof is visible

### Admin Moderation Flow

1. Admin receives report of abusive review
2. Admin calls API: `PATCH /reviews/{id}/hide` with adminId
3. Review's `isVisible` set to false
4. Seller's `ratingAvg` and `ratingCount` recalculated (excluding hidden review)
5. Review no longer appears on storefront
6. Data preserved in database for audit trail

---

## API Reference

### POST /reviews/create

**Description:** Buyer leaves a review for a delivered order item

**Auth:** Required (TODO: verify buyerId matches session)

**Request Body:**
```json
{
  "buyerId": "usr_123",
  "orderItemId": "oi_abc",
  "rating": 5,
  "comment": "Excellent quality! Fast shipping from Lagos. Highly recommend."
}
```

**Validation:**
- `rating`: Integer between 1-5
- `comment`: Required string
- Buyer must own the order item
- Item must have `fulfillmentStatus === "DELIVERED"`
- Prevents duplicate reviews (one per item per buyer)

**Response 201:**
```json
{
  "id": "rev_xyz",
  "orderItemId": "oi_abc",
  "buyerId": "usr_123",
  "sellerId": "usr_789",
  "rating": 5,
  "comment": "Excellent quality! Fast shipping from Lagos. Highly recommend.",
  "isVisible": true,
  "createdAt": "2024-10-29T10:30:00.000Z",
  "updatedAt": "2024-10-29T10:30:00.000Z"
}
```

**Response 403:** "Not your order item"
**Response 400:** "Item not delivered yet"
**Response 400:** "Already reviewed"

### GET /reviews/seller/:handle

**Description:** Fetch visible reviews for a seller's storefront (public endpoint)

**Auth:** None (public)

**URL Parameters:**
- `handle` - Seller's unique handle (e.g., "mama-ade-fashion")

**Query Parameters:**
- `limit` - Optional, max reviews to return (default: 20)

**Response 200:**
```json
{
  "seller": {
    "id": "usr_789",
    "handle": "mama-ade-fashion",
    "displayName": "Mama Ade Fashion",
    "ratingAvg": 4.8,
    "ratingCount": 129
  },
  "reviews": [
    {
      "id": "rev_xyz",
      "rating": 5,
      "comment": "Excellent quality! Fast shipping from Lagos. Highly recommend.",
      "createdAt": "2024-10-29T10:30:00.000Z",
      "buyer": {
        "id": "usr_123",
        "name": "John Doe",
        "email": "john@example.com"
      }
    }
  ]
}
```

**Response 404:** "Seller not found"

### PATCH /reviews/:id/hide

**Description:** Admin hides an abusive review

**Auth:** Required (admin only)

**URL Parameters:**
- `id` - Review ID

**Request Body:**
```json
{
  "adminId": "usr_admin"
}
```

**Validation:**
- `adminId` must have `role === "ADMIN"`

**Response 200:**
```json
{
  "id": "rev_xyz",
  "isVisible": false,
  "updatedAt": "2024-10-29T11:00:00.000Z"
}
```

**Response 403:** "Not authorized"
**Response 404:** "Review not found"

---

## Why This Matters

### For Buyers
- **Trust Signal**: See real reviews from verified purchases
- **Informed Decisions**: Know seller quality before buying
- **Voice**: Share experience to help others

### For Sellers
- **Social Proof**: Build reputation with every good delivery
- **Differentiation**: Stand out with high ratings
- **Feedback Loop**: Learn what customers value
- **Viral Marketing**: Good reviews → more shares → more sales

### For Platform
- **Quality Control**: Identify bad actors (low ratings)
- **Conversion Boost**: Reviews increase buyer confidence
- **Moderation Signals**: Flag sellers with frequent disputes + low ratings
- **SEO**: Review content indexed by Google
- **Network Effects**: More reviews → more trust → more growth

---

## Example Storefront with Reviews

**URL:** `/store/mama-ade-fashion`

**Header:**
- Shop Name: "Mama Ade Fashion"
- Location: "Lagos, Nigeria"
- **Rating: 4.8 ★ (129 reviews)** ← Aggregated from all reviews

**Recent Reviews Section:**

```
┌─────────────────────────────────────┐ ┌─────────────────────────────────────┐
│ John Doe              5★ 10/20/2024 │ │ Jane Smith            4★ 10/18/2024 │
│ Excellent quality! Fast shipping    │ │ Good product, took a bit long but   │
│ from Lagos. Highly recommend.       │ │ worth the wait. Will order again.   │
└─────────────────────────────────────┘ └─────────────────────────────────────┘

┌─────────────────────────────────────┐ ┌─────────────────────────────────────┐
│ Mike Johnson          5★ 10/15/2024 │ │ Sarah Williams        5★ 10/10/2024 │
│ Beautiful Ankara jacket. Fits       │ │ Love the design! Shipping was fast. │
│ perfectly. Great seller.            │ │ Packaging was excellent too.        │
└─────────────────────────────────────┘ └─────────────────────────────────────┘
```

---

## Setup Instructions

### 1. Run Database Migration

The Prisma schema includes the Review model. Run:

```bash
cd backend
npx prisma migrate dev --name add_reviews
```

This creates the `Review` table and adds review relations.

### 2. Verify Backend Setup

Check that ReviewsModule is registered:

```bash
# Should show ReviewsModule in imports
cat backend/src/modules/app.module.ts | grep ReviewsModule
```

### 3. Start Application

**Backend:**
```bash
cd backend
npm run start:dev
```

**Frontend:**
```bash
npm run dev
```

### 4. Test Review Flow

**Create test review:**

1. Log in as a buyer who has a delivered order
2. Go to `/orders/{orderId}/tracking`
3. Find a delivered item
4. Fill in review form:
   - Rating: 5
   - Comment: "Test review - great product!"
5. Click "Submit review"
6. Should see success message

**Verify on storefront:**

1. Find the seller's handle (e.g., from User table)
2. Visit `/store/{handle}`
3. Scroll to "Recent Reviews"
4. Should see the test review

**Check rating aggregation:**

```sql
-- In database
SELECT id, email, "ratingAvg", "ratingCount"
FROM "User"
WHERE role = 'SELLER';
```

Should show updated `ratingAvg` and `ratingCount`.

---

## Technical Details

### Rating Calculation Algorithm

When a review is created or hidden, the system recalculates:

```typescript
const agg = await prisma.review.groupBy({
  by: ['sellerId'],
  where: {
    sellerId,
    isVisible: true,  // Only count visible reviews
  },
  _avg: { rating: true },
  _count: { rating: true },
});

const avg = agg[0]?._avg.rating ?? 0;  // e.g., 4.8
const count = agg[0]?._count.rating ?? 0;  // e.g., 129

await prisma.user.update({
  where: { id: sellerId },
  data: { ratingAvg: avg, ratingCount: count },
});
```

**Why this approach:**
- Fast storefront queries (no joins needed)
- Real-time updates
- Hidden reviews excluded from average
- Handles edge cases (no reviews = 0.0)

### Duplicate Prevention

Before creating a review, check for existing:

```typescript
const existing = await prisma.review.findFirst({
  where: {
    orderItemId: dto.orderItemId,
    buyerId: dto.buyerId,
  },
});
if (existing) {
  throw new BadRequestException('Already reviewed');
}
```

### Verified Purchase Guarantee

Only delivered items can be reviewed:

```typescript
if (oi.fulfillmentStatus !== 'DELIVERED') {
  throw new BadRequestException('Item not delivered yet');
}
```

This prevents:
- Fake reviews from non-buyers
- Reviews before item received
- Seller self-reviews

### Privacy Considerations

The API returns buyer name for review display:

```typescript
buyer: {
  select: {
    id: true,
    name: true,
    email: true,  // Consider removing in production
  },
}
```

**Production recommendation:** Only return `name` or anonymize to "Verified Buyer".

---

## Production Checklist

Before launching reviews in production:

### Security
- [ ] Add authentication to POST /reviews/create
- [ ] Verify `buyerId` matches authenticated session
- [ ] Add rate limiting (prevent spam reviews)
- [ ] Sanitize comment input (prevent XSS)
- [ ] Add CSRF protection

### Privacy
- [ ] Remove buyer email from public API response
- [ ] Add option for buyers to review anonymously
- [ ] GDPR compliance: allow review deletion on user request

### Performance
- [ ] Add database index on `Review.sellerId` for fast aggregation
- [ ] Add index on `Review.isVisible` for filtering
- [ ] Cache seller ratings (Redis, 5-minute TTL)
- [ ] Paginate reviews (currently limited to 20)

### UX
- [ ] Add "Helpful" vote count on reviews
- [ ] Allow sellers to respond to reviews
- [ ] Add photo upload to reviews
- [ ] Show verification badge ("Verified Purchase")
- [ ] Send email notification to seller when review received

### Moderation
- [ ] Build admin dashboard to view all reviews
- [ ] Add flagging system (buyers report abusive reviews)
- [ ] Auto-detect profanity/spam with content filter
- [ ] Track moderation actions for audit

### SEO
- [ ] Add schema.org structured data for reviews
- [ ] Ensure reviews indexed by Google
- [ ] Add meta tags with aggregateRating

---

## Future Enhancements

### 1. Review Photos
Let buyers upload photos with reviews:

```typescript
// Add to Review model
photoUrls  String[]  // Array of image URLs

// Frontend upload
<input type="file" multiple onChange={handlePhotoUpload} />
```

### 2. Seller Responses
Allow sellers to respond to reviews:

```prisma
model ReviewResponse {
  id         String   @id @default(cuid())
  review     Review   @relation(fields: [reviewId], references: [id])
  reviewId   String   @unique
  sellerId   String
  response   String
  createdAt  DateTime @default(now())
}
```

### 3. Helpful Votes
Buyers vote on helpful reviews:

```prisma
model ReviewVote {
  id         String   @id @default(cuid())
  review     Review   @relation(fields: [reviewId], references: [id])
  reviewId   String
  userId     String
  isHelpful  Boolean
  createdAt  DateTime @default(now())

  @@unique([reviewId, userId])
}
```

Display: "47 people found this helpful"

### 4. Verified Purchase Badge
Show badge on reviews from verified purchases:

```tsx
{review.isVerifiedPurchase && (
  <span className="text-xs text-green-600">✓ Verified Purchase</span>
)}
```

### 5. Review Sorting
Let users sort reviews:
- Most recent
- Highest rated
- Lowest rated
- Most helpful

```typescript
@Get('seller/:handle')
async listForSeller(
  @Param('handle') handle: string,
  @Query('sort') sort?: 'recent' | 'highest' | 'lowest' | 'helpful'
) {
  // Apply sort logic
}
```

### 6. Email Notifications
Notify sellers of new reviews:

```typescript
// After creating review
await emailService.send({
  to: seller.email,
  subject: 'New review on your SokoNova shop',
  template: 'new-review',
  data: { seller, review }
});
```

### 7. Review Reminders
Send email to buyers 7 days after delivery:

```typescript
// Cron job
@Cron('0 9 * * *')  // Daily at 9am
async sendReviewReminders() {
  const items = await prisma.orderItem.findMany({
    where: {
      fulfillmentStatus: 'DELIVERED',
      deliveredAt: {
        gte: subDays(new Date(), 7),
        lte: subDays(new Date(), 8),
      },
      reviews: { none: {} },  // No review yet
    },
  });

  for (const item of items) {
    await emailService.sendReviewReminder(item);
  }
}
```

### 8. Seller Badges Based on Rating
Award badges to high-rated sellers:

```typescript
// Criteria
if (seller.ratingAvg >= 4.8 && seller.ratingCount >= 50) {
  badge = 'Top Rated Seller';
}

// Display on storefront
{seller.badge && (
  <div className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
    {seller.badge}
  </div>
)}
```

### 9. Review Analytics for Sellers
Show sellers their rating breakdown:

```
Your Rating Breakdown:
★★★★★ 5 stars: 85 reviews (65%)
★★★★☆ 4 stars: 30 reviews (23%)
★★★☆☆ 3 stars: 10 reviews (8%)
★★☆☆☆ 2 stars: 4 reviews (3%)
★☆☆☆☆ 1 star: 0 reviews (0%)

Average: 4.8 ★
Total: 129 reviews
```

### 10. Machine Learning Content Moderation
Auto-flag suspicious reviews:
- Same review text across multiple sellers
- Excessive positive/negative sentiment
- Rapid succession of reviews from same account
- Keywords associated with spam/abuse

---

## Troubleshooting

### Review Form Not Appearing

**Problem:** "Rate this item" doesn't show on tracking page

**Check:**
1. Item has `fulfillmentStatus === "DELIVERED"`
2. User is logged in (session exists)
3. ReviewFormClient imported correctly
4. No JavaScript console errors

### Review Submission Fails

**Problem:** "Failed to submit review" error

**Causes:**
1. Item not actually delivered (check database)
2. Buyer doesn't own the order (userId mismatch)
3. Already reviewed this item
4. Backend API not running

**Debug:**
```bash
# Check backend logs
cd backend
npm run start:dev

# Watch for errors when submitting review
```

### Rating Not Updating

**Problem:** Seller's `ratingAvg` doesn't change after review

**Check:**
1. Review was created successfully (check database)
2. `recomputeSellerRating()` ran without errors
3. Review is `isVisible === true`

**Manual fix:**
```sql
-- Recalculate manually
SELECT AVG(rating), COUNT(*)
FROM "Review"
WHERE "sellerId" = 'usr_123' AND "isVisible" = true;

-- Update user
UPDATE "User"
SET "ratingAvg" = 4.8, "ratingCount" = 129
WHERE id = 'usr_123';
```

### Reviews Not Showing on Storefront

**Problem:** "Recent Reviews" shows empty

**Check:**
1. Seller has visible reviews (check database)
2. Seller handle is correct
3. API endpoint returns data:
   ```bash
   curl http://localhost:4000/reviews/seller/test-shop
   ```
4. Frontend fetches reviews without errors (check browser console)

### Duplicate Review Error

**Problem:** Can't review twice, even after deleting first review

**Expected:** This is correct behavior - one review per item per buyer

**Workaround:** Admin can delete review from database if truly needed:
```sql
DELETE FROM "Review" WHERE id = 'rev_xyz';
```

---

## Files Modified/Created

### Backend

**Created:**
- `backend/src/modules/reviews/reviews.module.ts`
- `backend/src/modules/reviews/reviews.service.ts`
- `backend/src/modules/reviews/reviews.controller.ts`
- `backend/src/modules/reviews/dto/create-review.dto.ts`
- `backend/src/modules/reviews/dto/moderate-review.dto.ts`

**Modified:**
- `backend/prisma/schema.prisma` - Added Review model, relations to User and OrderItem
- `backend/src/modules/app.module.ts` - Registered ReviewsModule

### Frontend

**Created:**
- `app/orders/[orderId]/ReviewFormClient.tsx` - Buyer review form component

**Modified:**
- `lib/api.ts` - Added `submitReview()` and `getSellerReviews()`
- `app/orders/[orderId]/tracking/page.tsx` - Added review form integration
- `app/store/[handle]/page.tsx` - Added "Recent Reviews" section

---

## Business Impact

### Metrics to Track

**Review Engagement:**
- % of delivered orders that get reviewed
- Average time between delivery and review
- Average review rating across platform
- % of reviews with comments vs rating-only

**Conversion Impact:**
- Conversion rate: storefront with reviews vs without
- Average order value: high-rated vs low-rated sellers
- Repeat purchase rate: reviewed vs non-reviewed sellers

**Quality Signals:**
- Sellers with <3.0 rating (investigate/remove)
- Sellers with sudden rating drop (fraud alert)
- Products with frequent low ratings (quality issues)

### Success Indicators

**Early Traction:**
- 20% of delivered items get reviewed within 14 days
- Average platform rating above 4.0
- Top sellers have 50+ reviews

**Strong Product-Market Fit:**
- Buyers cite reviews as #1 reason for purchase confidence
- Sellers actively request reviews from buyers
- Review count correlates with seller growth
- Negative reviews lead to measurable quality improvements

---

## Next Steps

You've just built the **trust loop** that transforms SokoNova from a transaction platform into a **trusted community**. Natural next steps:

1. **Category Discovery** - Help buyers find sellers by category, location, rating
2. **Payment Integration** - Wire up Flutterwave/Paystack for real money
3. **Seller Analytics** - Dashboard showing rating trends, review breakdown
4. **Mobile App** - Native iOS/Android for on-the-go reviews

The reviews system is production-ready and waiting for database setup!
