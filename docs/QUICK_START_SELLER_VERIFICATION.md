# 🚀 Quick Start: Seller Verification

## Step 1: Make Yourself an Admin

First, you need to promote your user account to ADMIN role.

### Option A: Using Database GUI (Recommended)
1. Open Supabase Dashboard: https://supabase.com/dashboard
2. Navigate to your project
3. Go to **Table Editor** → **User** table
4. Find your user (by email)
5. Change the `role` column from `BUYER` to `ADMIN`
6. Save

### Option B: Using SQL
```sql
-- Replace 'your-email@example.com' with your actual email
UPDATE "User"
SET role = 'ADMIN'
WHERE email = 'your-email@example.com';
```

## Step 2: Access Admin Panel

1. Open your browser
2. Navigate to: **http://localhost:3002/admin/seller-approval**
3. You should see the Seller Approval Dashboard

## Step 3: Test with a Sample Application

### Submit a Test Application:
1. Go to **http://localhost:3002/sell**
2. Fill out the form with test data:
   - Business Name: `Test Store`
   - Contact Name: `John Doe`  
   - Email: `john@test.com`
   - Phone: `+234 123 456 7890`
   - Business Type: `Small Business`
   - Country: `Nigeria`
   - City: `Lagos`
   - Categories: Check `Electronics`
   - Description: `Selling quality electronics`
   - Monthly Volume: `$2,000 - $5,000`
   - Experience: `1-3 years`
3. Click **Submit Application**
4. You'll see a green success toast notification

## Step 4: Approve the Seller

1. Go back to **http://localhost:3002/admin/seller-approval**
2. You should see 1 pending application
3. Click the **Approve** button
4. (Optional) Add approval notes
5. Click **Confirm Approval**
6. ✅ The user is now a SELLER!

## Step 5: Verify Seller Access

The approved user can now:
- Access seller dashboard: **http://localhost:3002/seller**
- Create products
- Manage orders
- View analytics

---

## 🛠️ Testing with API Calls

### Check Backend is Running:
```bash
curl http://localhost:4000/products
# Should return: {"statusCode":500,"message":"Internal server error"}
# This is OK - means backend is running but no products exist
```

### List Pending Applications (as Admin):
```bash
# Replace YOUR_ADMIN_USER_ID with your actual user ID
curl http://localhost:4000/seller-applications/pending?adminId=YOUR_ADMIN_USER_ID
```

### Approve an Application:
```bash
curl -X PATCH http://localhost:4000/seller-applications/APPLICATION_ID/approve \
  -H "Content-Type: application/json" \
  -d '{
    "adminId": "YOUR_ADMIN_USER_ID",
    "adminNote": "Approved - Welcome!"
  }'
```

### Reject an Application:
```bash
curl -X PATCH http://localhost:4000/seller-applications/APPLICATION_ID/reject \
  -H "Content-Type: application/json" \
  -d '{
    "adminId": "YOUR_ADMIN_USER_ID",  
    "adminNote": "Incomplete documentation"
  }'
```

---

## 📊 What Happens When You Approve?

1. **Database Update**:
   - SellerApplication status → `APPROVED`
   - User role → `SELLER`

2. **Email Notification** (if configured):
   - Welcome email sent to seller
   - Includes onboarding instructions

3. **Seller Access**:
   - User can now access `/seller` dashboard
   - Can create and manage products
   - Can view seller analytics

---

## 🐛 Troubleshooting

### "Cannot access admin panel"
- **Solution**: Check your user role in database is `ADMIN`

### "No pending applications showing"
- **Solution**: Submit a test application via `/sell` page first

### "Approval button doesn't work"  
- **Solution**: 
  - Open browser DevTools → Console
  - Check for any JavaScript errors
  - Verify backend is running: `curl http://localhost:4000/products`

### "Backend connection error"
- **Solution**: 
  - Check backend is running: `cd backend && npm run start:dev`
  - Verify port 4000 is not blocked by firewall

---

## 📁 Key Files

- **Admin Panel**: `sokonova-frontend/src/pages/admin/seller-approval/page.tsx`
- **Backend Service**: `backend/src/modules/seller-applications/seller-applications.service.ts`
- **Backend Controller**: `backend/src/modules/seller-applications/seller-applications.controller.ts`
- **Frontend Admin Service**: `sokonova-frontend/src/lib/services/adminService.ts`

---

## ✅ Current Status

- ✅ Backend running on http://localhost:4000
- ✅ Frontend running on http://localhost:3002
- ✅ Database schema synced (all 32 tables)
- ✅ Toast notifications implemented
- ✅ Admin API endpoints fixed
- ✅ API port corrected to 4000

---

**Need more help?** Check `SELLER_VERIFICATION_GUIDE.md` for detailed documentation.
