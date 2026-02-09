# 📊 Seller Verification Flow Diagram

## Complete End-to-End Process

```
┌─────────────────────────────────────────────────────────────────┐
│                    SELLER VERIFICATION FLOW                      │
└─────────────────────────────────────────────────────────────────┘

┌─────────────┐
│   BUYER     │ (User wants to become a seller)
│   (User)    │
└──────┬──────┘
       │
       │ 1. Navigate to /sell page
       ▼
┌─────────────────────────────────────┐
│  SELLER APPLICATION FORM            │
│  (/sell)                            │
│                                     │
│  Step 1: Basic Info                │
│  - Business Name                    │
│  - Contact Name                     │
│  - Email & Phone                    │
│                                     │
│  Step 2: Business Details          │
│  - Business Type                    │
│  - Country & City                   │
│  - Product Categories              │
│                                     │
│  Step 3: Additional Info           │
│  - Business Description            │
│  - Experience Level                │
│  - Expected Sales Volume           │
│                                     │
└──────────────┬──────────────────────┘
               │
               │ 2. Submit Application
               ▼
┌─────────────────────────────────────┐
│  BACKEND API                        │
│  POST /seller-applications/apply    │
│                                     │
│  - Validates data                   │
│  - Creates SellerApplication        │
│  - Status: PENDING                  │
│  - Links to User ID                 │
└──────────────┬──────────────────────┘
               │
               │ 3. Confirmation
               ▼
┌─────────────────────────────────────┐
│  SUCCESS TOAST NOTIFICATION         │
│  "Application submitted! We will    │
│   review within 2-3 business days"  │
└─────────────────────────────────────┘
               │
               │ 4. Admin reviews
               ▼
┌─────────────────────────────────────┐
│  ADMIN PANEL                        │
│  (/admin/seller-approval)           │
│                                     │
│  📊 Stats Dashboard                 │
│  - Pending: 5 applications          │
│  - Approved: 150 sellers           │
│  - Rejected: 12 applications       │
│                                     │
│  📋 Pending Applications List       │
│  ┌─────────────────────────────┐   │
│  │ ✓ Test Electronics Store    │   │
│  │   John Doe                   │   │
│  │   📧 john@test.com          │   │
│  │   📱 +234 123 456 7890      │   │
│  │   🏢 Electronics            │   │
│  │   📍 Lagos, Nigeria         │   │
│  │                              │   │
│  │   [Approve] [Reject] [View] │   │
│  └─────────────────────────────┘   │
└──────────────┬──────────────────────┘
               │
        ┌──────┴──────┐
        │             │
        ▼             ▼
   ┌─────────┐   ┌─────────┐
   │ APPROVE │   │ REJECT  │
   └────┬────┘   └────┬────┘
        │             │
        │             │ 5b. Provide reason
        │             ▼
        │        ┌─────────────────────┐
        │        │ REJECTION MODAL     │
        │        │ - Required: Reason  │
        │        │ - Email sent        │
        │        └──────────┬──────────┘
        │                   │
        │ 5a. Optional note ▼
        ▼        ┌─────────────────────┐
   ┌─────────────────────┐             │
   │ APPROVAL MODAL      │             │
   │ - Optional: Note    │             │
   │ - Confirm action    │             │
   └──────────┬──────────┘             │
              │                        │
              │                        │
              ▼                        ▼
   ┌─────────────────────┐  ┌─────────────────────┐
   │ BACKEND API         │  │ BACKEND API         │
   │ PATCH :id/approve   │  │ PATCH :id/reject    │
   │                     │  │                     │
   │ Transaction:        │  │ Updates:            │
   │ 1. Update app       │  │ 1. Update app       │
   │    status=APPROVED  │  │    status=REJECTED  │
   │ 2. Update user      │  │ 2. Store reason     │
   │    role=SELLER      │  │ 3. Send email       │
   │ 3. Send welcome     │  │                     │
   └──────────┬──────────┘  └──────────┬──────────┘
              │                        │
              │                        │
              ▼                        ▼
   ┌─────────────────────┐  ┌─────────────────────┐
   │  ✅ SUCCESS!        │  │  ❌ REJECTED        │
   │                     │  │                     │
   │  User promoted to:  │  │  User remains:      │
   │  🎉 SELLER          │  │  👤 BUYER           │
   │                     │  │                     │
   │  Access granted:    │  │  Can reapply after  │
   │  - /seller          │  │  addressing issues  │
   │  - Product mgmt     │  │                     │
   │  - Order mgmt       │  │                     │
   │  - Analytics        │  │                     │
   └─────────────────────┘  └─────────────────────┘
```

## Database Changes on Approval

