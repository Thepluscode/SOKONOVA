# Setting Up Fulfillment & Shipping Tracking

## Quick Setup Guide

This guide will help you set up the Fulfillment & Shipping Tracking system in 5 minutes.

---

## Prerequisites

- PostgreSQL database running
- Backend and frontend environments configured (see main README.md)
- Existing orders in the database (or test data)

---

## Step 1: Install Backend Dependencies

```bash
cd backend
npm install
```

This installs:
- `@nestjs/common`, `@nestjs/core` (NestJS framework)
- `@prisma/client` (Database ORM)
- `class-validator`, `class-transformer` (DTO validation)

---

## Step 2: Run Database Migration

The fulfillment system adds new fields to the `OrderItem` model. Run the migration:

```bash
cd backend
npx prisma migrate dev --name add_fulfillment_tracking
```

This will:
1. Add `fulfillmentStatus` enum field (default: PACKED)
2. Add `shippedAt`, `deliveredAt` timestamps
3. Add `trackingCode`, `carrier` fields
4. Add `deliveryProofUrl`, `notes` fields
5. Create the `FulfillmentStatus` enum (PACKED, SHIPPED, DELIVERED, ISSUE)

**Expected output:**
```
Environment variables loaded from .env
Prisma schema loaded from prisma/schema.prisma
Datasource "db": PostgreSQL database "sokonova_db"

✔ Generated Prisma Client (X.X.X) to ./node_modules/@prisma/client
✔ Applied migration `add_fulfillment_tracking`
```

---

## Step 3: Generate Prisma Client

```bash
cd backend
npx prisma generate
```

This regenerates the TypeScript types with the new fields.

---

## Step 4: Start Backend

```bash
cd backend
npm run start:dev
```

Backend should start on `http://localhost:4000`.

**Check that fulfillment module loaded:**
Look for these log lines:
```
[Nest] 12345  - [FulfillmentModule] FulfillmentModule dependencies initialized
[Nest] 12345  - [RoutesResolver] FulfillmentController {/fulfillment}: +1ms
```

---

## Step 5: Start Frontend

In a separate terminal:

```bash
# From project root
npm run dev
```

Frontend should start on `http://localhost:3000`.

---

## Step 6: Test the System

### Test as Seller

1. **Login as seller:**
   - Go to `http://localhost:3000/auth/login`
   - Use: `seller@sokonova.dev` / `seller123`

2. **View fulfillment queue:**
   - Go to `http://localhost:3000/seller`
   - Scroll to "Shipments & Fulfillment" section
   - You should see any pending items (with status PACKED or SHIPPED)

3. **Mark an item as shipped:**
   - Fill in carrier (e.g., "DHL")
   - Fill in tracking code (e.g., "1234567890")
   - Add note (e.g., "Expected delivery in 2-3 days")
   - Click "Confirm Shipped"
   - Item should disappear from PACKED queue or show updated status

4. **Mark an item as delivered:**
   - Fill in delivery proof URL (e.g., `https://example.com/photo.jpg`)
   - Add note (e.g., "Left with security guard")
   - Click "Confirm Delivered"
   - Item should be removed from queue

### Test as Buyer

1. **Login as buyer:**
   - Go to `http://localhost:3000/auth/login`
   - Use: `buyer@sokonova.dev` / `buyer123`

2. **View order tracking:**
   - Go to `http://localhost:3000/orders/[ORDER_ID]/tracking`
   - Replace `[ORDER_ID]` with an actual order ID from your database

3. **Check tracking page:**
   - Should see order details at top
   - Should see each item with status badge
   - Should see visual timeline:
     - ✅ Order Placed (always green)
     - ✅ Shipped (green if shipped, gray if not)
     - ✅ Delivered (green if delivered, gray if not)
   - If item is shipped, tracking code should be visible
   - If item is delivered, proof link should be visible

---

## Step 7: Test API Endpoints

### Get seller fulfillment queue

```bash
curl "http://localhost:4000/fulfillment/seller/open?sellerId=YOUR_SELLER_ID"
```

