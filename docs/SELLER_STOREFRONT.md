# Seller Storefront System

## Overview

The Seller Storefront system transforms SokoNova from a marketplace into **a network of micro-brands**. Every seller gets their own public shop page with branding, product grid, and shareable link.

**Key Achievement:** Give sellers bragging rights, viral acquisition tools, and professional merchant identity. "Here's my SokoNova shop link" becomes your most powerful growth engine.

---

## What's Been Implemented

### 1. **Seller Profile Fields (Database)**
Extended `User` model with storefront metadata:
- `sellerHandle` - Unique URL slug (e.g., "mama-ade-fashion")
- `shopName` - Display name (e.g., "Mama Ade Fashion")
- `shopLogoUrl` - Brand logo image
- `shopBannerUrl` - Hero banner image
- `shopBio` - Short pitch/description
- `country` / `city` - Location for local trust
- `ratingAvg` / `ratingCount` - Social proof metrics (future-proofed)

### 2. **Public Storefront Pages**
Every seller with a handle gets a live page at `/store/{handle}`:
- Hero banner with glass-card overlay
- Logo, shop name, location
- Rating stars and review count
- Shop bio
- Product grid (filtered to seller's items)
- Fully responsive mobile-first design

### 3. **Seller Dashboard Settings**
New "Store Settings" section in `/seller`:
- Edit shop name, handle, bio
- Set logo and banner URLs
- Configure country/city
- Auto-sanitize handle (lowercase, hyphens only)
- Live preview link to public storefront
- Duplicate handle protection (unique constraint)

### 4. **Backend API**
- **GET `/storefront/handle/:handle`** - Public endpoint to fetch seller + products
- **PATCH `/users/:id/storefront`** - Sellers update their profile
- Prisma schema enforces unique `sellerHandle`

---

## Architecture

### Database Schema

**Added to User model:**
```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  role      Role     @default(BUYER)

  // Seller storefront fields
  sellerHandle   String?  @unique     // "mama-ade-fashion"
  shopName       String?
  shopLogoUrl    String?
  shopBannerUrl  String?
  shopBio        String?  // short pitch
  country        String?
  city           String?

  // basic reputation / trust signal
  ratingAvg      Float?   @default(0)
  ratingCount    Int?     @default(0)

  // ... existing relations
}
```

**Key design decisions:**
- `sellerHandle` is unique and nullable (not all users are sellers)
- Rating fields future-proof the system for reviews
- Location fields build trust for local commerce
- Logo/banner URLs (not file uploads yet - sellers use CDN links)

### Backend Modules

**StorefrontModule** (`backend/src/modules/storefront/`)
```
storefront/
├── storefront.module.ts           # Module registration
├── storefront.service.ts          # Business logic
└── storefront.controller.ts       # REST endpoint
```

**StorefrontService.getStorefrontByHandle()**
- Finds seller by handle
- Validates role is SELLER or ADMIN
- Returns seller profile + products
- Public endpoint (no auth required)

**UsersService.updateStorefrontProfile()**
- Updates seller's storefront fields
- Prisma throws error if handle already taken
- Returns updated profile

### Frontend Routes

**Public Storefront: `/store/[handle]/page.tsx`**
- Server component (SSR for SEO)
- Fetches data via `getStorefrontByHandle()`
- Returns `notFound()` if seller doesn't exist
- Displays banner, logo, bio, ratings, products
- Uses existing `ProductCard` component

**Seller Dashboard: `/seller/seller-inner.tsx`**
- New "Store Settings" section
- Form fields for all storefront data
- Auto-sanitizes handle (lowercase, no special chars)
- Save button calls `updateStorefront()`
- "View Shop" link opens public page in new tab

### API Functions

**lib/api.ts:**
```typescript
// PUBLIC: Get storefront by seller handle
export async function getStorefrontByHandle(handle: string)

// Seller: Update storefront profile
export function updateStorefront(userId: string, data: {
  shopName?: string;
  sellerHandle?: string;
  shopLogoUrl?: string;
  shopBannerUrl?: string;
  shopBio?: string;
  country?: string;
  city?: string;
})
```

---

## User Flows

### Seller Setup Flow

1. Seller logs into dashboard at `/seller`
2. Scrolls to "Store Settings" section
3. Fills in:
   - **Shop Name**: "Mama Ade Fashion"
   - **Shop Handle**: "mama-ade-fashion" (auto-sanitized)
   - **Country**: "Nigeria"
   - **City**: "Lagos"
   - **Shop Bio**: "Affordable Ankara fits from Lagos 🇳🇬"
   - **Logo URL**: Link to hosted image
   - **Banner URL**: Link to hosted image
4. Clicks "Save Storefront"
5. Success message shows shop URL: `/store/mama-ade-fashion`
6. Clicks "View Shop →" to see live page
7. Shares link on Instagram, WhatsApp, Twitter

### Buyer Discovery Flow

1. Buyer discovers seller link (social media, DM, QR code)
2. Visits `/store/mama-ade-fashion`
3. Sees professional storefront:
   - Banner image
   - Logo and shop name
   - Location: "Lagos, Nigeria"
   - Rating: "4.8 ★ (129 reviews)"
   - Bio about the shop
4. Browses product grid
5. Clicks product to view details
6. Adds to cart and checks out
7. Becomes a customer

---

## Why This Matters

### For Sellers
- **Shareable Link**: Instagram bio, WhatsApp status, business cards
- **Professional Identity**: Not just "a seller" - a real brand
- **Trust Signals**: Location, ratings, product count
- **Viral Growth**: Every seller markets their own shop = free acquisition for SokoNova

### For Buyers
- **Human Connection**: Shopping from "Mama Ade in Lagos", not a faceless warehouse
- **Trust**: Real person, real location, real reviews
- **Discovery**: Follow favorite sellers across platforms

### For Platform
- **Network Effects**: More sellers → more shops → more shareable links → more buyers
- **Differentiation**: Unlike Amazon/Jumia - focuses on merchant identity
- **Data**: Track which sellers drive traffic, sales, retention
- **Future Monetization**: Featured storefronts, verification badges, premium branding

---

## Example Storefront

**URL:** `/store/mama-ade-fashion`

**Displays:**
- **Banner**: Colorful Ankara fabric pattern (1200x400px)
- **Logo**: Circle profile photo of the seller (200x200px)
- **Header**:
  - Shop Name: "Mama Ade Fashion"
  - Location: "Lagos, Nigeria"
  - Rating: "4.8 ★ (129 reviews)"
  - Handle: "@mama-ade-fashion"
- **Bio**: "Affordable Ankara fits from Lagos 🇳🇬"
- **Products**: 12 items in grid - jackets, dresses, headwraps
- **CTA**: "Trusted Seller • 129+ sales"

---

## Setup Instructions

### 1. Run Database Migration

The Prisma schema is ready. Run the migration:

```bash
cd backend
npx prisma migrate dev --name add_seller_storefront
```

This adds the 9 new columns to the `User` table.

### 2. Start Backend

```bash
cd backend
npm run start:dev
```

Backend runs on `http://localhost:4000`

### 3. Start Frontend

```bash
npm run dev
```

Frontend runs on `http://localhost:3000`

### 4. Test the Flow

**As a Seller:**

1. Log in as a user with role `SELLER`
2. Go to `/seller`
3. Scroll to "Store Settings"
4. Fill in:
   - Shop Name: "Test Shop"
   - Shop Handle: "test-shop"
   - Country: "Nigeria"
   - City: "Lagos"
   - Shop Bio: "Test storefront"
   - Logo URL: Any image URL (or leave blank)
   - Banner URL: Any image URL (or leave blank)
5. Click "Save Storefront"
6. Should see success message
7. Click "View Shop →"

**As a Buyer:**

1. Visit `/store/test-shop`
2. Should see storefront page with seller info
3. Should see products from that seller
4. Can click products to view/buy

---

## Technical Details

### Handle Sanitization

The seller handle input auto-sanitizes on change:

```typescript
sellerHandle: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-")
```

**Examples:**
- "Mama Ade" → "mama-ade"
- "My Shop!" → "my-shop"
- "Lagos_Store_2024" → "lagos-store-2024"

### Duplicate Handle Protection

The `sellerHandle` field has a unique constraint in Prisma:

```prisma
sellerHandle   String?  @unique
```

If a seller tries to use a taken handle, the backend returns an error and the frontend shows: "Failed to update storefront. Handle may already be taken."

### SEO & Performance

The storefront page is a **Next.js Server Component**:
- Server-side rendered (SSR)
- Good for SEO (Google indexes seller pages)
- Fast initial load
- Uses `cache: "no-store"` to always show fresh data

### Mobile-First Design

The storefront uses responsive grid:
- Mobile: 2 products per row
- Tablet: 3 products per row
- Desktop: 4 products per row

Banner height adjusts:
- Mobile: 12rem (192px)
- Desktop: 16rem (256px)

### Rating System (Future-Proofed)

The `ratingAvg` and `ratingCount` fields are ready for when you add reviews:

```typescript
ratingAvg: Float?   @default(0)
ratingCount: Int?   @default(0)
```

**When you build reviews:**
1. Create `Review` model linked to `User` (seller)
2. After each review, recalculate:
   ```typescript
   ratingAvg = SUM(rating) / COUNT(reviews)
   ratingCount = COUNT(reviews)
   ```
3. Update seller's `User` record
4. Storefront automatically displays updated rating

---

## API Reference

### GET /storefront/handle/:handle

**Description:** Fetch public storefront data by seller handle

**Auth:** None (public endpoint)

**URL Parameters:**
- `handle` - Seller's unique handle (e.g., "mama-ade-fashion")

**Response 200:**
```json
{
  "seller": {
    "id": "usr_123",
    "name": "Ade",
    "shopName": "Mama Ade Fashion",
    "sellerHandle": "mama-ade-fashion",
    "shopLogoUrl": "https://cdn.example.com/logo.png",
    "shopBannerUrl": "https://cdn.example.com/banner.jpg",
    "shopBio": "Affordable Ankara fits from Lagos 🇳🇬",
    "country": "Nigeria",
    "city": "Lagos",
    "ratingAvg": 4.8,
    "ratingCount": 129
  },
  "products": [
    {
      "id": "prod_abc",
      "title": "Handmade Ankara Jacket",
      "description": "Tailored in Surulere.",
      "price": "45.00",
      "currency": "USD",
      "imageUrl": "https://cdn.example.com/jacket.jpg",
      "createdAt": "2024-10-20T10:30:00.000Z",
      "inventory": { "quantity": 12 }
    }
  ]
}
```

**Response 404:**
```json
{
  "statusCode": 404,
  "message": "Storefront not found"
}
```

### PATCH /users/:id/storefront

**Description:** Update seller's storefront profile

**Auth:** Required (TODO: ensure userId matches session or is admin)

**URL Parameters:**
- `id` - User ID of the seller

**Request Body:**
```json
{
  "shopName": "Mama Ade Fashion",
  "sellerHandle": "mama-ade-fashion",
  "shopLogoUrl": "https://...",
  "shopBannerUrl": "https://...",
  "shopBio": "Affordable Ankara fits from Lagos 🇳🇬",
  "country": "Nigeria",
  "city": "Lagos"
}
```

All fields are optional.

**Response 200:**
```json
{
  "id": "usr_123",
  "shopName": "Mama Ade Fashion",
  "sellerHandle": "mama-ade-fashion",
  "shopLogoUrl": "https://...",
  "shopBannerUrl": "https://...",
  "shopBio": "Affordable Ankara fits from Lagos 🇳🇬",
  "country": "Nigeria",
  "city": "Lagos",
  "ratingAvg": 0,
  "ratingCount": 0
}
```

**Response 400 (Duplicate Handle):**
```
Unique constraint failed on the fields: (`sellerHandle`)
```

---

## Future Enhancements

### 1. File Upload for Images
Instead of pasting URLs, let sellers upload logo/banner directly:

```typescript
// Add to backend
import { MulterModule } from '@nestjs/platform-express';

// Upload endpoint
@Post('upload')
@UseInterceptors(FileInterceptor('image'))
async uploadImage(@UploadedFile() file: Express.Multer.File) {
  // Save to S3/CloudFlare Images/Cloudinary
  const url = await this.uploadService.save(file);
  return { url };
}
```

Frontend:
```typescript
<input type="file" onChange={handleFileUpload} />
```

### 2. Seller Verification Badge
Show "Verified Seller ✓" badge for:
- Sellers with 50+ sales
- Sellers with 4.5+ rating
- Manually verified by admin

```prisma
model User {
  isVerified Boolean @default(false)
}
```

Display on storefront:
```tsx
{seller.isVerified && (
  <span className="text-blue-500">✓ Verified Seller</span>
)}
```

### 3. Featured Sellers
Create a homepage section "Featured Shops":

```typescript
// Backend
@Get('featured')
async getFeaturedSellers() {
  return this.prisma.user.findMany({
    where: { role: 'SELLER', isFeatured: true },
    select: { id, shopName, sellerHandle, shopLogoUrl, ratingAvg }
  });
}
```

### 4. Category Landing Pages
"Top Streetwear Sellers in Lagos":

```typescript
// Backend
@Get('sellers/category/:category')
async getSellersByCategory(@Param('category') category: string) {
  return this.prisma.user.findMany({
    where: {
      role: 'SELLER',
      products: { some: { category } }
    }
  });
}
```

### 5. Custom Domain per Seller
Let premium sellers use custom domains:
- Seller pays for `mama-ade-fashion.com`
- You create CNAME record pointing to SokoNova
- Storefront renders at their domain

```typescript
// Check host header
const host = req.headers.host;
if (host === 'mama-ade-fashion.com') {
  const seller = await prisma.user.findFirst({
    where: { customDomain: host }
  });
  // Render storefront
}
```

### 6. Social Sharing Cards
Add Open Graph meta tags to storefront page for rich previews:

```tsx
// app/store/[handle]/page.tsx
export async function generateMetadata({ params }) {
  const data = await getStorefrontByHandle(params.handle);
  return {
    title: `${data.seller.shopName} | SokoNova`,
    description: data.seller.shopBio,
    openGraph: {
      images: [data.seller.shopBannerUrl],
    },
  };
}
```

### 7. Seller Analytics
Track storefront visits, clicks, conversions:

```typescript
// Log view event
await prisma.storefrontView.create({
  data: {
    sellerId: seller.id,
    userAgent: req.headers['user-agent'],
    referer: req.headers.referer,
  }
});
```

Show in seller dashboard:
- "Your shop has been viewed 1,234 times this month"
- "Top traffic source: Instagram"

---

## Troubleshooting

### Storefront Returns 404

**Problem:** `/store/some-handle` returns "Page not found"

**Check:**
1. Seller exists with that handle:
   ```sql
   SELECT * FROM "User" WHERE "sellerHandle" = 'some-handle';
   ```
2. Seller role is SELLER or ADMIN
3. Backend is running and accessible
4. Browser console shows no CORS errors

### Can't Save Storefront - "Handle already taken"

**Problem:** Error when saving storefront settings

**Cause:** Another seller already has that handle

**Solution:**
1. Choose a different handle
2. Or: Find the conflicting seller:
   ```sql
   SELECT * FROM "User" WHERE "sellerHandle" = 'the-handle';
   ```

### Images Not Loading

**Problem:** Logo/banner shows broken image icon

**Check:**
1. URL is publicly accessible (not localhost)
2. Image server allows hotlinking (CORS headers)
3. URL starts with `https://`
4. Image file exists and hasn't been deleted

**Solution:** Use a CDN like:
- Cloudinary
- Imgur
- CloudFlare Images
- AWS S3 with public bucket

### Rating Shows 0.0

**Expected behavior:** Ratings default to 0 until you build the review system.

**Future:** When you add reviews, ratings will update automatically.

---

## Files Modified/Created

### Backend

**Created:**
- `backend/src/modules/storefront/storefront.module.ts`
- `backend/src/modules/storefront/storefront.service.ts`
- `backend/src/modules/storefront/storefront.controller.ts`

**Modified:**
- `backend/prisma/schema.prisma` - Added storefront fields to User
- `backend/src/modules/app.module.ts` - Registered StorefrontModule
- `backend/src/modules/users/users.service.ts` - Added updateStorefrontProfile()
- `backend/src/modules/users/users.controller.ts` - Added PATCH /users/:id/storefront

### Frontend

**Created:**
- `app/store/[handle]/page.tsx` - Public storefront page

**Modified:**
- `lib/api.ts` - Added getStorefrontByHandle() and updateStorefront()
- `app/seller/seller-inner.tsx` - Added Store Settings section

---

## Production Checklist

Before launching storefronts in production:

### Security
- [ ] Add authentication to PATCH /users/:id/storefront
- [ ] Verify userId matches session OR user is admin
- [ ] Rate limit storefront updates (prevent handle squatting)
- [ ] Sanitize all inputs (XSS protection)
- [ ] Add CSRF protection if using cookies

### Performance
- [ ] Add database index on `sellerHandle` for fast lookups
- [ ] Cache storefront data (Redis, 5-minute TTL)
- [ ] Optimize images (WebP format, CDN)
- [ ] Add page view analytics without slowing down render

### UX
- [ ] Add image upload (don't make sellers paste URLs)
- [ ] Show preview of storefront while editing
- [ ] Handle validation (min 3 chars, max 50 chars)
- [ ] Warn seller if changing handle (old links break)
- [ ] Add "Copy shop link" button

### SEO
- [ ] Add meta tags (title, description, OG image)
- [ ] Create sitemap.xml with all storefronts
- [ ] Add JSON-LD structured data for Local Business
- [ ] Ensure page loads in < 2 seconds

### Legal
- [ ] Terms of Service for sellers (branding guidelines)
- [ ] Prohibit offensive/misleading shop names
- [ ] Reserve certain handles (admin, support, help, etc.)
- [ ] DMCA policy for logo/banner images

---

## Business Impact

### Metrics to Track

**Seller Engagement:**
- % of sellers who set up storefront
- Average time to first storefront setup
- Handle change frequency

**Buyer Behavior:**
- Traffic to /store/* pages
- Conversion rate: storefront visit → purchase
- Traffic sources (Instagram, WhatsApp, etc.)

**Platform Growth:**
- Sellers acquired via storefront shares
- Buyers acquired via storefront shares
- Viral coefficient (shares per seller)

### Success Indicators

**Early Traction:**
- 50% of active sellers set up storefront in first month
- 20% of new buyers discover platform via seller links
- 5+ organic shares per seller per month

**Strong Product-Market Fit:**
- Sellers request custom domains
- Sellers print shop QR codes on business cards
- Buyers follow multiple seller storefronts
- Sellers pay for featured placement

---

## Next Steps

You've just built the foundation for merchant identity and viral growth. Natural next steps:

1. **Reviews & Ratings** - Feed the ratingAvg/ratingCount fields
2. **Social Sharing** - One-click share to Instagram/WhatsApp
3. **Storefront Analytics** - Show sellers their traffic/sales
4. **Verification Badges** - Build trust with "Verified Seller"
5. **Featured Shops** - Homepage carousel of top storefronts

The storefront system is live and ready to transform your marketplace into a network of micro-brands!
