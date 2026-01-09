# Notification System Testing Guide

## Overview

This guide provides step-by-step instructions for testing the complete notification system in the SokoNova marketplace platform. The system includes in-app, email, and SMS notifications for all key marketplace events.

## Prerequisites

Before testing, ensure:
1. Backend server is running (`npm run start:dev` in backend directory)
2. Frontend server is running (`npm run dev` in root directory)
3. External providers are configured (SendGrid for email, Africa's Talking for SMS)
4. Database is seeded with test users and data
5. You have access to test accounts for buyer, seller, and admin roles

## Test Accounts

Use these demo credentials for testing:

### Buyer Account
- Email: `buyer@sokonova.dev`
- Password: `buyer123`
- Role: BUYER

### Seller Account
- Email: `seller@sokonova.dev`
- Password: `seller123`
- Role: SELLER

### Admin Account
- Email: `admin@sokonova.dev`
- Password: `admin123`
- Role: ADMIN

## Test Scenarios

### 1. Order Placement Flow

**Objective**: Verify payment notifications to buyer and seller

**Steps**:
1. Log in as buyer (`buyer@sokonova.dev`)
2. Browse products and add one to cart
3. Proceed to checkout
4. Complete payment (use test card details)
5. Check notifications:

**Expected Results**:
- ✅ Buyer receives in-app notification: "Payment Received"
- ✅ Buyer receives email: "Payment Received"
- ✅ Seller receives in-app notification: "New Paid Order"
- ✅ Seller receives email: "New Paid Order"

### 2. Fulfillment Flow

**Objective**: Verify shipping and delivery notifications

**Steps**:
1. Log in as seller (`seller@sokonova.dev`)
2. Navigate to fulfillment queue
3. Mark an item as "Shipped" with tracking info
4. Check notifications:
5. Later, mark the same item as "Delivered"
6. Check notifications:

**Expected Results**:
- ✅ Buyer receives in-app notification: "Order Shipped"
- ✅ Buyer receives SMS: "Your order has been shipped..."
- ✅ Buyer receives email with tracking info (if provided)
- ✅ Buyer receives in-app notification: "Order Delivered"
- ✅ Buyer receives email: "Your order has been delivered"

### 3. Dispute Flow

**Objective**: Verify dispute notifications to seller and resolution notifications to buyer

**Steps**:
1. Log in as buyer
2. Navigate to order history
3. Open dispute on a delivered item
4. Check seller notifications:
5. Log in as seller or admin
6. Resolve the dispute
7. Check buyer notifications:

**Expected Results**:
- ✅ Seller receives in-app notification: "New Dispute"
- ✅ Seller receives email: "New Dispute"
- ✅ Buyer receives in-app notification: "Dispute Resolved"
- ✅ Buyer receives email: "Dispute Resolved"

### 4. Payout Flow

**Objective**: Verify payout notifications to seller

**Steps**:
1. Log in as admin (`admin@sokonova.dev`)
2. Navigate to Admin Dashboard > Payouts
3. Select pending payouts and mark as paid
4. Enter batch ID and process
5. Check seller notifications:

**Expected Results**:
- ✅ Seller receives in-app notification: "Payout Released"
- ✅ Seller receives email: "Payout Released"

### 5. Review Flow

**Objective**: Verify review notifications to seller

**Steps**:
1. Log in as buyer
2. Navigate to order history
3. Leave a review on a delivered item
4. Check seller notifications:

**Expected Results**:
- ✅ Seller receives in-app notification: "New Review"
- ✅ Seller receives email: "New Review" (optional - currently only in-app)

## Monitoring and Verification

### Backend Logs

Monitor backend logs for notification delivery status:

```bash
# In backend directory
npm run start:dev
```

Look for entries like:
```
[Nest] 12345 - NotificationsService: Created notification xxx for user yyy: Payment Received
[Nest] 12345 - EmailAdapter: Email sent successfully to user@example.com
[Nest] 12345 - SmsAdapter: SMS sent successfully to +234XXXXXXXXX
```

### Database Verification

Check the notifications table in the database:
```sql
SELECT * FROM "Notification" ORDER BY "createdAt" DESC LIMIT 10;
```

Verify:
- Notifications are created with correct userId, type, title, body
- Data field contains relevant metadata
- readAt is null for unread notifications

### API Endpoints

Test notification API endpoints directly:

1. **Get Notifications**
   ```
   GET /notifications?userId={userId}&limit=20
   ```

2. **Get Unread Count**
   ```
   GET /notifications/unread-count?userId={userId}
   ```

3. **Mark as Read**
   ```
   POST /notifications/{notificationId}/read
   Body: { "userId": "..." }
   ```

4. **Mark All as Read**
   ```
   POST /notifications/mark-all-read
   Body: { "userId": "..." }
   ```

## Frontend Verification

### Notification Bell

1. Log in as any user
2. Trigger a notification (e.g., place an order)
3. Observe:
   - ✅ Bell icon appears in navbar
   - ✅ Unread count badge appears
   - ✅ Count updates in real-time (polls every 30 seconds)
   - ✅ Clicking bell navigates to notifications page

### Notifications Page

1. Navigate to `/account/notifications`
2. Verify:
   - ✅ Page loads without errors
   - ✅ Notifications are displayed in reverse chronological order
   - ✅ Unread notifications are visually distinct
   - ✅ Timestamps are formatted correctly
   - ✅ "Mark as read" buttons work
   - ✅ "Mark all as read" button works
   - ✅ Empty state shows when no notifications exist

## Error Handling Tests

### External Provider Failures

1. Temporarily disable SendGrid API key
2. Place an order
3. Verify:
   - ✅ Payment still completes successfully
   - ✅ In-app notifications still work
   - ✅ Error logged: "SendGrid API key not found"
   - ✅ Email delivery skipped with warning

### Network Timeouts

1. Simulate network issues with external providers
2. Trigger notifications
3. Verify:
   - ✅ 5-second timeout enforced
   - ✅ Error logged: "Notification send timeout"
   - ✅ Core operations continue unaffected

### Quiet Hours

1. Set user quiet hours in database:
   ```sql
   UPDATE "User" 
   SET "quietHoursStart" = 22, "quietHoursEnd" = 8, "timezone" = 'Africa/Lagos'
   WHERE email = 'buyer@sokonova.dev';
   ```
2. Trigger notification during quiet hours
3. Verify:
   - ✅ In-app notifications still created
   - ✅ External notifications suppressed
   - ✅ Log entry: "Skipping external notifications during quiet hours"

## Performance Tests

### High Volume

1. Simulate multiple concurrent notifications
2. Monitor:
   - ✅ Response times remain acceptable
   - ✅ No database locking issues
   - ✅ External API rate limits respected
   - ✅ Memory usage stable

### Large Notification Lists

1. Create 100+ notifications for a user
2. Load notifications page
3. Verify:
   - ✅ Pagination works correctly
   - ✅ Page loads within 2 seconds
   - ✅ Memory usage reasonable

## Security Tests

### Notification Ownership

1. Try to access another user's notification
2. Verify:
   - ✅ API rejects requests with 403 Forbidden
   - ✅ Security logs entry
   - ✅ No data leakage

### Input Validation

1. Send malformed data to notification endpoints
2. Verify:
   - ✅ API validates input and returns 400 Bad Request
   - ✅ No SQL injection or XSS vulnerabilities
   - ✅ Error logs sanitized

## Troubleshooting

### Common Issues

1. **Notifications not appearing**
   - Check database for created notifications
   - Verify userId matches session
   - Check frontend console for errors

2. **Emails not sending**
   - Check SendGrid API key in environment
   - Verify sender authentication
   - Check SendGrid activity feed
   - Review backend logs for errors

3. **SMS not sending**
   - Check Africa's Talking credentials
   - Verify phone number format
   - Check account balance
   - Review backend logs for errors

4. **Frontend not updating**
   - Check polling interval (30 seconds)
   - Verify WebSocket/HTTP connection
   - Check browser console for errors
   - Clear localStorage and retry

### Debugging Tools

1. **Prisma Studio**
   ```bash
   npx prisma studio
   ```
   - View notifications table
   - Check user notification preferences
   - Verify data integrity

2. **Backend Logs**
   ```bash
   # In backend directory
   npm run start:dev
   ```
   - Monitor real-time notification processing
   - Identify delivery failures
   - Track performance metrics

3. **Database Queries**
   ```sql
   -- Check recent notifications
   SELECT * FROM "Notification" ORDER BY "createdAt" DESC LIMIT 5;
   
   -- Check user notification preferences
   SELECT email, "notifyEmail", "notifySms" FROM "User" WHERE email = 'buyer@sokonova.dev';
   
   -- Count unread notifications
   SELECT COUNT(*) FROM "Notification" WHERE "userId" = 'user-id' AND "readAt" IS NULL;
   ```

## Test Completion Checklist

Before marking notification system as complete, verify all tests pass:

### Core Functionality
- [ ] In-app notifications working
- [ ] Email notifications working
- [ ] SMS notifications working
- [ ] Notification bell updates in real-time
- [ ] Notifications page displays correctly
- [ ] Mark as read functionality works
- [ ] Mark all as read functionality works

### Integration Tests
- [ ] Order placement notifications
- [ ] Fulfillment notifications
- [ ] Dispute notifications
- [ ] Payout notifications
- [ ] Review notifications

### Error Handling
- [ ] External provider failures handled gracefully
- [ ] Network timeouts managed properly
- [ ] Quiet hours respected
- [ ] Security checks enforced

### Performance
- [ ] Page load times acceptable
- [ ] API response times reasonable
- [ ] Memory usage stable
- [ ] Concurrent operations work

### Security
- [ ] Notification ownership enforced
- [ ] Input validation working
- [ ] No data leakage
- [ ] Secure API endpoints

## Next Steps

After successful testing:
1. Document any issues found and resolutions
2. Update user documentation with notification features
3. Set up monitoring for production notification delivery
4. Create runbook for notification system maintenance
5. Plan for future enhancements (push notifications, WhatsApp, etc.)

For ongoing support, monitor:
- Delivery success rates
- User feedback on notification frequency
- Error rates and patterns
- Performance metrics during peak usage