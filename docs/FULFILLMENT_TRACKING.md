# Fulfillment & Shipping Tracking System

## Overview

The Fulfillment & Shipping Tracking system transforms SokoNova from "we took your money" into **"your item is on the way, here's proof."** This builds buyer trust and reduces seller disputes through transparent shipping lifecycle management.

**Key Achievement:** Per-item fulfillment tracking that supports multi-seller orders, with complete shipping timelines visible to buyers and sellers.

---

## What's Been Implemented

### 1. **Per-Item Fulfillment Status**
- Each `OrderItem` tracks its own shipping status
- Status flow: PACKED → SHIPPED → DELIVERED (or ISSUE)
- Supports multi-seller orders where different items ship separately
- Timestamped transitions (shippedAt, deliveredAt)

### 2. **Seller Fulfillment Dashboard**
- View all items awaiting shipment
- Mark items as shipped with tracking info
- Mark items as delivered with proof
- See buyer shipping address and contact info
- Flag issues for admin attention

### 3. **Buyer Order Tracking**
- Visual shipping timeline per item
- Real-time status updates
- Tracking codes with carrier information
- Delivery proof viewing
- Issue notifications

### 4. **Proof of Delivery**
- Sellers can attach delivery proof URLs (photos, signatures, receipts)
- Reduces disputes and chargebacks
- Creates audit trail for marketplace protection

---

## Architecture

### Database Schema Extensions

**OrderItem Model** (Extended):
```prisma
model OrderItem {
  // ... existing fields ...

  // --- FULFILLMENT & SHIPPING TRACKING ---
  fulfillmentStatus FulfillmentStatus @default(PACKED)
  shippedAt         DateTime?
  deliveredAt       DateTime?
  trackingCode      String?       // Tracking number from carrier
  carrier           String?       // DHL, FedEx, UPS, local courier
  deliveryProofUrl  String?       // Photo of package, signature, receipt
  notes             String?       // Seller note to buyer
}

enum FulfillmentStatus {
  PACKED      // Seller prepared item, ready to ship
  SHIPPED     // Handed off to carrier with tracking
  DELIVERED   // Buyer received / confirmed delivery
  ISSUE       // Dispute, lost, damaged, or other problem
}
```

### Backend Modules

```
backend/src/modules/fulfillment/
├── fulfillment.module.ts       # Module registration
├── fulfillment.service.ts      # Core fulfillment logic
├── fulfillment.controller.ts   # Buyer + seller endpoints
└── dto/
    └── fulfillment.dto.ts      # Validation DTOs
```

### Frontend Pages & Components

```
app/
├── seller/seller-inner.tsx     # Shipments section added
└── orders/[orderId]/tracking/  # Buyer tracking page
    └── page.tsx

lib/api.ts                      # Fulfillment API functions
```

---

## API Endpoints

### Buyer Endpoints

#### Get Order Tracking
```http
GET /fulfillment/tracking/:orderId?userId={userId}
```

**Response:**
```json
{
  "orderId": "order_123",
  "status": "PAID",
  "createdAt": "2025-10-28T10:00:00.000Z",
  "shippingAddress": "123 Main St, Nairobi",
  "items": [
    {
      "orderItemId": "oi_456",
      "productTitle": "Handmade Bag",
      "productImage": "https://...",
      "qty": 2,
      "price": "50.00",
      "fulfillmentStatus": "SHIPPED",
      "trackingCode": "1234567890",
      "carrier": "DHL",
      "shippedAt": "2025-10-29T14:30:00.000Z",
      "deliveredAt": null,
      "deliveryProofUrl": null,
      "notes": "Expected delivery in 2-3 days"
    }
  ]
}
```

### Seller Endpoints

#### Get Open Fulfillment Queue
```http
GET /fulfillment/seller/open?sellerId={sellerId}
```

Returns all items with status PACKED or SHIPPED (not yet DELIVERED).

**Response:**
```json
[
  {
    "id": "oi_456",
    "orderId": "order_123",
    "qty": 2,
    "price": "50.00",
    "fulfillmentStatus": "PACKED",
    "product": {
      "title": "Handmade Bag",
      "imageUrl": "https://..."
    },
    "order": {
      "id": "order_123",
      "status": "PAID",
      "shippingAddress": "123 Main St, Nairobi",
      "buyerName": "John Doe",
      "buyerEmail": "john@example.com"
    },
    "createdAt": "2025-10-28T10:00:00.000Z"
  }
]
```

