# Seller Verification Guide

## Overview
This guide explains how to verify and approve seller applications in SOKONOVA.

## 🚀 Quick Start

### 1. Access Admin Panel
- URL: **http://localhost:3002/admin/seller-approval**
- Requires: **ADMIN** role

### 2. Review Applications
The admin panel shows three tabs:
- **Pending**: New applications awaiting review
- **Approved**: Verified sellers actively selling
- **Rejected**: Declined applications with reasons

## 📝 Approval Process

### What to Check Before Approving:
✅ Business name and contact info are complete
✅ Valid email address and phone number
✅ Product categories are appropriate
✅ Business description is clear and legitimate
✅ Experience level is documented
✅ Location/country information is provided

### How to Approve:
1. Review application details
2. Click **"Approve"** button
3. (Optional) Add approval notes
4. Click **"Confirm Approval"**

**What happens next:**
- User's role changes from BUYER → SELLER
- Welcome email sent with onboarding instructions
- Seller can access seller dashboard at `/seller`
- Seller can start listing products

### How to Reject:
1. Click **"Reject"** button
2. **Provide detailed reason** (required)
3. Click **"Confirm Rejection"**

**What happens next:**
- Application marked as rejected
- User receives email with rejection reason
- User can reapply after addressing issues

## 🔧 Backend API

### List Pending Applications
```bash
GET http://localhost:4000/seller-applications/pending?adminId={YOUR_ADMIN_ID}
```

### Approve Application
```bash
PATCH http://localhost:4000/seller-applications/:id/approve
Content-Type: application/json

{
  "adminId": "YOUR_ADMIN_ID",
  "note": "Approved - Welcome to SOKONOVA!"
}
```

### Reject Application
```bash
PATCH http://localhost:4000/seller-applications/:id/reject
Content-Type: application/json

{
  "adminId": "YOUR_ADMIN_ID",
  "reason": "Incomplete business documentation"
}
```

## 🎯 Testing the Flow

### Step 1: Submit Test Application
1. Open http://localhost:3002/sell
2. Fill out the application form:
   - **Business Name**: Test Electronics Store
   - **Contact Name**: John Doe
   - **Email**: john@teststore.com
   - **Phone**: +234 123 456 7890
   - **Business Type**: Small Business
   - **Country**: Nigeria
   - **City**: Lagos
   - **Categories**: Electronics
   - **Description**: Selling quality electronics
   - **Monthly Volume**: $2,000 - $5,000
   - **Experience**: 1-3 years
3. Click **Submit Application**

### Step 2: Create Admin User (if needed)
```bash
# Connect to your database and run:
UPDATE "User"
SET role = 'ADMIN'
WHERE email = 'your-email@example.com';
```

### Step 3: Review & Approve
1. Login as admin
2. Go to http://localhost:3002/admin/seller-approval
3. You should see the test application in **Pending** tab
4. Click **Approve**
5. Confirm approval

### Step 4: Verify Seller Access
1. Login as the approved user
2. Navigate to http://localhost:3002/seller
3. You should now see the seller dashboard
4. Start listing products!

## 📊 Application Data Structure

```typescript
interface SellerApplication {
  id: string;
  userId: string;              // User who applied
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  businessType: string;
  country: string;
  city: string;
  address?: string;
  productCategories: string[];
  businessDescription: string;
  website?: string;
  socialMedia?: string;
  monthlyVolume: string;
  experience: string;
  bankAccount?: string;
  taxId?: string;
  businessLicense?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  submittedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;         // Admin user ID
  rejectionReason?: string;
}
```

## 🔐 Security Notes

- Only users with **ADMIN** role can access `/admin/seller-approval`
- Approval/rejection actions are logged in audit logs
- Email notifications sent automatically on status change
- Rejected users can resubmit applications

## 📧 Email Notifications

### On Approval:
- Subject: "Welcome to SOKONOVA - Your Seller Application Approved!"
- Includes: Onboarding instructions, seller dashboard link, support contact

### On Rejection:
- Subject: "SOKONOVA Seller Application Status Update"
- Includes: Rejection reason, reapplication guidelines, appeal process

## 🐛 Troubleshooting

**Problem**: Can't see admin panel
**Solution**: Make sure your user has ADMIN role in database

**Problem**: No pending applications showing
**Solution**: Submit a test application first via /sell page

**Problem**: Approval button doesn't work
**Solution**: Check browser console for errors, verify backend is running on port 4000

**Problem**: User still has BUYER role after approval
**Solution**: Check seller-applications.service.ts updateUserRole() method

## 📞 Support

For issues or questions:
- Check backend logs: `backend.log`
- Check frontend console in browser DevTools
- Review API responses in Network tab
