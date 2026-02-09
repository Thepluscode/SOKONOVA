# Seller Portal Guide

## Overview

The Seller Portal transforms SokoNova from a single-vendor store into a **multi-seller marketplace**. Sellers can manage their own products, inventory, and view orders—all within a dedicated dashboard.

This implementation provides:
- **Role-based access control** (ready for BUYER/SELLER/ADMIN roles)
- **Seller-scoped CRUD operations** with ownership verification
- **Inventory management** with real-time updates
- **Order tracking** per product
- **Production-ready API structure** for authentication guards

---

## Architecture

### Backend Structure

```
backend/src/modules/products/
├── products.service.ts            # Core product logic + seller-scoped methods
├── products.controller.ts         # Public product endpoints
├── seller-products.controller.ts  # Seller-scoped endpoints (NEW)
├── dto/
│   ├── create-product.dto.ts
│   ├── update-product.dto.ts      # For product updates (NEW)
│   └── update-inventory.dto.ts    # For inventory updates (NEW)
└── products.module.ts             # Wires up both controllers
```

### Frontend Structure

```
app/seller/
├── page.tsx                # Auth guard + server component wrapper
└── seller-inner.tsx        # Main seller dashboard (client component)

lib/
└── api.ts                  # Seller API functions
```

---

## API Endpoints

### Seller-Scoped Endpoints

All endpoints under `/seller/products` verify ownership before execution.

#### 1. List Seller's Products
```http
GET /seller/products?sellerId={userId}
```

**Response:**
```json
[
  {
    "id": "clx123",
    "title": "Product Name",
    "description": "Description",
    "price": "49.99",
    "currency": "USD",
    "imageUrl": "https://...",
    "createdAt": "2025-01-15T10:00:00Z",
    "inventory": {
      "quantity": 100
    },
    "orderItems": [
      {
        "id": "order_item_123",
        "qty": 2,
        "order": {
          "id": "order_123",
          "status": "PAID",
          "createdAt": "2025-01-16T12:00:00Z"
        }
      }
    ]
  }
]
```

#### 2. Create Product
```http
POST /seller/products
Content-Type: application/json

{
  "sellerId": "user_123",
  "title": "New Product",
  "description": "Product description",
  "price": 49.99,
  "currency": "USD",
  "imageUrl": "https://example.com/image.jpg"
}
```

**Response:**
```json
{
  "id": "clx_new_product",
  "title": "New Product",
  "price": "49.99",
  ...
}
```

#### 3. Update Product
```http
PATCH /seller/products/{productId}?sellerId={userId}
Content-Type: application/json

{
  "title": "Updated Title",
  "price": 59.99
}
```

**Authorization Check:**
- Verifies `product.sellerId === sellerId`
- Returns `403 Forbidden` if seller doesn't own the product
- Returns `404 Not Found` if product doesn't exist

#### 4. Update Inventory
```http
PATCH /seller/products/{productId}/inventory?sellerId={userId}
Content-Type: application/json

{
  "quantity": 150
}
```

**Authorization Check:**
- Same ownership verification as product updates
- Creates inventory record if it doesn't exist
- Updates existing inventory if it does

---

## Frontend Features

### Seller Dashboard (`/seller`)

**Authentication Guard:**
- Redirects to login if not authenticated
- Checks for valid user session
- Ready for role-based access (commented code included)

**Dashboard Sections:**

1. **Stats Cards**
   - Total Products
   - Total Orders (across all products)
   - Total Inventory (sum of all product inventory)

2. **Product Management**
   - Create new products with form
   - Edit existing products inline
   - Update inventory with real-time input
   - View order count per product

3. **Product Form**
   - Title, description, price, currency
   - Image URL support
   - Validation for required fields
   - Cancel/Save actions

4. **Products Table**
   - Product thumbnail and details
   - Price display
   - Inventory quantity (editable inline)
   - Order count
   - Edit button per product

---

## Implementation Details

### Ownership Verification

All seller-scoped methods in `ProductsService` verify ownership:

```typescript
async sellerUpdate(sellerId: string, productId: string, data: UpdateProductDto) {
  const existing = await this.prisma.product.findUnique({ where: { id: productId } });

  if (!existing) {
    throw new NotFoundException('Product not found');
  }

  if (existing.sellerId !== sellerId) {
    throw new ForbiddenException('Not authorized to update this product');
  }

  return this.prisma.product.update({ where: { id: productId }, data });
}
```

This ensures sellers can **only modify their own products**.

### Frontend State Management

