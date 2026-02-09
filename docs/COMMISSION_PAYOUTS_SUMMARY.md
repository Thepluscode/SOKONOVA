# Commission & Payouts System - Implementation Summary

## 🎉 What's Been Built

You now have a **complete marketplace commission and payout system** that tracks seller earnings, calculates marketplace fees, and manages payouts.

This is the feature that transforms SokoNova from "a checkout flow" into **"a real marketplace business"**.

---

## ✅ Implementation Complete

### 1. Database Schema Extensions

**File:** [backend/prisma/schema.prisma](backend/prisma/schema.prisma)

Added to `OrderItem` model:
```prisma
sellerId        String        // Seller who owns the product
grossAmount     Decimal       // Total sales (price × qty)
feeAmount       Decimal       // Marketplace commission (10%)
netAmount       Decimal       // What seller receives
payoutStatus    PayoutStatus  // PENDING or PAID_OUT
payoutBatchId   String?       // For grouping payouts
paidAt          DateTime?     // When seller was paid
currency        String
```

Added `PayoutStatus` enum:
```prisma
enum PayoutStatus {
  PENDING
  PAID_OUT
}
```

### 2. Backend Payouts Module

**Files Created:**
- [backend/src/modules/payouts/payouts.service.ts](backend/src/modules/payouts/payouts.service.ts)
- [backend/src/modules/payouts/payouts.controller.ts](backend/src/modules/payouts/payouts.controller.ts)
- [backend/src/modules/payouts/payouts.module.ts](backend/src/modules/payouts/payouts.module.ts)
- [backend/src/modules/payouts/dto/mark-paid.dto.ts](backend/src/modules/payouts/dto/mark-paid.dto.ts)

**Service Methods:**
- `getPendingForSeller(sellerId)` - Get unpaid earnings summary
- `getAllForSeller(sellerId)` - Get complete earnings history
- `markPaidOut(orderItemIds, batchId)` - Admin: mark items as paid
- `getCsvForSeller(sellerId)` - Generate CSV export
- `getAdminSummary()` - Get payout summary for all sellers

### 3. Order Creation Logic Updated

**File:** [backend/src/modules/orders/orders.service.ts](backend/src/modules/orders/orders.service.ts)

Now automatically calculates and stores:
- **Gross amount**: `price × quantity`
- **Fee amount**: `gross × 0.10` (10% commission)
- **Net amount**: `gross - fee`
- **Seller ID**: Denormalized for fast queries

### 4. Frontend Seller Dashboard

**File:** [app/seller/seller-inner.tsx](app/seller/seller-inner.tsx)

Added **Earnings & Payouts** section with:
- Three colored summary cards (Gross / Fees / Net)
- Pending items count
- CSV download button
- Dark mode support
- Responsive layout

### 5. Frontend API Functions

**File:** [lib/api.ts](lib/api.ts)

Added payout endpoints:
- `sellerGetPendingPayout(sellerId)`
- `sellerGetAllPayouts(sellerId)`
- `sellerPayoutCsvUrl(sellerId)`
- `adminMarkPaidOut(orderItemIds, batchId)`
- `adminPayoutSummary()`

---

## 📊 New API Endpoints

### Seller Endpoints

```
GET  /payouts/seller/pending?sellerId=X     Get pending earnings
GET  /payouts/seller/all?sellerId=X         Get all earnings history
GET  /payouts/seller/csv?sellerId=X         Download CSV export
```

### Admin Endpoints

```
POST /payouts/admin/mark-paid               Mark items as paid out
GET  /payouts/admin/summary                 Get payout summary for all sellers
```

---

## 💰 How Commission Works

### 10% Marketplace Commission

When a buyer places an order:

**Example Order:**
- Product: Handmade Bag
- Price: $50
- Quantity: 2
- **Gross**: $100 (total sales)
- **Fee**: $10 (10% commission to SokoNova)
- **Net**: $90 (seller receives)

**Database Record:**
```json
{
  "orderId": "order_123",
  "productId": "prod_456",
  "sellerId": "user_789",
  "qty": 2,
  "price": "50.00",
  "grossAmount": "100.00",
  "feeAmount": "10.00",
  "netAmount": "90.00",
  "payoutStatus": "PENDING",
  "currency": "USD"
}
```

### Why Denormalize?

We snapshot everything at order time so:
- Future price changes don't affect historical earnings
- Future commission rate changes don't affect past orders
- Sellers can trust their earnings numbers
- Fast queries without joins

---

## 🎨 Seller Dashboard Experience

When sellers visit `/seller`, they see:

### Earnings Summary Cards

**Gross Sales** (Blue Card)
- Total revenue from all sales
- Example: "USD 412.50"

**Marketplace Fees** (Orange Card)
- 10% commission to SokoNova
- Example: "USD 41.25"

**Your Net Earnings** (Green Card)
- What the seller will receive
- Example: "USD 371.25"

### Payout Details

- "12 unpaid order items awaiting payout"
- "Payouts are typically processed weekly via bank transfer or mobile money"
- **Download CSV** button for accounting

### CSV Export Use Cases

