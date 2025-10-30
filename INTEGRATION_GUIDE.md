# Frontend-to-Backend Integration Guide

## Overview

This guide explains how the frontend has been wired to the backend to display real data from the NestJS API.

## Architecture

- **Frontend**: Next.js 14 (App Router) on port 3000
- **Backend**: NestJS REST API on port 4000
- **Databases**:
  - PostgreSQL (backend business data)
  - SQLite (frontend authentication)
  - Redis (session/cart management)

## What Was Changed

### 1. Environment Configuration

**File**: [.env.local](.env.local)

Added the backend URL environment variable:
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:4000
```

This allows the frontend to communicate with the backend API.

### 2. Product Grid (Home Page)

**File**: [components/ProductGrid.tsx](components/ProductGrid.tsx)

- Already configured to fetch from backend via `lib/api.getProducts()`
- Transforms backend response format (title → name, imageUrl → image)
- Server-side rendering for SEO benefits

### 3. Product Detail Page

**File**: [app/products/[id]/page.tsx](app/products/[id]/page.tsx)

**Changes**:
- Removed mock data dependency
- Now calls `getProduct(id)` from `lib/api`
- Fetches real product data from backend
- Displays currency alongside price
- Handles errors gracefully with 404 page

### 4. Cart Page

**File**: [app/cart/page.tsx](app/cart/page.tsx)

**Changes**:
- Removed mock data lookup
- Now fetches product details from backend for each cart item
- Added loading state while fetching products
- Uses Promise.all for efficient parallel fetching
- Handles errors gracefully

### 5. Checkout Page

**File**: [app/checkout/page.tsx](app/checkout/page.tsx)

**Changes**:
- Added authentication check (requires sign-in)
- Fetches product prices from backend to calculate total
- Added form validation
- Added loading state
- Displays order total with item count
- Shows empty cart message
- Redirects to home page after successful checkout

**Note**: Currently uses the local `/api/checkout` endpoint. To fully integrate with backend orders API, update the checkout submission to call `createOrder()` from `lib/api.ts`.

## API Integration Layer

**File**: [lib/api.ts](lib/api.ts)

All backend API calls go through this centralized module:

```typescript
// Products
getProducts()           // GET /products
getProduct(id)          // GET /products/:id

// Cart (currently using frontend routes, can be migrated to backend)
ensureCart()           // GET /cart
cartAdd()              // POST /cart/add
cartRemove()           // DELETE /cart/remove
cartClear()            // DELETE /cart/clear

// Orders
createOrder()          // POST /orders/create
```

## Data Flow

### Product Listing Flow
```
1. User visits homepage
2. ProductGrid component (SSR) calls getProducts()
3. getProducts() fetches from NEXT_PUBLIC_BACKEND_URL/products
4. Backend ProductsController.list() queries PostgreSQL
5. Response mapped to frontend Product type
6. ProductCard components render with real data
```

### Product Detail Flow
```
1. User clicks product card
2. Navigate to /products/[id]
3. ProductPage calls getProduct(id)
4. Backend ProductsController.get(id) queries PostgreSQL
5. Product details rendered with real data
6. AddToCart button uses cart context
```

### Cart Flow
```
1. User views cart page
2. Cart items loaded from local cart context (Redis-backed)
3. For each item, fetch product details from backend
4. Display product names, prices, and quantities
5. Calculate total from real backend prices
```

### Checkout Flow
```
1. User clicks "Proceed to Checkout"
2. Check authentication status
3. Fetch product prices to calculate total
4. User fills out shipping form
5. Submit to /api/checkout (mock endpoint)
6. TODO: Replace with backend createOrder() call
7. Clear cart and redirect to home
```

## Backend Endpoints Available

### Products
- `GET /products` - List all products with inventory
- `GET /products/:id` - Get single product details
- `POST /products` - Create product (needs auth guard)

### Cart
- `GET /cart?userId=X&anonKey=Y` - Get/create cart
- `POST /cart/add` - Add item to cart
- `DELETE /cart/remove?cartId=X&productId=Y` - Remove item
- `DELETE /cart/clear?cartId=X` - Clear cart

### Orders
- `GET /orders?userId=X` - List user orders
- `POST /orders/create?cartId=X` - Create order from cart

### Users
- `GET /users/:id` - Get user profile

## Setup Instructions

### Prerequisites
- Node.js 18+
- PostgreSQL
- Redis

### Frontend Setup

1. Install dependencies (already done):
```bash
npm install
```

2. Set up Prisma database:
```bash
npx prisma generate
npx prisma db push
```

3. Start Redis (if running locally):
```bash
redis-server
```

4. Start the frontend:
```bash
npm run dev
```

Frontend runs on: http://localhost:3000

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/sokonova_db
PORT=4000
NODE_ENV=development
```