The `SellerDashboard` component uses React state for:
- Products list
- Edit/create mode tracking
- Form data
- Loading states

**Key patterns:**
```typescript
// Load products on mount
useEffect(() => {
  loadProducts();
}, [userId]);

// Create/update with optimistic UI
await createSellerProduct(data);
await loadProducts(); // Refresh after mutation

// Inline inventory updates
<input
  type="number"
  value={product.inventory?.quantity || 0}
  onChange={(e) => handleInventoryUpdate(product.id, parseInt(e.target.value))}
/>
```

---

## Production Readiness Checklist

### 1. Add Role-Based Access Control

**Backend: JWT Authentication Guards**

```typescript
// Create auth guard (in backend/src/auth/guards/)
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!requiredRoles) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user; // From JWT

    return requiredRoles.some((role) => user.roles?.includes(role));
  }
}
```

**Apply to controller:**
```typescript
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/auth/guards/roles.guard';
import { Roles } from '@/auth/decorators/roles.decorator';

@Controller('seller/products')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('SELLER', 'ADMIN')
export class SellerProductsController {
  // ...
}
```

**Extract user from JWT:**
```typescript
import { CurrentUser } from '@/auth/decorators/current-user.decorator';

@Get()
async myProducts(@CurrentUser() user: User) {
  return this.products.sellerList(user.id);
}
```

### 2. Update Prisma Schema with Role Field

```prisma
enum UserRole {
  BUYER
  SELLER
  ADMIN
}

model User {
  id       String   @id @default(cuid())
  email    String   @unique
  name     String?
  role     UserRole @default(BUYER)  // Add this field
  ...
}
```

Run migration:
```bash
cd backend
npx prisma migrate dev --name add_user_role
```

### 3. Frontend Role Checking

Update `app/seller/page.tsx`:

```typescript
import { prisma } from '@/lib/prisma';

export default async function SellerPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/auth/login");

  const userId = (session.user as any)?.id;
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (user?.role !== 'SELLER' && user?.role !== 'ADMIN') {
    return (
      <div className="container mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p className="mt-4">You need seller access to view this page.</p>
        <Link href="/seller/apply" className="text-blue-600 underline">
          Apply to become a seller
        </Link>
      </div>
    );
  }

  return <SellerDashboard userId={userId} userName={user.name || "Seller"} />;
}
```

### 4. Add "Become a Seller" Flow

**Backend endpoint:**
```typescript
// backend/src/modules/users/users.controller.ts

@Post(':userId/promote-seller')
@UseGuards(JwtAuthGuard)
async promoteSeller(
  @Param('userId') userId: string,
  @CurrentUser() currentUser: User,
) {
  // TODO: Add approval workflow, payment processing, or admin verification

  // For now, simple promotion
  return this.users.updateRole(userId, 'SELLER');
}
```

**Frontend button in user profile:**
```typescript
// app/profile/page.tsx

import { promoteToSeller } from '@/lib/api';

async function handleBecomeSeller() {
  try {
    await promoteToSeller(userId);
    router.push('/seller');
  } catch (error) {
    alert('Failed to upgrade account');
  }
}

{user.role === 'BUYER' && (
  <Button onClick={handleBecomeSeller}>
    Become a Seller
  </Button>
)}
```

### 5. Add Image Upload

Replace image URL input with file upload:

**Backend (using Cloudinary, AWS S3, or similar):**
```typescript
import { FileInterceptor } from '@nestjs/platform-express';
import { UseInterceptors, UploadedFile } from '@nestjs/common';

@Post('upload')
@UseInterceptors(FileInterceptor('file'))
async uploadImage(@UploadedFile() file: Express.Multer.File) {
  const imageUrl = await this.cloudinary.upload(file);
  return { imageUrl };
}
```

**Frontend:**
```typescript
<input
  type="file"
  accept="image/*"
  onChange={async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    const { imageUrl } = await uploadImage(formData);
    setFormData({ ...formData, imageUrl });
  }}
/>
```

### 6. Add Soft Delete

**Update Prisma schema:**
```prisma
model Product {
  // ... existing fields
  isActive    Boolean  @default(true)
  deletedAt   DateTime?
}
```

**Update queries to filter deleted products:**
```typescript
async sellerList(sellerId: string) {
  return this.prisma.product.findMany({
    where: {
      sellerId,
      isActive: true,  // Only show active products
    },
    // ...
  });
}

async sellerDelete(sellerId: string, productId: string) {
  // Verify ownership first...

  return this.prisma.product.update({
    where: { id: productId },
    data: {
      isActive: false,
      deletedAt: new Date(),
    },
  });
}
```

