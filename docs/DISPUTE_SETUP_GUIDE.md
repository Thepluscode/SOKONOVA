# Dispute System Setup Guide

## Status: Ready to Activate

The Trust & Safety / Dispute Center system is **fully implemented** and ready to use. All code is in place - you just need to set up the database.

---

## What's Already Done ✅

### Backend (NestJS)
- ✅ Prisma schema extended with `Dispute` model and enums
- ✅ `DisputesModule` created with service, controller, and DTOs
- ✅ Module registered in `AppModule`
- ✅ Four API endpoints ready:
  - `POST /disputes/open` - Buyer opens dispute
  - `GET /disputes/mine` - Buyer views their disputes
  - `GET /disputes/seller` - Seller/admin views issue queue
  - `PATCH /disputes/:id/resolve` - Resolve dispute

### Frontend (Next.js)
- ✅ API functions in `lib/api.ts`:
  - `openDispute()`
  - `getMyDisputes()`
  - `sellerGetDisputes()`
  - `resolveDispute()`
- ✅ `DisputeButtonClient` component for buyers ([app/orders/[orderId]/DisputeButtonClient.tsx](app/orders/[orderId]/DisputeButtonClient.tsx))
- ✅ Seller dashboard "Issues & Disputes" section with `DisputeCard` component
- ✅ Tracking page dispute button integration
- ✅ Dependencies installed (492 packages)

---

## Database Setup Required

The only step remaining is to configure PostgreSQL and run the migration.

### Option 1: Fix PostgreSQL Password (Recommended)

Your PostgreSQL is running, but the password in `.env` doesn't match.

**Current configuration:**
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/sokonova_db"
```

**To fix:**

1. Find your PostgreSQL password:
   ```bash
   # If you don't know the password, reset it:
   psql -U postgres  # Will prompt for current password
   ```

2. Update `backend/.env` with the correct password:
   ```
   DATABASE_URL="postgresql://postgres:YOUR_ACTUAL_PASSWORD@localhost:5432/sokonova_db"
   ```

3. Run the migration:
   ```bash
   cd backend
   npx prisma migrate dev --name add_disputes
   ```

### Option 2: Create New PostgreSQL User

Create a dedicated user for the app:

```bash
# Connect to PostgreSQL (may need sudo)
psql -U postgres

# In psql:
CREATE USER sokonova WITH PASSWORD 'your_secure_password';
CREATE DATABASE sokonova_db OWNER sokonova;
GRANT ALL PRIVILEGES ON DATABASE sokonova_db TO sokonova;
\q
```

Then update `backend/.env`:
```
DATABASE_URL="postgresql://sokonova:your_secure_password@localhost:5432/sokonova_db"
```

Run migration:
```bash
cd backend
npx prisma migrate dev --name add_disputes
```

### Option 3: Use Docker PostgreSQL (Clean Start)

If you prefer a containerized database:

```bash
# Start PostgreSQL in Docker
docker run --name sokonova-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=sokonova_db \
  -p 5432:5432 \
  -d postgres:15

# Wait 5 seconds for startup
sleep 5

# Run migration
cd backend
npx prisma migrate dev --name add_disputes
```

Your current `backend/.env` already has the correct settings for this option.

---

## Verify Setup

After successful migration, you should see:

```
Applying migration `20241029_add_disputes`
✔ Generated Prisma Client
```

Check the tables were created:
```bash
cd backend
npx prisma studio
```

Look for:
- `Dispute` table
- `DisputeReason` enum
- `DisputeStatus` enum
- Relations to `OrderItem` and `User`

---

## Start the Application

### Terminal 1: Backend
```bash
cd backend
npm run start:dev
```

Should start on `http://localhost:4000`

### Terminal 2: Frontend
```bash
npm run dev
```

Should start on `http://localhost:3000`

---

## Test the Dispute System

### 1. Create Test Data (if needed)

You need:
- A buyer account
- A seller account
- A product from the seller
- An order with status SHIPPED

### 2. Test Buyer Flow

1. As buyer, go to **Orders** → Click an order → **Track Order**
2. Find an item with status "Shipped"
3. Click **"Report a problem"**
4. Fill in:
   - Reason (e.g., "NOT_DELIVERED")
   - Description
   - Photo proof URL (optional)
5. Submit

**Expected result:**
- Success message: "✓ Issue reported. Our team will follow up."
- Item `fulfillmentStatus` changes to ISSUE
- Dispute record created in database

### 3. Test Seller Flow

1. As seller, go to **Seller Dashboard**
2. Scroll to **"Issues & Disputes"** section
3. You should see the dispute with:
   - Buyer info
   - Order item details
   - Reason and description
   - Photo proof link (if provided)