The CSV download is for:
1. **Bank transfer batch processing** - Upload to bank portal
2. **Mobile money platforms** - M-Pesa, MoMo, Airtel Money
3. **Accounting reconciliation** - Import into QuickBooks, Xero
4. **Tax reporting** - Annual records

---

## 👨‍💼 Finance/Admin Workflow

### Manual Payout Process (Current)

1. **View pending payouts:**
   ```bash
   curl http://localhost:4000/payouts/admin/summary
   ```

   Response:
   ```json
   [
     {
       "sellerId": "user_123",
       "sellerName": "John Doe",
       "sellerEmail": "john@example.com",
       "totalNet": 371.25,
       "currency": "USD",
       "count": 12
     }
   ]
   ```

2. **Download seller CSV** for batch payment

3. **Process payments** via:
   - Bank transfer
   - M-Pesa / MoMo
   - PayPal
   - Cryptocurrency

4. **Mark as paid:**
   ```bash
   curl -X POST http://localhost:4000/payouts/admin/mark-paid \
     -H "Content-Type: application/json" \
     -d '{
       "orderItemIds": ["oi_123", "oi_456"],
       "batchId": "2025-10-28-weekly-run"
     }'
   ```

5. **System updates:**
   - Sets `payoutStatus` to `PAID_OUT`
   - Stamps `paidAt` timestamp
   - Records `payoutBatchId` for audit

---

## 🚀 Testing the System

### 1. Create a Test Order

```bash
# Add product to cart
curl -X POST http://localhost:4000/cart/add \
  -H "Content-Type: application/json" \
  -d '{
    "cartId": "cart_abc",
    "productId": "prod_xyz",
    "qty": 2
  }'

# Create order
curl -X POST "http://localhost:4000/orders/create?cartId=cart_abc" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "buyer_123",
    "total": 100.00,
    "currency": "USD"
  }'
```

### 2. Check Seller Earnings

```bash
curl "http://localhost:4000/payouts/seller/pending?sellerId=seller_456"
```

**Expected:**
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

### 3. View in Seller Dashboard

1. Login as seller
2. Go to `/seller`
3. See earnings section with:
   - Gross: $100.00
   - Fees: $10.00
   - Net: $90.00

### 4. Download CSV

Click "Download CSV" button or:
```bash
curl "http://localhost:4000/payouts/seller/csv?sellerId=seller_456" > earnings.csv
```

### 5. Mark as Paid (Admin)

```bash
curl -X POST http://localhost:4000/payouts/admin/mark-paid \
  -H "Content-Type: application/json" \
  -d '{
    "orderItemIds": ["oi_xyz"],
    "batchId": "test-payout-1"
  }'
```

### 6. Verify Payout

```bash
curl "http://localhost:4000/payouts/seller/pending?sellerId=seller_456"
```

**Expected:** `count: 0` (no pending payouts)

---

## 📝 Database Migration

Before testing, run the migration:

```bash
cd backend
npx prisma migrate dev --name add_commission_payout_tracking
```

This will:
- Add new fields to `OrderItem` table
- Create `PayoutStatus` enum
- Update database schema

---

## 🎯 Production Deployment Checklist

### Security

- [ ] Add JWT authentication guards to payout endpoints
- [ ] Verify sellers can only see their own earnings
- [ ] Require ADMIN role for marking payouts
- [ ] Add rate limiting on CSV downloads
- [ ] Enable audit logging for payout operations

### Database

- [ ] Run migration on production database
- [ ] Add index on `(sellerId, payoutStatus, createdAt)`
- [ ] Backfill existing orders with earnings data (if any)

### Payout Processing

- [ ] Choose payout method:
  - Manual (CSV + bank transfer) ✅ Already implemented
  - Stripe Connect (automated)
  - Flutterwave (African markets)
  - PayPal Payouts
  - Wise (international)

- [ ] Set payout schedule:
  - Weekly (recommended for new marketplaces)
  - Bi-weekly
  - Monthly

- [ ] Configure minimum payout threshold:
  - e.g., $50 minimum to reduce transaction costs
  - Hold smaller amounts until threshold reached

- [ ] Add seller payout methods to profile:
  - Bank account details
  - Mobile money number
  - PayPal email
  - Cryptocurrency wallet

### Compliance

- [ ] Implement KYC verification for sellers
- [ ] Collect tax information (W-9, W-8 forms)
- [ ] Generate tax documents (1099-K for US)
- [ ] Store payout records for 7+ years
- [ ] Comply with money transmission regulations

### Notifications

- [ ] Email seller when payout is processed
- [ ] Weekly earnings summary emails
- [ ] SMS notifications for mobile money transfers
- [ ] Dashboard notifications for pending payouts

---

## 💡 Future Enhancements

### 1. Automated Payouts

Integrate with payment providers:

**Stripe Connect:**
```typescript
const transfer = await stripe.transfers.create({
  amount: Math.round(netAmount * 100),
  currency: 'usd',
  destination: seller.stripeAccountId,
});
```