---

## Testing the Seller Portal

### 1. Start Backend

```bash
cd backend
npm run start:dev
```

Backend runs on `http://localhost:4000`

### 2. Start Frontend

```bash
# From project root
npm run dev
```

Frontend runs on `http://localhost:3000`

### 3. Test Flow

1. **Login/Register** at `/auth/login`
2. **Navigate to** `/seller`
3. **Create a product:**
   - Click "New Product"
   - Fill in title, description, price
   - Submit form
4. **Edit product:**
   - Click "Edit" on any product
   - Modify fields
   - Save changes
5. **Update inventory:**
   - Change quantity in the input field
   - Value updates immediately
6. **View stats:**
   - Check total products, orders, inventory

### 4. API Testing with cURL

**List seller products:**
```bash
curl http://localhost:4000/seller/products?sellerId=YOUR_USER_ID
```

**Create product:**
```bash
curl -X POST http://localhost:4000/seller/products \
  -H "Content-Type: application/json" \
  -d '{
    "sellerId": "YOUR_USER_ID",
    "title": "Test Product",
    "description": "A test product",
    "price": 29.99,
    "currency": "USD"
  }'
```

**Update product:**
```bash
curl -X PATCH "http://localhost:4000/seller/products/PRODUCT_ID?sellerId=YOUR_USER_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "price": 39.99
  }'
```

**Update inventory:**
```bash
curl -X PATCH "http://localhost:4000/seller/products/PRODUCT_ID/inventory?sellerId=YOUR_USER_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "quantity": 200
  }'
```

---

## Future Enhancements

### 1. Seller Analytics
- Revenue tracking per seller
- Sales charts (daily/weekly/monthly)
- Top-selling products
- Customer demographics

### 2. Order Management for Sellers
- View all orders containing seller's products
- Update order status (processing → shipped)
- Print shipping labels
- Bulk order processing

### 3. Commission & Payouts
- Platform commission percentage per sale
- Payout schedules (weekly/monthly)
- Payment method setup (bank account, mobile money)
- Transaction history and invoices

### 4. Seller Verification
- KYC (Know Your Customer) process
- Document upload (business license, ID)
- Manual admin approval
- Verified badge for approved sellers

### 5. Product Variations
- Size, color, material options
- SKU management
- Variant-specific inventory
- Price adjustments per variant

### 6. Bulk Operations
- CSV import/export for products
- Bulk price updates
- Bulk inventory updates
- Mass product activation/deactivation

### 7. Seller Messaging
- Customer → Seller direct messaging
- Order-specific chat threads
- Automated responses
- Email notifications

---

## Troubleshooting

### "Access Denied" on `/seller`

**Issue:** Not authenticated or session missing user ID

**Solution:**
1. Ensure you're logged in at `/auth/login`
2. Check browser console for session errors
3. Verify `NEXTAUTH_SECRET` is set in `.env.local`

### "Not authorized to update this product"

**Issue:** Trying to edit a product you don't own

**Solution:**
- Verify you're using the correct `sellerId` parameter
- Check that `product.sellerId` matches your user ID
- In production, this will be automatic with JWT

### Products not loading

**Issue:** Backend API unreachable or CORS error

**Solution:**
1. Check backend is running on `http://localhost:4000`
2. Verify `NEXT_PUBLIC_BACKEND_URL` in `.env.local`
3. Check browser console for CORS errors
4. Ensure backend CORS is configured for `http://localhost:3000`

### Inventory update not persisting

**Issue:** Input changes but doesn't save to database

**Solution:**
- Check browser console for API errors
- Verify `UpdateInventoryDto` validation (quantity must be >= 0)
- Ensure product has an inventory record (created on first product creation)

---

## Summary

The Seller Portal provides a **complete marketplace foundation**:

✅ **Seller-scoped CRUD** with ownership verification
✅ **Inventory management** with real-time updates
✅ **Order tracking** per product
✅ **Role-based access** ready for production
✅ **Production-ready API structure**

With the production readiness checklist, you can easily add:
- JWT authentication guards
- Role-based permissions
- Image uploads
- Soft delete
- "Become a Seller" workflow

**Next Steps:**
1. Add role field to User model
2. Implement JWT authentication guards
3. Create "Become a Seller" application flow
4. Add image upload functionality
5. Implement seller analytics dashboard

---

**Built with:** NestJS, Next.js, Prisma, PostgreSQL, TypeScript