#### Mark Item as Shipped
```http
PATCH /fulfillment/seller/ship/:orderItemId?sellerId={sellerId}
Content-Type: application/json

{
  "carrier": "DHL",
  "trackingCode": "1234567890",
  "note": "Expected delivery in 2-3 days"
}
```

**Response:**
```json
{
  "id": "oi_456",
  "fulfillmentStatus": "SHIPPED",
  "shippedAt": "2025-10-29T14:30:00.000Z",
  "trackingCode": "1234567890",
  "carrier": "DHL"
}
```

#### Mark Item as Delivered
```http
PATCH /fulfillment/seller/deliver/:orderItemId?sellerId={sellerId}
Content-Type: application/json

{
  "proofUrl": "https://cdn.example.com/delivery-photo.jpg",
  "note": "Left with receptionist"
}
```

**Response:**
```json
{
  "id": "oi_456",
  "fulfillmentStatus": "DELIVERED",
  "deliveredAt": "2025-10-30T10:15:00.000Z",
  "deliveryProofUrl": "https://cdn.example.com/delivery-photo.jpg"
}
```

#### Mark Item as Having Issue
```http
PATCH /fulfillment/seller/issue/:orderItemId?sellerId={sellerId}
Content-Type: application/json

{
  "note": "Package lost by carrier, initiating claim"
}
```

#### Get Fulfillment Statistics
```http
GET /fulfillment/seller/stats?sellerId={sellerId}
```

**Response:**
```json
{
  "PACKED": 5,
  "SHIPPED": 12,
  "DELIVERED": 143,
  "ISSUE": 2,
  "total": 162
}
```

---

## How It Works

### Order Creation Flow

When a buyer places an order:

1. **Order is created** with status `PENDING`
2. **Payment is processed** → Order status becomes `PAID`
3. **OrderItems are created** with:
   - Initial `fulfillmentStatus`: `PACKED`
   - Seller ID for ownership
   - All other fields null (awaiting seller action)

### Seller Fulfillment Workflow

1. **Seller views fulfillment queue** at `/seller`
   - Sees all PACKED and SHIPPED items
   - Sees buyer shipping address and contact info

2. **Seller prepares and ships item**
   - Enters carrier name (e.g., "DHL", "FedEx")
   - Enters tracking code
   - Adds optional note to buyer
   - Clicks "Confirm Shipped"

3. **Backend updates item**
   - `fulfillmentStatus`: PACKED → SHIPPED
   - `shippedAt`: Current timestamp
   - `carrier`, `trackingCode`, `notes` saved

4. **Seller confirms delivery**
   - When item is delivered, enters proof URL
   - Adds delivery note (e.g., "Left with security")
   - Clicks "Confirm Delivered"

5. **Backend finalizes item**
   - `fulfillmentStatus`: SHIPPED → DELIVERED
   - `deliveredAt`: Current timestamp
   - `deliveryProofUrl`, `notes` saved

### Buyer Tracking Experience

1. **Buyer visits** `/orders/{orderId}/tracking`
2. **Sees visual timeline** for each item:
   - ✅ Order Placed (timestamp)
   - ✅ Shipped (timestamp, tracking code, carrier)
   - ✅ Delivered (timestamp, proof link)

3. **If item has tracking code:**
   - Displayed prominently with carrier name
   - Can copy/paste into carrier website

4. **If item has delivery proof:**
   - Link to view photo/receipt
   - Builds trust and reduces disputes

### Multi-Seller Orders

If an order contains products from multiple sellers:
- Each item tracks fulfillment independently
- Items can be at different statuses
- Buyer sees all items on one tracking page
- Each seller only sees/manages their own items

**Example:**
```
Order #123:
├─ Item A (Seller 1): DELIVERED ✅
├─ Item B (Seller 1): DELIVERED ✅
├─ Item C (Seller 2): SHIPPED 🚚
└─ Item D (Seller 3): PACKED 📦
```

---

## UI Features

### Seller Dashboard - Shipments Section

**Location:** `/seller`

**Features:**
- Shows all pending shipments in queue
- Two-column layout:
  - Left: Product info, buyer details, shipping address
  - Right: Ship/deliver action forms

**Ship Item Form:**
- Carrier input (DHL, FedEx, UPS, etc.)
- Tracking code input
- Optional note to buyer
- "Confirm Shipped" button

**Deliver Item Form:**
- Delivery proof URL input
- Delivery note input
- "Confirm Delivered" button

