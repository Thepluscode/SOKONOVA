# Commission & Payouts System

## Overview

The Commission & Payouts system transforms SokoNova from a checkout flow into a **real marketplace business** with seller earnings tracking, marketplace commission, and payout management.

This is the feature that makes sellers care: **"How much did I earn, and when do I get paid?"**

---

## What's Been Implemented

### 1. **Seller Earnings Tracking**
- Every order item now tracks:
  - **Gross Amount**: Total sales (price × quantity)
  - **Fee Amount**: Marketplace commission (10%)
  - **Net Amount**: What the seller receives (gross - fees)
  - **Payout Status**: PENDING or PAID_OUT
  - **Payout Batch ID**: For grouping payouts
  - **Paid At**: Timestamp when seller was paid

### 2. **Automatic Commission Calculation**
- When an order is created, the system automatically:
  - Snapshots seller earnings at order time
  - Calculates 10% marketplace commission
  - Stores gross, fee, and net amounts per line item
  - Denormalizes sellerId for fast queries

### 3. **Seller Earnings Dashboard**
- Sellers see:
  - **Gross sales**: Total revenue
  - **Marketplace fees**: 10% commission
  - **Net earnings**: What they're owed
  - **Pending items count**: Number of unpaid orders
  - **CSV export**: For bank transfer / mobile money

### 4. **Admin Payout Management**
- Finance/ops can:
  - View all pending payouts across sellers
  - Mark batches as paid with batch ID
  - Export CSV for reconciliation
  - Track payout history

---

## Architecture

### Database Schema Changes

**OrderItem Model** (Extended):
```prisma
model OrderItem {
  id        String   @id @default(cuid())
  orderId   String
  productId String
  qty       Int
  price     Decimal  @db.Decimal(12,2)

  // --- SELLER EARNINGS & PAYOUT TRACKING ---
  sellerId        String
  grossAmount     Decimal       @db.Decimal(12,2)
  feeAmount       Decimal       @db.Decimal(12,2)
  netAmount       Decimal       @db.Decimal(12,2)
  payoutStatus    PayoutStatus  @default(PENDING)
  payoutBatchId   String?
  paidAt          DateTime?
  currency        String        @default("USD")
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
}

enum PayoutStatus {
  PENDING
  PAID_OUT
}
```

### Backend Modules

```
backend/src/modules/payouts/
├── payouts.module.ts       # Payouts module registration
├── payouts.service.ts      # Core payout business logic
├── payouts.controller.ts   # Seller + admin endpoints
└── dto/
    └── mark-paid.dto.ts    # Validation for payout marking
```

### Frontend Integration

- **Seller Dashboard**: [app/seller/seller-inner.tsx](app/seller/seller-inner.tsx)
  - Earnings summary cards
  - CSV download link
  - Payout status display

- **API Client**: [lib/api.ts](lib/api.ts)
  - `sellerGetPendingPayout()`
  - `sellerPayoutCsvUrl()`
  - `adminMarkPaidOut()`
  - `adminPayoutSummary()`

---

## API Endpoints

### Seller Endpoints

#### 1. Get Pending Earnings
```http
GET /payouts/seller/pending?sellerId={userId}
```

**Response:**
```json
{
  "currency": "USD",
  "totalGross": 412.50,
  "totalFees": 41.25,
  "totalNet": 371.25,
  "count": 12,
  "items": [
    {
      "id": "oi_123",
      "orderId": "order_456",
      "productId": "prod_789",
      "qty": 2,
      "price": "29.99",
      "grossAmount": "59.98",
      "feeAmount": "5.998",
      "netAmount": "53.982",
      "currency": "USD",
      "createdAt": "2025-10-28T10:00:00.000Z",
      "product": {
        "title": "Product Name",
        "imageUrl": "https://..."
      }
    }
  ]
}
```

#### 2. Get All Earnings History
```http
GET /payouts/seller/all?sellerId={userId}
```

Returns all order items (pending and paid) for reconciliation.

#### 3. Download CSV Export
```http
GET /payouts/seller/csv?sellerId={userId}
```

Returns CSV file with columns:
- orderItemId
- orderId
- productTitle
- qty
- unitPrice
- gross
- fee
- net
- currency
- payoutStatus
- payoutBatchId
- paidAt
- createdAt

**Use cases:**
- Bank transfer batch processing
- Mobile money upload (M-Pesa, MoMo)
- Accounting reconciliation
- Tax reporting

### Admin Endpoints

#### 1. Mark Items as Paid Out
```http
POST /payouts/admin/mark-paid
Content-Type: application/json

{
  "orderItemIds": ["oi_123", "oi_456", "oi_789"],
  "batchId": "2025-10-28-run-1"
}
```