**Flutterwave (Mobile Money):**
```typescript
const response = await fetch('https://api.flutterwave.com/v3/transfers', {
  method: 'POST',
  body: JSON.stringify({
    account_bank: 'mpesa',
    account_number: seller.phoneNumber,
    amount: netAmount,
    currency: 'KES',
  }),
});
```

### 2. Dynamic Commission Rates

**Tiered rates based on volume:**
- Bronze sellers: 10%
- Silver sellers (>50 sales): 8%
- Gold sellers (>200 sales): 5%

**Category-based rates:**
- Electronics: 12%
- Fashion: 8%
- Food: 15%

**Seller-specific rates:**
- Negotiate custom rates for high-volume sellers

### 3. Advanced Payout Features

- **Instant payouts** (premium feature, higher fee)
- **Reserve balance** for refund protection
- **Payout holds** during disputes
- **Split payouts** for co-owned products
- **Recurring payouts** on fixed schedule

### 4. Seller Analytics

- Total lifetime earnings
- Average order value
- Commission percentage over time
- Payout frequency
- Outstanding balance trends
- Revenue forecasting

### 5. Tax Management

- Automatic tax withholding
- International tax compliance
- W-9/W-8 form collection
- 1099-K generation
- VAT/GST calculation

---

## 📚 Documentation

| File | Purpose |
|------|---------|
| [PAYOUTS_COMMISSION.md](PAYOUTS_COMMISSION.md) | Complete technical guide |
| [COMMISSION_PAYOUTS_SUMMARY.md](COMMISSION_PAYOUTS_SUMMARY.md) | This file - quick summary |
| [SELLER_PORTAL.md](SELLER_PORTAL.md) | Seller portal guide |
| [INTEGRATION_COMPLETE.md](INTEGRATION_COMPLETE.md) | All integrations overview |

---

## 🎊 What This Achieves

### For Sellers
✅ **Transparent earnings** - See exactly what they're owed
✅ **Trust** - Clear breakdown of fees
✅ **CSV export** - For their own accounting
✅ **Professional experience** - Real marketplace feeling

### For Platform
✅ **Revenue model** - 10% commission on all sales
✅ **Scalable operations** - CSV export for batch payouts
✅ **Audit trail** - Batch IDs and timestamps
✅ **Finance ready** - Easy to reconcile and report

### For Growth
✅ **Seller recruitment** - "You'll earn 90% of each sale"
✅ **Investor pitch** - "We take 10% commission on $X GMV"
✅ **Operational efficiency** - Automated earnings calculation
✅ **Compliance ready** - Full transaction history

---

## 🚀 Next Steps

### Immediate (This Week)

1. **Run database migration**
   ```bash
   cd backend
   npx prisma migrate dev --name add_commission_payout_tracking
   ```

2. **Test the complete flow**
   - Create order
   - Check seller earnings
   - Download CSV
   - Mark as paid

3. **Add authentication guards**
   - Protect seller endpoints
   - Add admin role check

### Short-term (This Month)

1. **Choose payout provider**
   - Stripe Connect for global
   - Flutterwave for Africa
   - Manual CSV for MVP

2. **Set payout schedule**
   - Weekly payouts recommended
   - Minimum $50 threshold

3. **Add seller notifications**
   - Email when paid
   - Weekly earnings summary

### Long-term (This Quarter)

1. **Automate payouts** with payment provider
2. **Add dynamic commission rates** (tiered/category)
3. **Build seller analytics** dashboard
4. **Implement tax compliance** (1099-K, VAT)
5. **Add reserve balance** for refund protection

---

## 💬 Common Questions

**Q: Can I change the commission rate?**
A: Yes! Update the calculation in [backend/src/modules/orders/orders.service.ts](backend/src/modules/orders/orders.service.ts):
```typescript
const fee = gross * 0.15; // Change to 15%
```

**Q: How do I backfill existing orders?**
A: See the backfill script in [PAYOUTS_COMMISSION.md](PAYOUTS_COMMISSION.md) under "Troubleshooting"

**Q: Can sellers have different commission rates?**
A: Yes! Add a `commissionRate` field to the User model and use it in the calculation.

**Q: How do I integrate Stripe Connect?**
A: See the Stripe Connect implementation example in [PAYOUTS_COMMISSION.md](PAYOUTS_COMMISSION.md) under "Payout Methods Implementation"

**Q: What about refunds?**
A: You'll want to:
1. Create a `Refund` model
2. Track `refundAmount` per order item
3. Adjust seller earnings accordingly
4. Hold a reserve balance for potential refunds

---

## 🎉 Summary

You've just implemented a **complete marketplace commission and payout system** that includes:

✅ 10% marketplace commission (configurable)
✅ Automatic earnings calculation per order
✅ Seller earnings dashboard with CSV export
✅ Admin payout management with batch processing
✅ Full audit trail with timestamps and batch IDs
✅ Production-ready foundation for automated payouts
✅ Mobile money ready for African markets

**This is the feature that makes sellers care about your platform.**

Now sellers can answer: **"How much did I earn, and when do I get paid?"**

---

**Status:** ✅ Implementation Complete | 🚀 Ready for Testing & Deployment

**Built with:** NestJS, Prisma, PostgreSQL, TypeScript, Next.js, Tailwind CSS