**Visual Status:**
- Color-coded badges (yellow: PACKED, blue: SHIPPED, green: DELIVERED)
- Timestamps for shipped date
- Product thumbnail and details
- Buyer shipping address highlighted

### Buyer Tracking Page

**Location:** `/orders/{orderId}/tracking`

**Features:**
- Order summary at top (ID, date, status, shipping address)
- Card per item with:
  - Product image and details
  - Status badge
  - Visual timeline with checkmarks
  - Tracking information (if shipped)
  - Delivery proof link (if delivered)
  - Issue alert (if problem)

**Timeline States:**
1. ✅ **Order Placed** - Always shown (green checkmark)
2. ✅ **Shipped** - If shipped (green) or ⭕ Awaiting (gray)
3. ✅ **Delivered** - If delivered (green) or ⭕ Out for Delivery (gray)

**Issue Handling:**
- Red alert box if status is ISSUE
- Shows issue description
- Prompts to contact support

---

## Testing the System

### 1. Run Database Migration

```bash
cd backend
npx prisma migrate dev --name add_fulfillment_tracking
```

### 2. Test Seller Flow

```bash
# Get seller's open fulfillment queue
curl "http://localhost:4000/fulfillment/seller/open?sellerId=SELLER_ID"

# Mark item as shipped
curl -X PATCH "http://localhost:4000/fulfillment/seller/ship/ITEM_ID?sellerId=SELLER_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "carrier": "DHL",
    "trackingCode": "1234567890",
    "note": "Expected delivery in 2-3 days"
  }'

# Mark item as delivered
curl -X PATCH "http://localhost:4000/fulfillment/seller/deliver/ITEM_ID?sellerId=SELLER_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "proofUrl": "https://example.com/proof.jpg",
    "note": "Left with security guard"
  }'
```

### 3. Test Buyer Flow

```bash
# Get order tracking
curl "http://localhost:4000/fulfillment/tracking/ORDER_ID?userId=BUYER_ID"
```

### 4. UI Testing

1. **Seller Dashboard:**
   - Login as seller
   - Go to `/seller`
   - Scroll to "Shipments & Fulfillment"
   - Test marking items as shipped/delivered

2. **Buyer Tracking:**
   - Login as buyer
   - Go to `/orders/{orderId}/tracking`
   - View shipping timeline
   - Check tracking codes display

---

## Production Readiness

### Security

- [ ] **Add authentication guards** to all fulfillment endpoints
- [ ] **Verify seller ownership** before allowing updates
- [ ] **Verify buyer ownership** before showing tracking
- [ ] **Rate limit tracking page** to prevent scraping
- [ ] **Sanitize delivery proof URLs** to prevent XSS

### Integrations

- [ ] **Carrier API integration** for automatic tracking updates
  - DHL API
  - FedEx API
  - UPS API
  - Local courier webhooks

- [ ] **Automatic status updates** from carrier webhooks
  - Carrier sends "delivered" event → Update fulfillmentStatus
  - Reduces manual seller work

- [ ] **SMS/Email notifications** to buyers
  - "Your order has shipped! Tracking: XXX"
  - "Your order has been delivered"

### Buyer Confirmation

- [ ] **Add "Confirm Delivery" button** for buyers
  - Buyer confirms receipt
  - Creates stronger proof than seller attestation alone
  - Unlocks payout to seller faster

### Issue Handling

- [ ] **Admin issue queue dashboard**
  - View all items with ISSUE status
  - Contact buyer and seller
  - Resolve disputes
  - Initiate refunds if needed

- [ ] **Buyer "Report Issue" button**
  - "Item not received"
  - "Item damaged"
  - "Wrong item"
  - Auto-flags item as ISSUE

### Analytics

- [ ] **Delivery time tracking**
  - Average: shippedAt → deliveredAt
  - By carrier, by seller, by region

- [ ] **Seller performance metrics**
  - % delivered on time
  - Average shipping time
  - Issue rate
  - Buyer satisfaction scores

---

## Future Enhancements

### 1. **Carrier Integration**

Automate tracking updates via carrier APIs:

**DHL API:**
```typescript
async function updateTrackingFromDHL(trackingCode: string) {
  const response = await fetch(`https://api.dhl.com/track/shipments?trackingNumber=${trackingCode}`, {
    headers: { 'DHL-API-Key': process.env.DHL_API_KEY },
  });

  const data = await response.json();

  if (data.shipments[0].status.statusCode === 'delivered') {
    await markDelivered(orderItemId, sellerId, data.shipments[0].details.proofOfDeliveryUrl);
  }
}
```

### 2. **Smart Tracking Page**

- Live carrier tracking widget embedded
- Estimated delivery date prediction
- Delivery time slot selection
- Delivery location map

### 3. **Proof of Delivery Image Upload**

Instead of URL input, allow sellers to upload directly:

```typescript
// Backend: Add upload endpoint
@Post('upload-proof')
@UseInterceptors(FileInterceptor('file'))
async uploadProof(@UploadedFile() file: Express.Multer.File) {
  const url = await this.cloudinary.upload(file);
  return { url };
}
```

```typescript
// Frontend: File upload in seller dashboard
<input
  type="file"
  accept="image/*"
  onChange={async (e) => {
    const file = e.target.files?.[0];
    const formData = new FormData();
    formData.append('file', file);

    const { url } = await uploadProof(formData);
    setProof(url);
  }}
/>
```

### 4. **QR Code for Delivery Confirmation**

Generate QR code for each order item. Buyer scans on delivery:

```typescript
// Generate QR code
const qrCode = generateQRCode({
  orderItemId: item.id,
  confirmationToken: crypto.randomBytes(32).toString('hex'),
});

// Buyer scans QR → Auto-confirms delivery
```

### 5. **Returns & Exchanges**

Extend fulfillment to handle reverse logistics:

```prisma
enum FulfillmentStatus {
  // ... existing statuses ...
  RETURN_REQUESTED
  RETURN_SHIPPED
  RETURN_RECEIVED
  EXCHANGED
}
```

---

## Troubleshooting

### Issue: Fulfillment queue empty but items exist

**Cause:** Items already marked as DELIVERED

**Solution:** Check fulfillment stats endpoint:
```bash
curl "http://localhost:4000/fulfillment/seller/stats?sellerId=SELLER_ID"
```

### Issue: Tracking page shows "Order Not Found"

**Cause:** Either order doesn't exist or buyer doesn't own it

**Solution:**
1. Verify order ID is correct
2. Verify user is logged in
3. Check order belongs to logged-in user

### Issue: Can't mark item as shipped

**Cause:** Seller doesn't own the item

**Solution:** Verify `sellerId` matches the product's seller

### Issue: Tracking code not clickable

**Cause:** Just text display, not auto-linked

**Solution:** Add carrier-specific tracking URL generation:
```typescript
function getTrackingUrl(carrier: string, code: string) {
  const carriers = {
    'DHL': `https://www.dhl.com/tracking?id=${code}`,
    'FedEx': `https://www.fedex.com/fedextrack/?trknbr=${code}`,
    'UPS': `https://www.ups.com/track?tracknum=${code}`,
  };
  return carriers[carrier] || '#';
}
```

---

## Benefits

### For Buyers
✅ **Transparency** - See exactly where their order is
✅ **Trust** - Real-time updates reduce anxiety
✅ **Proof** - Delivery photos/receipts prevent disputes
✅ **Tracking** - Carrier codes for detailed status

### For Sellers
✅ **Organized workflow** - Clear queue of items to ship
✅ **Proof of delivery** - Protect against false claims
✅ **Customer satisfaction** - Proactive communication
✅ **Dispute protection** - Timestamped evidence

### For Platform
✅ **Reduced disputes** - Complete audit trail
✅ **Seller accountability** - Performance tracking
✅ **Buyer retention** - Professional experience
✅ **Scalable operations** - Per-item granularity

---

## Summary

The Fulfillment & Shipping Tracking system provides:

✅ Per-item fulfillment status (PACKED → SHIPPED → DELIVERED)
✅ Seller fulfillment dashboard with action forms
✅ Buyer order tracking page with visual timeline
✅ Tracking codes and carrier information
✅ Delivery proof with URL attachments
✅ Issue flagging for dispute resolution
✅ Multi-seller order support
✅ Complete audit trail with timestamps

**This transforms SokoNova from "we took your money" into "your item is on the way, here's proof."**

Buyers trust the platform. Sellers have professional tools. Disputes are minimized. The marketplace scales.

---

**Next Steps:**
1. Run migration: `npx prisma migrate dev --name add_fulfillment_tracking`
2. Test seller fulfillment flow
3. Test buyer tracking page
4. Integrate carrier APIs for automated updates
5. Add buyer delivery confirmation
6. Build admin issue resolution dashboard

---

**Built with:** NestJS, Prisma, PostgreSQL, TypeScript, Next.js, React

**Status:** ✅ Implementation Complete | 🚀 Ready for Testing & Carrier Integration