**Response:**
```json
{
  "batchId": "2025-10-28-run-1",
  "paidAt": "2025-10-28T15:30:00.000Z",
  "count": 3,
  "lines": [
    {
      "id": "oi_123",
      "sellerId": "user_789",
      "netAmount": "53.982",
      "currency": "USD",
      "payoutBatchId": "2025-10-28-run-1",
      "paidAt": "2025-10-28T15:30:00.000Z",
      "product": {
        "title": "Product Name"
      }
    }
  ]
}
```

#### 2. Get Payout Summary for All Sellers
```http
GET /payouts/admin/summary
```

**Response:**
```json
[
  {
    "sellerId": "user_123",
    "sellerName": "John Doe",
    "sellerEmail": "john@example.com",
    "totalNet": 371.25,
    "currency": "USD",
    "count": 12
  },
  {
    "sellerId": "user_456",
    "sellerName": "Jane Smith",
    "sellerEmail": "jane@example.com",
    "totalNet": 589.40,
    "currency": "USD",
    "count": 18
  }
]
```

---

## How It Works

### Order Creation Flow

When a buyer places an order:

1. **Cart items are fetched** with product details
2. **For each cart item:**
   - Get seller ID from product
   - Calculate gross: `price × quantity`
   - Calculate fee: `gross × 0.10` (10% commission)
   - Calculate net: `gross - fee`
3. **OrderItem is created** with earnings data:
   ```typescript
   await tx.orderItem.create({
     data: {
       orderId: order.id,
       productId: item.productId,
       qty: item.qty,
       price: item.product.price,
       // Earnings tracking
       sellerId: item.product.sellerId,
       grossAmount: gross,
       feeAmount: fee,
       netAmount: net,
       payoutStatus: 'PENDING',
       currency: item.product.currency,
     },
   });
   ```

4. **Data is denormalized** - seller ID and prices are snapshotted so future changes don't affect historical earnings

### Seller Earnings View

Sellers see their dashboard with:

1. **Three summary cards:**
   - Gross Sales (blue): Total revenue
   - Marketplace Fees (orange): 10% commission
   - Net Earnings (green): What they're owed

2. **Pending items count** and payout information

3. **CSV download button** for accounting

### Finance/Admin Workflow

To pay sellers:

1. **View pending payouts:**
   ```bash
   curl http://localhost:4000/payouts/admin/summary
   ```

2. **Download seller CSV** or use API data

3. **Process payments** via:
   - Bank transfer
   - Mobile money (M-Pesa, MoMo, Airtel Money)
   - PayPal / Wise / Payoneer
   - Cryptocurrency

4. **Mark items as paid:**
   ```bash
   curl -X POST http://localhost:4000/payouts/admin/mark-paid \
     -H "Content-Type: application/json" \
     -d '{
       "orderItemIds": ["oi_123", "oi_456"],
       "batchId": "2025-10-28-run-1"
     }'
   ```

5. **Items are updated:**
   - `payoutStatus`: PENDING → PAID_OUT
   - `paidAt`: Current timestamp
   - `payoutBatchId`: For audit trail

---

## UI Features

### Seller Dashboard Earnings Section

**Location:** `/seller`

**Visual Design:**
- Three colored cards (blue, orange, green) for gross/fee/net
- Clear visual hierarchy with large numbers
- Support for dark mode
- Responsive grid layout

**States:**
1. **Loading**: Shows "Loading earnings data..."
2. **No earnings**: "No pending earnings yet. Start selling to earn!"
3. **Has earnings**: Shows full earnings breakdown with CSV download

**CSV Download:**
- One-click download
- Opens in new tab
- Automatically named: `payouts-{sellerId}.csv`
- Contains all earnings history

---

## Commission Model

### Current: 10% Flat Commission

```typescript
const fee = gross * 0.10; // 10% marketplace fee
const net = gross - fee;   // Seller receives 90%
```

**Example:**
- Product price: $50
- Quantity: 2
- Gross: $100
- Fee: $10 (10%)
- Net: $90 (seller receives)

### Future: Dynamic Commission

You can extend this to support:

**Tiered Commission (volume-based):**
```typescript
function calculateFee(gross: number, sellerTier: string) {
  switch (sellerTier) {
    case 'BRONZE': return gross * 0.10; // 10%
    case 'SILVER': return gross * 0.08;  // 8%
    case 'GOLD':   return gross * 0.05;  // 5%
    default:       return gross * 0.10;
  }
}
```

**Category-based Commission:**
```typescript
const categoryRates = {
  'electronics': 0.12,  // 12%
  'fashion': 0.08,      // 8%
  'food': 0.15,         // 15%
};

const fee = gross * (categoryRates[product.category] || 0.10);
```

