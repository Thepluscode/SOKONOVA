# Seller Onboarding & Application Review System

## Overview

The Seller Onboarding system enables **scalable seller recruitment with quality control**. Instead of manually vetting sellers via WhatsApp or email, buyers can apply through a public form, and admins review applications through a dashboard.

**Key Achievement:** Scale supply-side growth while maintaining marketplace quality through an approval workflow.

---

## What's Been Implemented

### 1. **Application Flow**
- Public application form at `/sell/apply`
- Buyers submit business info (name, location, phone, description)
- Application status tracking (PENDING → APPROVED/REJECTED)
- Automatic role promotion when approved (BUYER → SELLER)

### 2. **Admin Review Dashboard**
- Dedicated admin page at `/admin/applications`
- View all pending applications with full details
- One-click approve/reject with optional notes
- Automatic user promotion to SELLER role on approval

### 3. **Role-Based Navigation**
- Buyers see "Become a Seller" link in navbar
- Sellers see "Seller Dashboard" link
- Admins see "Admin" link for review queue

### 4. **Re-application Support**
- Rejected applicants can revise and resubmit
- Existing applications show current status
- Approved sellers can access seller dashboard immediately

---

## Architecture

### Database Schema

**SellerApplication Model**:
```prisma
model SellerApplication {
  id             String            @id @default(cuid())
  user           User              @relation(fields: [userId], references: [id])
  userId         String            @unique

  businessName   String
  phone          String
  country        String
  city           String
  storefrontDesc String            // what they sell / category focus
  status         ApplicationStatus @default(PENDING)

  adminNote      String?
  reviewedAt     DateTime?
  createdAt      DateTime          @default(now())
  updatedAt      DateTime          @updatedAt
}

enum ApplicationStatus {
  PENDING
  APPROVED
  REJECTED
}
```

**Key Design Decisions:**
- `userId @unique` - Each user can only have one live application
- `status` enum - Clear state machine (PENDING → APPROVED/REJECTED)
- `adminNote` - Feedback for applicants (approval welcome message or rejection reason)
- `reviewedAt` - Audit trail timestamp

### Backend Modules

```
backend/src/modules/seller-applications/
├── seller-applications.module.ts       # Module registration
├── seller-applications.service.ts      # Core business logic
├── seller-applications.controller.ts   # REST API endpoints
└── dto/
    ├── apply.dto.ts                    # Application submission validation
    └── moderate.dto.ts                 # Admin action validation
```

### Frontend Pages

```
app/
├── sell/apply/
│   └── page.tsx                        # Public application form
└── admin/applications/
    └── page.tsx                        # Admin review dashboard

components/Navbar.tsx                   # Role-based navigation links
lib/api.ts                              # API client functions
```

---

## API Endpoints

### Buyer Endpoints

#### Submit Application
```http
POST /seller-applications/apply
Content-Type: application/json

{
  "userId": "user_123",
  "businessName": "Nairobi Crafts Co.",
  "phone": "+254 712 345 678",
  "country": "Kenya",
  "city": "Nairobi",
  "storefrontDesc": "Handmade bags and leather goods sourced from local artisans. Average order: $50-200."
}
```

**Response:**
```json
{
  "id": "app_456",
  "userId": "user_123",
  "businessName": "Nairobi Crafts Co.",
  "phone": "+254 712 345 678",
  "country": "Kenya",
  "city": "Nairobi",
  "storefrontDesc": "...",
  "status": "PENDING",
  "adminNote": null,
  "reviewedAt": null,
  "createdAt": "2025-10-28T10:00:00.000Z",
  "updatedAt": "2025-10-28T10:00:00.000Z"
}
```

#### Check Application Status
```http
GET /seller-applications/mine?userId=user_123
```

**Response:**
```json
{
  "id": "app_456",
  "userId": "user_123",
  "status": "PENDING",
  "businessName": "Nairobi Crafts Co.",
  ...
}
```

### Admin Endpoints

#### Get Pending Applications
```http
GET /seller-applications/pending?adminId=admin_789
```

**Response:**
```json
[
  {
    "id": "app_456",
    "userId": "user_123",
    "businessName": "Nairobi Crafts Co.",
    "phone": "+254 712 345 678",
    "country": "Kenya",
    "city": "Nairobi",
    "storefrontDesc": "...",
    "status": "PENDING",
    "createdAt": "2025-10-28T10:00:00.000Z",
    "user": {
      "id": "user_123",
      "email": "john@example.com",
      "name": "John Doe",
      "role": "BUYER"
    }
  }
]
```