**Expected response:**
```json
[
  {
    "id": "oi_123",
    "orderId": "order_456",
    "qty": 2,
    "price": "50.00",
    "fulfillmentStatus": "PACKED",
    "product": {
      "title": "Handmade Bag",
      "imageUrl": "https://..."
    },
    "order": {
      "id": "order_456",
      "status": "PAID",
      "shippingAddress": "123 Main St",
      "buyerName": "John Doe",
      "buyerEmail": "john@example.com"
    }
  }
]
```

### Mark item as shipped

```bash
curl -X PATCH "http://localhost:4000/fulfillment/seller/ship/ITEM_ID?sellerId=SELLER_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "carrier": "DHL",
    "trackingCode": "1234567890",
    "note": "Expected delivery in 2-3 days"
  }'
```

### Get order tracking (buyer)

```bash
curl "http://localhost:4000/fulfillment/tracking/ORDER_ID?userId=BUYER_ID"
```

---

## Troubleshooting

### Issue: Migration fails with "column already exists"

**Cause:** Migration was already run

**Solution:**
```bash
# Check migration status
npx prisma migrate status

# If needed, reset database (WARNING: deletes all data)
npx prisma migrate reset

# Then run migration again
npx prisma migrate dev --name add_fulfillment_tracking
```

### Issue: Backend shows "Cannot find module '@nestjs/common'"

**Cause:** Backend dependencies not installed

**Solution:**
```bash
cd backend
npm install
```

### Issue: Fulfillment queue is empty

**Cause:** Either no orders exist, or all items are already DELIVERED

**Solution:**
```bash
# Check fulfillment statistics
curl "http://localhost:4000/fulfillment/seller/stats?sellerId=YOUR_SELLER_ID"

# Response shows breakdown:
{
  "PACKED": 0,
  "SHIPPED": 0,
  "DELIVERED": 10,
  "ISSUE": 0,
  "total": 10
}

# If all are DELIVERED, create a test order or reset status manually via Prisma Studio
```

### Issue: Tracking page shows "Order Not Found"

**Cause 1:** Order doesn't exist or wrong ID

**Solution:** Check order ID in database

**Cause 2:** User not logged in or doesn't own the order

**Solution:** Login as the buyer who placed the order

### Issue: Seller can't update item (403 Forbidden)

**Cause:** Seller doesn't own the product

**Solution:** Verify `sellerId` matches the product's seller in database

---

## Seed Test Data (Optional)

If you want to create test orders for fulfillment testing:

```bash
cd backend
npx prisma studio
```

1. Open `Order` model
2. Create new order with status `PAID`
3. Open `OrderItem` model
4. Create new order items linked to that order
5. Set `fulfillmentStatus` to `PACKED`
6. Fill in `sellerId` with your test seller ID

---

## Production Checklist

Before going to production:

- [ ] Add authentication guards to fulfillment endpoints
- [ ] Verify seller ownership in all update operations
- [ ] Add rate limiting to tracking page (prevent scraping)
- [ ] Set up carrier API integrations (DHL, FedEx, UPS)
- [ ] Add image upload for delivery proof (vs URL input)
- [ ] Send email/SMS notifications on status changes
- [ ] Add buyer "Confirm Delivery" button
- [ ] Create admin dashboard for ISSUE resolution
- [ ] Add performance metrics (avg delivery time, issue rate)

---

## Next Steps

1. **Integrate carrier APIs** - See [FULFILLMENT_TRACKING.md](FULFILLMENT_TRACKING.md) section on "Carrier Integration"
2. **Add SMS/Email notifications** - Notify buyers when status changes
3. **Build issue resolution dashboard** - For admin to handle disputes
4. **Add buyer delivery confirmation** - Let buyers confirm receipt
5. **Performance analytics** - Track delivery times and seller ratings

---

## Documentation

- **Full Guide:** [FULFILLMENT_TRACKING.md](FULFILLMENT_TRACKING.md)
- **API Reference:** [FULFILLMENT_TRACKING.md#api-endpoints](FULFILLMENT_TRACKING.md#api-endpoints)
- **Main README:** [README.md](README.md)

---

**Status:** ✅ Setup Complete | 🚀 Ready for Testing

**Last Updated:** 2025-10-28