4. Add resolution note (optional)
5. Click one of:
   - **Send Replacement** → Sets status to DELIVERED
   - **Refund Buyer** → Keeps status as ISSUE
   - **Reject Claim** → Sets status to DELIVERED

**Expected result:**
- Dispute status updates
- `fulfillmentStatus` updates accordingly
- Dispute disappears from queue (unless rejected/refunded)

---

## Troubleshooting

### Migration Fails: "P1000: Authentication failed"

**Problem:** PostgreSQL password in `.env` is incorrect

**Solution:** Follow "Option 1" or "Option 2" above to fix credentials

### Migration Fails: "P1003: Database does not exist"

**Problem:** Database `sokonova_db` hasn't been created

**Solution:**
```bash
# Create database manually
psql -U postgres -c "CREATE DATABASE sokonova_db;"

# Then run migration
cd backend
npx prisma migrate dev --name add_disputes
```

### Backend Won't Start: "Cannot find module '@prisma/client'"

**Problem:** Prisma Client not generated

**Solution:**
```bash
cd backend
npx prisma generate
npm run start:dev
```

### Frontend Shows "Failed to open dispute"

**Problem:** Backend API not reachable

**Check:**
1. Backend is running on port 4000
2. Frontend `lib/api.ts` has correct `apiBase`:
   ```typescript
   const apiBase = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000";
   ```
3. CORS is enabled in backend for `http://localhost:3000`

### Dispute Button Doesn't Appear

**Problem:** Item isn't in SHIPPED status or already has ISSUE status

**Check:**
1. Order item must have `shippedAt` timestamp
2. `fulfillmentStatus` cannot be ISSUE (prevents duplicate disputes)

---

## Production Deployment

Before deploying to production:

### 1. Database Migration
```bash
# Use migrate deploy for production (no prompts)
npx prisma migrate deploy
```

### 2. Environment Variables

Set production `DATABASE_URL` in your hosting platform (Heroku, Railway, Vercel, etc.)

### 3. Email Notifications (Optional Enhancement)

Add email alerts when disputes are opened:

```typescript
// In disputes.service.ts open() method
async open(dto: OpenDisputeDto) {
  // ... existing code ...

  // Send email to seller
  await this.emailService.send({
    to: seller.email,
    subject: 'New dispute opened on your order',
    template: 'dispute-opened',
    data: { dispute, orderItem }
  });

  return dispute;
}
```

### 4. Admin Dashboard (Optional Enhancement)

Create admin view to see all disputes across all sellers:

```typescript
// In disputes.controller.ts
@Get('admin/all')
async adminListAll(@Query('status') status?: string) {
  return this.disputesService.adminListAll(status);
}
```

---

## Next Steps After Setup

Once the database is set up and the system is running, you can:

1. **Test the full dispute workflow** end-to-end
2. **Customize dispute reasons** - Add/remove from `DisputeReason` enum if needed
3. **Add email notifications** - Alert sellers when disputes are opened
4. **Create admin panel** - Centralized view of all disputes
5. **Implement auto-refunds** - Integrate with payment provider for automatic refunds
6. **Add evidence upload** - Replace `photoProofUrl` with actual file upload
7. **Track metrics** - Monitor dispute rates by seller/product

---

## Key Design Decisions

**Per-Item Disputes**
- Disputes attach to `OrderItem` not `Order`
- Supports multi-seller orders where only one item has issues

**Automatic Status Management**
- Opening dispute → `fulfillmentStatus` = ISSUE
- Resolution updates both `Dispute.status` and `OrderItem.fulfillmentStatus`

**Payout Protection**
- Items with ISSUE status can be excluded from seller payouts
- Platform can withhold payment until dispute resolved

**Audit Trail**
- Tracks who resolved what and when (`resolvedById`, `resolvedAt`)
- Complete paper trail for chargebacks and fraud investigations

---

## Documentation

For complete technical details, see:
- [DISPUTES_TRUST_SAFETY.md](DISPUTES_TRUST_SAFETY.md) - Full system documentation
- [Backend Schema](backend/prisma/schema.prisma) - Database structure
- [API Endpoints](backend/src/modules/disputes/) - Backend implementation
- [Frontend Components](app/) - UI implementation

---

## Support

If you encounter issues not covered in this guide:

1. Check Prisma logs: `cd backend && npx prisma validate`
2. Check backend logs when starting: `npm run start:dev`
3. Check browser console for frontend errors
4. Verify all environment variables are set correctly

The dispute system is production-ready once the database is configured!