#### Approve Application
```http
PATCH /seller-applications/app_456/approve
Content-Type: application/json

{
  "adminId": "admin_789",
  "adminNote": "Welcome to SokoNova! Looking forward to your products."
}
```

**Response:**
```json
{
  "application": {
    "id": "app_456",
    "status": "APPROVED",
    "reviewedAt": "2025-10-28T15:30:00.000Z",
    "adminNote": "Welcome to SokoNova! Looking forward to your products.",
    ...
  },
  "user": {
    "id": "user_123",
    "email": "john@example.com",
    "name": "John Doe",
    "role": "SELLER"  // ← Promoted from BUYER
  }
}
```

#### Reject Application
```http
PATCH /seller-applications/app_456/reject
Content-Type: application/json

{
  "adminId": "admin_789",
  "adminNote": "Please provide more details about your sourcing and business registration."
}
```

**Response:**
```json
{
  "id": "app_456",
  "status": "REJECTED",
  "reviewedAt": "2025-10-28T15:30:00.000Z",
  "adminNote": "Please provide more details about your sourcing and business registration.",
  ...
}
```

---

## How It Works

### User Application Flow

1. **Buyer visits `/sell/apply`**
   - If not logged in, prompted to sign in first
   - If already applied, sees current status

2. **Buyer fills application form:**
   - Business/store name
   - Phone/WhatsApp
   - Country and city
   - Description of what they sell (sourcing, product focus, order size)

3. **Buyer submits application**
   - Backend creates `SellerApplication` with status PENDING
   - If user previously applied and was REJECTED, they can resubmit (upsert logic)

4. **Buyer sees confirmation**
   - "Application submitted. We'll review it shortly."
   - Can return to `/sell/apply` anytime to check status

### Admin Review Flow

1. **Admin visits `/admin/applications`**
   - Must be logged in with role = ADMIN
   - Sees list of all PENDING applications

2. **Admin reviews application details:**
   - Applicant email and name
   - Business name, location, phone
   - Description of what they sell

3. **Admin makes decision:**

   **Option A: Approve**
   - Clicks "✓ Approve"
   - Optional: Adds welcome note
   - Backend performs transaction:
     - Marks application APPROVED
     - Promotes user role to SELLER
   - Application removed from pending queue

   **Option B: Reject**
   - Clicks "✕ Reject"
   - Optional: Adds rejection reason
   - Backend marks application REJECTED
   - User can revise and resubmit

### Approved Seller Flow

1. **User refreshes `/sell/apply`**
   - Sees status: APPROVED
   - Sees "Go to Seller Dashboard" button

2. **User clicks through to `/seller`**
   - Now has access to seller features:
     - Product management
     - Inventory updates
     - Fulfillment queue
     - Earnings dashboard
     - Payout tracking

3. **Navbar updates automatically**
   - "Become a Seller" link replaced with "Seller Dashboard"

---

## UI Features

### Application Form (`/sell/apply`)

**For Buyers:**
- Clean, single-column form
- Required fields clearly marked
- Mobile-friendly design
- Real-time validation
- Submission confirmation message

**For Applicants with Existing Status:**
- Status badge (PENDING/APPROVED/REJECTED)
- Full application details displayed
- Admin notes visible (if any)
- "Go to Seller Dashboard" button (if approved)
- "Submit New Application" button (if rejected)

### Admin Review Dashboard (`/admin/applications`)

**Features:**
- Card-based layout for each application
- Application date displayed
- Applicant contact info highlighted
- Business description in expanded view
- Color-coded status badges
- Two-action buttons (Approve / Reject)
- Empty state when no applications pending
- Stats summary at bottom

**Security:**
- Only accessible to users with role = ADMIN
- Redirects non-admins to homepage
- Requires authentication

### Navigation Updates

**Role-Based Links:**
- **BUYER:** "Become a Seller" (green, highlighted)
- **SELLER:** "Seller Dashboard"
- **ADMIN:** "Admin" (links to review queue)

All links appear in desktop navbar, hidden on mobile (responsive design).

---

## Testing the System

### 1. Run Database Migration

```bash
cd backend
npx prisma migrate dev --name add_seller_applications
npx prisma generate
```

### 2. Create Test Users