**Seller-specific Rates:**
```prisma
model User {
  commissionRate Decimal @default(0.10) // Seller-specific rate
}
```

---

## Testing

### 1. Create Test Order

```bash
# Add items to cart
curl -X POST http://localhost:4000/cart/add \
  -H "Content-Type: application/json" \
  -d '{
    "cartId": "cart_123",
    "productId": "prod_456",
    "qty": 2
  }'

# Create order
curl -X POST "http://localhost:4000/orders/create?cartId=cart_123" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user_789",
    "total": 100.00,
    "currency": "USD",
    "shippingAdr": "123 Main St"
  }'
```

### 2. Check Seller Earnings

```bash
curl "http://localhost:4000/payouts/seller/pending?sellerId=user_789"
```

**Expected Response:**
```json
{
  "currency": "USD",
  "totalGross": 100.00,
  "totalFees": 10.00,
  "totalNet": 90.00,
  "count": 1,
  "items": [...]
}
```

### 3. Download CSV

```bash
curl "http://localhost:4000/payouts/seller/csv?sellerId=user_789" > payouts.csv
```

### 4. Mark as Paid (Admin)

```bash
curl -X POST http://localhost:4000/payouts/admin/mark-paid \
  -H "Content-Type: application/json" \
  -d '{
    "orderItemIds": ["oi_123"],
    "batchId": "test-batch-1"
  }'
```

### 5. Verify Payout Status

```bash
curl "http://localhost:4000/payouts/seller/pending?sellerId=user_789"
```

**Expected:** `count: 0` (item is now PAID_OUT)

---

## Production Checklist

### Security

- [ ] **Add authentication guards** to all payout endpoints
- [ ] **Seller endpoints**: Verify `sellerId === session.user.id`
- [ ] **Admin endpoints**: Require `ADMIN` role
- [ ] **Rate limiting** on CSV downloads to prevent abuse
- [ ] **Audit logging** for all payout marking operations

### Database

- [ ] **Run migration**: `npx prisma migrate dev --name add_payout_tracking`
- [ ] **Add indexes** for fast queries:
  ```sql
  CREATE INDEX idx_orderitem_seller_payout
  ON "OrderItem" (sellerId, payoutStatus, createdAt);
  ```
- [ ] **Backfill existing orders** (if any) with earnings data

### Payout Processing

- [ ] **Integrate payment provider** (Stripe Connect, PayPal, Wise)
- [ ] **Set up payout schedule** (weekly, bi-weekly, monthly)
- [ ] **Configure minimum payout threshold** (e.g., $50 minimum)
- [ ] **Add payout methods** to seller profile (bank account, mobile money)
- [ ] **Implement payout notifications** (email when paid)

### Compliance

- [ ] **Tax reporting**: Generate 1099 forms (US) or equivalent
- [ ] **KYC/AML**: Verify seller identity before payouts
- [ ] **Transaction limits**: Comply with money transmission laws
- [ ] **Data retention**: Store payout records for audit (7+ years)

### UI Enhancements

- [ ] **Add payout history page** showing all past payouts
- [ ] **Show estimated payout date** based on schedule
- [ ] **Add filters** (date range, status)
- [ ] **Export to PDF** for invoicing
- [ ] **Show payout fee breakdown** if using third-party provider

---

## Payout Methods Implementation

### Option 1: Manual Bank Transfer

**Current implementation** - CSV export for manual processing:

1. Admin downloads CSV
2. Uploads to bank portal for batch transfer
3. Marks items as paid in SokoNova

**Pros:** No integration needed, works everywhere
**Cons:** Manual work, slow, error-prone

### Option 2: Stripe Connect

```typescript
// Add to payouts.service.ts
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function payoutViaSt ripe(sellerId: string, amount: number) {
  const seller = await this.prisma.user.findUnique({
    where: { id: sellerId },
    select: { stripeAccountId: true },
  });

  if (!seller.stripeAccountId) {
    throw new Error('Seller has not connected Stripe');
  }

  const transfer = await stripe.transfers.create({
    amount: Math.round(amount * 100), // Cents
    currency: 'usd',
    destination: seller.stripeAccountId,
  });

  return transfer;
}
```

**Pros:** Automated, reliable, global
**Cons:** Requires seller Stripe account, fees apply

### Option 3: Mobile Money (African Markets)

For M-Pesa, MoMo, Airtel Money integration:

```typescript
// Example: Flutterwave Transfer API
async function payoutViaMobileMoney(
  sellerId: string,
  amount: number,
  phoneNumber: string,
  provider: 'mpesa' | 'momo' | 'airtel',
) {
  const response = await fetch('https://api.flutterwave.com/v3/transfers', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      account_bank: provider,
      account_number: phoneNumber,
      amount,
      currency: 'KES', // or NGN, UGX, etc.
      narration: `SokoNova Payout - ${sellerId}`,
      beneficiary_name: seller.name,
    }),
  });

  return response.json();
}
```

**Pros:** Perfect for African sellers, low fees
**Cons:** Requires mobile money API integration

---

## Analytics & Reporting

### Seller Metrics

Track these KPIs per seller:

- **Total earnings (all-time)**
- **Average order value**
- **Commission percentage**
- **Payout frequency**
- **Outstanding balance**
- **Lifetime value**

### Platform Metrics

Track these for the marketplace:

- **Total GMV (Gross Merchandise Value)**
- **Total commission earned**
- **Average commission rate**
- **Payout processing time**
- **Outstanding payouts**
- **Payout completion rate**

### Implementation

Add to `payouts.service.ts`:

```typescript
async getSellerMetrics(sellerId: string) {
  const items = await this.prisma.orderItem.findMany({
    where: { sellerId },
  });

  return {
    totalEarnings: items.reduce((sum, it) => sum + Number(it.netAmount), 0),
    totalOrders: items.length,
    avgOrderValue: items.reduce((sum, it) => sum + Number(it.grossAmount), 0) / items.length,
    pendingPayout: items
      .filter(it => it.payoutStatus === 'PENDING')
      .reduce((sum, it) => sum + Number(it.netAmount), 0),
    totalCommissionPaid: items.reduce((sum, it) => sum + Number(it.feeAmount), 0),
  };
}
```

---

## Future Enhancements

### 1. **Automated Payout Scheduling**
- Weekly/monthly auto-payouts
- Minimum balance threshold
- Email notifications before payout
- Failed payout retry logic

### 2. **Payout Methods Management**
- Sellers add bank account details
- Support multiple payout methods
- Default payout method selection
- Verification via micro-deposits

### 3. **Tax Management**
- Automatic tax withholding
- W-9 / W-8 form collection (US)
- 1099-K generation
- International tax compliance

### 4. **Dispute Resolution**
- Payout holds for disputes
- Escrow for refund protection
- Chargeback handling
- Reserve balance management

### 5. **Advanced Commission**
- Tiered rates based on volume
- Category-specific rates
- Promotional rate adjustments
- Seller-specific rate negotiation

---

## Troubleshooting

### Issue: Earnings not showing in dashboard

**Cause:** Order items created before migration don't have earnings data

**Solution:** Backfill existing orders:
```typescript
// Run this as a one-time migration
async function backfillEarnings() {
  const items = await prisma.orderItem.findMany({
    where: {
      grossAmount: null, // Items without earnings data
    },
    include: { product: true },
  });

  for (const item of items) {
    const gross = Number(item.price) * item.qty;
    const fee = gross * 0.10;
    const net = gross - fee;

    await prisma.orderItem.update({
      where: { id: item.id },
      data: {
        sellerId: item.product.sellerId,
        grossAmount: gross,
        feeAmount: fee,
        netAmount: net,
        payoutStatus: 'PAID_OUT', // Assume historical orders are paid
        currency: item.product.currency,
      },
    });
  }
}
```

### Issue: CSV download returns 0 bytes

**Cause:** Seller has no order items

**Solution:** Check seller has products and orders:
```bash
curl "http://localhost:4000/seller/products?sellerId=USER_ID"
```

### Issue: Payout totals don't match order totals

**Cause:** Multi-seller orders split across sellers

**Solution:** This is expected! Order total = sum of all sellers' gross amounts:
```
Order total: $200
- Seller A gross: $120 → fee $12 → net $108
- Seller B gross: $80  → fee $8  → net $72
Platform earns: $20 total commission
```

---

## Summary

The Commission & Payouts system provides:

✅ **Automatic earnings tracking** per order item
✅ **10% marketplace commission** with net calculation
✅ **Seller earnings dashboard** with CSV export
✅ **Admin payout management** with batch processing
✅ **Audit trail** with batch IDs and timestamps
✅ **Mobile money ready** for African markets
✅ **Production-ready foundation** for automated payouts

This transforms SokoNova from a demo into a **real marketplace business** with:
- Clear revenue model (10% commission)
- Seller trust (transparent earnings)
- Finance operations (CSV export, batch payouts)
- Scalable infrastructure (handles thousands of sellers)

**Next step:** Integrate automated payout provider (Stripe Connect / Flutterwave) to eliminate manual CSV processing.

---

**Built with:** NestJS, Prisma, PostgreSQL, TypeScript, Next.js