4. Run Prisma migrations:
```bash
npx prisma generate
npx prisma db push
```

5. (Optional) Seed database with sample products:
```bash
# Create a seed script or use Prisma Studio
npx prisma studio
```

6. Start the backend:
```bash
npm run start:dev
```

Backend runs on: http://localhost:4000

## Testing the Integration

### 1. Test Product Listing
- Visit http://localhost:3000
- Should see products from backend (or empty state if no products)
- Open DevTools Network tab and verify calls to `localhost:4000/products`

### 2. Test Product Detail
- Click any product card
- Should navigate to detail page with real data
- Verify backend API call in Network tab

### 3. Test Cart
- Add products to cart
- Navigate to /cart
- Verify product details are fetched from backend
- Check that prices match backend data

### 4. Test Checkout
- Sign in first (use demo credentials)
- Add items to cart
- Go to checkout
- Verify total is calculated from backend prices
- Fill out form and submit

## Demo Credentials

```
buyer@sokonova.dev / buyer123
seller@sokonova.dev / seller123
admin@sokonova.dev / admin123
```

## Next Steps

### Immediate
1. ✅ Wire frontend to backend products API
2. ✅ Update cart to fetch real product details
3. ✅ Add loading and error states
4. ⏳ Seed backend database with sample products

### Short Term
1. Replace `/api/checkout` with backend `createOrder()` call
2. Create order history page for users
3. Add seller dashboard for product management
4. Implement real authentication sync between frontend and backend

### Medium Term
1. Consolidate cart management (decide: Redis frontend vs PostgreSQL backend)
2. Add product search and filtering
3. Implement payment processing (Stripe/PayPal)
4. Add inventory management
5. Create admin dashboard

## Troubleshooting

### Frontend can't connect to backend
- Verify backend is running on port 4000
- Check `NEXT_PUBLIC_BACKEND_URL` in `.env.local`
- Verify CORS is enabled in backend `main.ts`

### Products not showing
- Ensure backend database has products
- Use Prisma Studio to add test products: `npx prisma studio` (in backend directory)
- Check browser console for API errors

### Cart issues
- Verify Redis is running
- Check Redis connection in `.env.local`
- Clear cookies and try again

### Authentication issues
- Run `npx prisma generate && npx prisma db push` in frontend
- Verify SQLite database exists at `prisma/dev.db`
- Try signing up with a new account

## File Structure Reference

```
Frontend:
├── app/
│   ├── page.tsx                    # Home page (ProductGrid)
│   ├── products/[id]/page.tsx      # Product detail ✅ Updated
│   ├── cart/page.tsx               # Cart page ✅ Updated
│   ├── checkout/page.tsx           # Checkout ✅ Updated
│   └── api/                        # Next.js API routes
│       ├── products/route.ts       # ⚠️ Mock data (can be removed)
│       ├── cart/route.ts           # Redis-backed cart
│       └── checkout/route.ts       # Mock checkout
├── components/
│   ├── ProductGrid.tsx             # Product grid ✅ Already integrated
│   └── ProductCard.tsx             # Product card
├── lib/
│   ├── api.ts                      # ✅ Backend API client
│   ├── cart.ts                     # Cart context
│   └── mockData.ts                 # ⚠️ Can be removed
└── .env.local                      # ✅ Backend URL added

Backend:
├── src/
│   └── modules/
│       ├── products/               # Product CRUD
│       ├── cart/                   # Cart management
│       ├── orders/                 # Order management
│       └── users/                  # User profile
└── prisma/
    └── schema.prisma               # PostgreSQL schema
```

## Summary

The frontend is now successfully wired to the backend:

✅ Product listing fetches from backend
✅ Product details fetch from backend
✅ Cart resolves product details from backend
✅ Checkout calculates totals from backend prices
✅ Environment variables configured
✅ Error handling and loading states added
✅ Dependencies installed

The integration is functional and ready for testing once the backend is running with seeded data.