```
BEFORE APPROVAL:
┌──────────────────────┐       ┌────────────────────────┐
│ User Table           │       │ SellerApplication      │
├──────────────────────┤       ├────────────────────────┤
│ id: "abc123"         │◄──────┤ userId: "abc123"       │
│ email: "john@..."    │       │ status: PENDING        │
│ role: BUYER          │       │ businessName: "..."    │
│ name: "John Doe"     │       │ submittedAt: ...       │
└──────────────────────┘       └────────────────────────┘

AFTER APPROVAL:
┌──────────────────────┐       ┌────────────────────────┐
│ User Table           │       │ SellerApplication      │
├──────────────────────┤       ├────────────────────────┤
│ id: "abc123"         │◄──────┤ userId: "abc123"       │
│ email: "john@..."    │       │ status: APPROVED ✓     │
│ role: SELLER ✓       │       │ businessName: "..."    │
│ name: "John Doe"     │       │ reviewedAt: NOW ✓      │
└──────────────────────┘       │ adminNote: "..." ✓     │
                               └────────────────────────┘
```

## API Endpoints Reference

### 1. Submit Application
```http
POST /seller-applications/apply
Content-Type: application/json

{
  "userId": "user-id",
  "businessName": "Test Store",
  "phone": "+234 123 456 7890",
  "country": "Nigeria",
  "city": "Lagos",
  "storefrontDesc": "Quality products"
}

Response: 201 Created
{
  "id": "app-id",
  "status": "PENDING",
  "createdAt": "2026-01-05T10:00:00Z"
}
```

### 2. List Pending (Admin Only)
```http
GET /seller-applications/pending?adminId=admin-user-id

Response: 200 OK
[
  {
    "id": "app-id",
    "userId": "user-id",
    "businessName": "Test Store",
    "status": "PENDING",
    "user": {
      "email": "john@test.com",
      "name": "John Doe"
    }
  }
]
```

### 3. Approve Application (Admin Only)
```http
PATCH /seller-applications/{id}/approve
Content-Type: application/json

{
  "adminId": "admin-user-id",
  "adminNote": "Approved - Welcome!"
}

Response: 200 OK
{
  "application": {
    "id": "app-id",
    "status": "APPROVED",
    "reviewedAt": "2026-01-05T11:00:00Z"
  },
  "user": {
    "id": "user-id",
    "role": "SELLER"
  }
}
```

### 4. Reject Application (Admin Only)
```http
PATCH /seller-applications/{id}/reject
Content-Type: application/json

{
  "adminId": "admin-user-id",
  "adminNote": "Incomplete documentation"
}

Response: 200 OK
{
  "id": "app-id",
  "status": "REJECTED",
  "adminNote": "Incomplete documentation",
  "reviewedAt": "2026-01-05T11:00:00Z"
}
```

## Authentication Flow

```
┌─────────────────────────────────────────┐
│  ALL API REQUESTS                        │
├─────────────────────────────────────────┤
│  Headers:                                │
│  Authorization: Bearer {JWT_TOKEN}       │
│  Content-Type: application/json          │
└──────────────────┬──────────────────────┘
                   │
                   ▼
           ┌───────────────┐
           │ JWT Validation │
           └───────┬────────┘
                   │
       ┌───────────┴───────────┐
       │                       │
       ▼                       ▼
   ┌────────┐            ┌────────┐
   │ VALID  │            │ INVALID│
   └───┬────┘            └───┬────┘
       │                     │
       ▼                     ▼
   ┌────────────┐        ┌──────────┐
   │ Check Role │        │ 401      │
   └─────┬──────┘        │ Unauthorized
         │               └──────────┘
    ┌────┴────┐
    │         │
    ▼         ▼
┌───────┐ ┌───────┐
│ ADMIN │ │ OTHER │
└───┬───┘ └───┬───┘
    │         │
    ▼         ▼
┌─────────┐ ┌──────────┐
│ ALLOWED │ │ 403      │
└─────────┘ │ Forbidden│
            └──────────┘
```

## Frontend Components Involved

```
sokonova-frontend/
├── src/
│   ├── pages/
│   │   ├── sell/
│   │   │   └── page.tsx                    # Application form
│   │   └── admin/
│   │       └── seller-approval/
│   │           └── page.tsx                # Admin approval panel
│   ├── components/
│   │   └── base/
│   │       └── Toast.tsx                   # Success/error notifications
│   └── lib/
│       ├── services/
│       │   └── adminService.ts             # Admin API calls
│       └── api.ts                          # HTTP client
```

## Backend Components Involved

```
backend/
└── src/
    └── modules/
        ├── seller-applications/
        │   ├── seller-applications.controller.ts    # API endpoints
        │   ├── seller-applications.service.ts       # Business logic
        │   └── dto/
        │       ├── apply.dto.ts                     # Application data
        │       └── moderate.dto.ts                  # Admin decision data
        └── prisma.service.ts                        # Database client
```

## Security Considerations

✅ **Authentication**: JWT token required for all API calls
✅ **Authorization**: Only ADMIN users can approve/reject
✅ **Validation**: Data validated at both frontend and backend
✅ **Audit Trail**: All actions logged with timestamp and admin ID
✅ **Email Verification**: User email validated before approval
✅ **Role Enforcement**: Guards prevent unauthorized access