Using Prisma Studio or direct SQL:

```sql
-- Create test buyer
INSERT INTO "User" (id, email, name, role)
VALUES ('buyer_test', 'buyer@test.com', 'Test Buyer', 'BUYER');

-- Create test admin
INSERT INTO "User" (id, email, name, role)
VALUES ('admin_test', 'admin@test.com', 'Test Admin', 'ADMIN');
```

### 3. Test Buyer Application

```bash
# Submit application
curl -X POST http://localhost:4000/seller-applications/apply \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "buyer_test",
    "businessName": "Test Store",
    "phone": "+1234567890",
    "country": "Kenya",
    "city": "Nairobi",
    "storefrontDesc": "Test products for development"
  }'

# Check status
curl "http://localhost:4000/seller-applications/mine?userId=buyer_test"
```

### 4. Test Admin Review

```bash
# Get pending applications
curl "http://localhost:4000/seller-applications/pending?adminId=admin_test"

# Approve application
curl -X PATCH "http://localhost:4000/seller-applications/{APP_ID}/approve" \
  -H "Content-Type: application/json" \
  -d '{
    "adminId": "admin_test",
    "adminNote": "Welcome!"
  }'
```

### 5. UI Testing

1. **Application Flow:**
   - Login as buyer
   - Visit `http://localhost:3000/sell/apply`
   - Fill form and submit
   - Verify confirmation message
   - Refresh page to see PENDING status

2. **Admin Flow:**
   - Login as admin
   - Visit `http://localhost:3000/admin/applications`
   - See pending application card
   - Click "Approve" with optional note
   - Verify application removed from queue

3. **Approved Seller:**
   - Login as newly approved user
   - Visit `/sell/apply` - should see APPROVED status
   - Click "Go to Seller Dashboard"
   - Verify access to `/seller`
   - Check navbar shows "Seller Dashboard" link

---

## Production Readiness

### Security

- [ ] **Add authentication guards** to all endpoints
  - Verify `userId` matches session user
  - Verify `adminId` belongs to ADMIN role user

- [ ] **Rate limiting** on application submission
  - Prevent spam applications
  - Max 1 application per user per day

- [ ] **Input sanitization**
  - Strip HTML/JavaScript from text fields
  - Validate phone number format
  - Validate country/city names

- [ ] **CSRF protection**
  - Add CSRF tokens to forms
  - Verify tokens on backend

### Notifications

- [ ] **Email notifications**
  - Send confirmation email on application submission
  - Notify applicant when reviewed (approved/rejected)
  - Include admin notes in email

- [ ] **SMS notifications** (optional)
  - SMS confirmation with application ID
  - SMS when approved with dashboard link

### Application Enhancements

- [ ] **File uploads**
  - Business registration documents
  - Product photos/samples
  - ID verification

- [ ] **KYC verification**
  - Collect tax ID / business license
  - Verify phone number via OTP
  - Verify email address

- [ ] **Application history**
  - Admin can see all applications (not just pending)
  - Filter by status, date, country
  - Export to CSV for compliance

- [ ] **Seller profile setup**
  - After approval, guide seller through profile completion
  - Store description, logo, banner
  - Payment details for payouts

### Analytics

- [ ] **Application metrics**
  - Approval rate (approved / total)
  - Average review time
  - Applications by country/city
  - Rejection reasons (tagged)

- [ ] **Seller onboarding funnel**
  - Applied → Approved → First Product → First Sale
  - Identify drop-off points
  - Optimize onboarding experience

---

## Future Enhancements

### 1. **Automated Pre-Screening**

Screen applications before showing to admin:

```typescript
async function preScreen(app: SellerApplication) {
  // Check for spam keywords
  if (containsSpam(app.storefrontDesc)) {
    await autoReject(app.id, 'Spam detected');
    return;
  }

  // Verify phone number
  const phoneValid = await twilioVerify(app.phone);
  if (!phoneValid) {
    await flagForReview(app.id, 'Phone verification failed');
  }

  // Check duplicate businesses
  const duplicate = await findDuplicateBusiness(app.businessName);
  if (duplicate) {
    await flagForReview(app.id, 'Possible duplicate');
  }
}
```

### 2. **Tiered Approval Levels**

Different seller tiers with different privileges:

```prisma
enum SellerTier {
  BASIC       // New sellers, limited products
  VERIFIED    // KYC complete, higher limits
  PREMIUM     // Proven track record, no limits
}

model SellerApplication {
  // ...
  approvedTier SellerTier?
}
```

### 3. **Interview Scheduling**

For high-value sellers, schedule video interviews:

```typescript
// Add to SellerApplication
interviewScheduledAt DateTime?
interviewNotes      String?
```

Admin can schedule Zoom/Meet call before final approval.

### 4. **Referral System**

Existing sellers refer new sellers:

```typescript
model SellerApplication {
  // ...
  referredBy String? // userId of referring seller
}

// Reward referring seller on first sale
```

### 5. **Application Templates**

Pre-fill form based on category:

- Crafts & Handmade
- Electronics
- Fashion & Apparel
- Food & Beverages

Each category has tailored questions.

---

## Troubleshooting

### Issue: "Application already submitted or approved"

**Cause:** User already has an application with status PENDING or APPROVED

**Solution:**
- If PENDING: Wait for review
- If APPROVED: Go to seller dashboard
- If REJECTED: Existing application form allows resubmission

### Issue: Admin dashboard is empty

**Cause:** No applications with status PENDING

**Solution:**
```bash
# Check if applications exist
curl "http://localhost:4000/seller-applications/pending?adminId=ADMIN_ID"

# If empty, submit test application as buyer
```

### Issue: User not promoted to SELLER after approval

**Cause:** Transaction may have failed or adminId not valid

**Solution:**
```sql
-- Check application status
SELECT * FROM "SellerApplication" WHERE id = 'app_id';

-- Check user role
SELECT id, email, role FROM "User" WHERE id = 'user_id';

-- Manually promote if needed
UPDATE "User" SET role = 'SELLER' WHERE id = 'user_id';
```

### Issue: Can't access admin dashboard

**Cause:** User role is not ADMIN

**Solution:**
```sql
-- Promote user to admin
UPDATE "User" SET role = 'ADMIN' WHERE email = 'your@email.com';
```

Then log out and log back in to refresh session.

---

## Benefits

### For Platform Operators
✅ **Scalable onboarding** - No manual WhatsApp conversations
✅ **Quality control** - Review applications before granting access
✅ **Fraud prevention** - Screen suspicious applications
✅ **Audit trail** - Track who approved what and when

### For Buyers (Applicants)
✅ **Self-service** - Apply anytime, anywhere
✅ **Transparency** - See application status in real-time
✅ **Fast approval** - Admin can review in minutes
✅ **Feedback** - Admin notes explain decisions

### For Admins
✅ **Organized queue** - All applications in one place
✅ **One-click actions** - Approve/reject with notes
✅ **Complete context** - See applicant profile and business details
✅ **Efficient workflow** - No context switching

---

## Summary

The Seller Onboarding & Application Review system provides:

✅ Public application form for buyers to apply as sellers
✅ Admin review dashboard with one-click approve/reject
✅ Automatic role promotion (BUYER → SELLER) on approval
✅ Application status tracking (PENDING → APPROVED/REJECTED)
✅ Re-application support for rejected applicants
✅ Role-based navigation (Become a Seller / Seller Dashboard / Admin)
✅ Complete audit trail with timestamps and admin notes

**This transforms seller recruitment from "1:1 WhatsApp chaos" to "scalable, quality-controlled onboarding."**

Platform operators can now onboard sellers at scale while maintaining marketplace quality standards.

---

## What's Next

With seller onboarding complete, you now have:

1. ✅ Cart & Checkout
2. ✅ Payment Processing
3. ✅ Seller Portal
4. ✅ Commission & Payouts
5. ✅ Fulfillment Tracking
6. ✅ **Seller Onboarding**

**Remaining high-value features:**

### Option 1: 🚨 Trust & Safety / Disputes
- Buyers flag issues ("not delivered," "damaged," "fake")
- Admin + seller see "Issues" queue
- Resolution workflow (refund/replacement)
- Reduces chargebacks, protects brand

### Option 2: 📱 Mobile-First Merchant Ops
- Lightweight seller dashboard optimized for phone
- Instant "mark shipped / mark delivered" from mobile
- Critical for African markets where sellers run businesses on WhatsApp

---

**Built with:** NestJS, Prisma, PostgreSQL, TypeScript, Next.js, React

**Status:** ✅ Implementation Complete | 🚀 Ready for Testing & Launch

**Last Updated:** 2025-10-28
