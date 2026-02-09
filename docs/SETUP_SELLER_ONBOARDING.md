# Seller Onboarding — Quick Setup Guide

## ⚡ 5-Minute Setup

### Step 1: Run Migration (1 min)
```bash
cd backend
npx prisma migrate dev --name add_seller_applications
npx prisma generate
```

This adds the `SellerApplication` model and `ApplicationStatus` enum to your database.

### Step 2: Create Admin User (1 min)

You need at least one ADMIN user to review applications.

**Option A: Using Prisma Studio**
```bash
cd backend
npx prisma studio
```

1. Open the `User` model
2. Find your user (or create one)
3. Set `role` to `ADMIN`

**Option B: Using SQL**
```sql
UPDATE "User" SET role = 'ADMIN' WHERE email = 'your@email.com';
```

### Step 3: Start Services (1 min)
```bash
# Terminal 1 - Backend
cd backend
npm run start:dev

# Terminal 2 - Frontend
npm run dev
```

### Step 4: Test Application Flow (2 min)

1. **Login as buyer:**
   - Go to `http://localhost:3000/auth/login`
   - Use buyer credentials (role must be BUYER)

2. **Submit application:**
   - Click "Become a Seller" in navbar
   - Fill out application form
   - Submit

3. **Review as admin:**
   - Logout and login as admin
   - Click "Admin" in navbar
   - See pending application
   - Click "✓ Approve"

4. **Access seller dashboard:**
   - Logout and login as newly approved user
   - Click "Seller Dashboard" in navbar
   - Verify access to seller features

---

## 🎯 What You Get

### Public Application Form
- **URL:** `/sell/apply`
- **Visible to:** Logged-in BUYER users
- **Collects:** Business name, phone, location, product description
- **Shows:** Application status (PENDING/APPROVED/REJECTED)

### Admin Review Dashboard
- **URL:** `/admin/applications`
- **Visible to:** ADMIN users only
- **Features:**
  - View all pending applications
  - One-click approve/reject
  - Add optional notes
  - Automatic role promotion

### Role-Based Navigation
- **BUYER** sees: "Become a Seller" (green link)
- **SELLER** sees: "Seller Dashboard"
- **ADMIN** sees: "Admin" (review queue)

---

## 📊 API Endpoints

### Buyer
```bash
# Submit application
POST /seller-applications/apply

# Check status
GET /seller-applications/mine?userId={id}
```

### Admin
```bash
# Get pending queue
GET /seller-applications/pending?adminId={id}

# Approve
PATCH /seller-applications/{appId}/approve

# Reject
PATCH /seller-applications/{appId}/reject
```

---

## 🧪 Testing Commands

### Submit Test Application
```bash
curl -X POST http://localhost:4000/seller-applications/apply \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "USER_ID",
    "businessName": "Test Store",
    "phone": "+1234567890",
    "country": "Kenya",
    "city": "Nairobi",
    "storefrontDesc": "Handmade crafts and local goods"
  }'
```

### Check Application Status
```bash
curl "http://localhost:4000/seller-applications/mine?userId=USER_ID"
```

### Approve Application (Admin)
```bash
curl -X PATCH "http://localhost:4000/seller-applications/APP_ID/approve" \
  -H "Content-Type: application/json" \
  -d '{
    "adminId": "ADMIN_ID",
    "adminNote": "Welcome to SokoNova!"
  }'
```

---

## ⚠️ Troubleshooting

### Issue: "Application already submitted"
**Solution:** Check `/sell/apply` - you already have a pending/approved application.

### Issue: Can't access `/admin/applications`
**Solution:** Your user role must be ADMIN. Update in Prisma Studio or via SQL.

### Issue: User not promoted to SELLER after approval
**Solution:** Check the backend logs. Transaction may have failed. Manually promote:
```sql
UPDATE "User" SET role = 'SELLER' WHERE id = 'user_id';
```

### Issue: "Become a Seller" link not showing
**Solution:** Must be logged in with role = BUYER.

---

## 📚 Full Documentation

- **Complete Guide:** [SELLER_ONBOARDING.md](SELLER_ONBOARDING.md)
- **Main README:** [README.md](README.md)

---

## ✅ Next Steps

After setup, you can:

1. **Scale seller recruitment** - Share `/sell/apply` URL publicly
2. **Review applications** - Check `/admin/applications` daily
3. **Monitor quality** - Track approval rates and seller performance
4. **Add enhancements:**
   - Email notifications on approval/rejection
   - KYC document uploads
   - Automated pre-screening

---

**Status:** ✅ Setup Complete | 🚀 Ready for Seller Onboarding

**Last Updated:** 2025-10-28
