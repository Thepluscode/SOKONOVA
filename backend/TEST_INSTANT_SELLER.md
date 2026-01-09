# Test Instant Seller Activation

## Quick Guide to Onboard Your First Sellers

### Step 1: Start the Backend
```bash
npm run dev
```

### Step 2: Create a Test User (if needed)
```bash
curl -X POST http://localhost:4000/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "seller1@test.com",
    "password": "password123",
    "name": "John Seller"
  }'
```

Save the `userId` from the response.

### Step 3: Instantly Activate as Seller
```bash
curl -X POST http://localhost:4000/seller-applications/activate-instant \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "YOUR_USER_ID_HERE",
    "businessName": "Johns Crafts",
    "phone": "+254712345678",
    "country": "Kenya",
    "city": "Nairobi",
    "storefrontDesc": "Handmade crafts and accessories",
    "bankName": "Equity Bank",
    "accountNumber": "1234567890",
    "accountName": "John Seller",
    "bankCode": "EQBLKENA"
  }'
```

### Expected Response
```json
{
  "success": true,
  "application": {
    "id": "...",
    "userId": "...",
    "businessName": "Johns Crafts",
    "status": "APPROVED",
    "bankName": "Equity Bank",
    "accountNumber": "1234567890"
  },
  "user": {
    "id": "...",
    "email": "seller1@test.com",
    "role": "SELLER",
    "shopName": "Johns Crafts"
  },
  "message": "Seller activated instantly! You can now list products."
}
```

### What Just Happened?
- User was promoted from BUYER → SELLER
- Application auto-approved (no admin review needed)
- Bank details stored for future payouts
- User can now list products immediately

### Next: List Your First Product
```bash
curl -X POST http://localhost:4000/products \
  -H "Content-Type: application/json" \
  -d '{
    "sellerId": "YOUR_SELLER_USER_ID",
    "title": "Handmade Beaded Bracelet",
    "description": "Beautiful beaded bracelet with traditional patterns",
    "price": 15.00,
    "currency": "USD",
    "imageUrl": "https://example.com/bracelet.jpg",
    "category": "Jewelry"
  }'
```

## Why This Works for MVP

**Traditional Flow:**
1. User applies to be seller → WAIT
2. Admin reviews application → WAIT
3. Admin approves → User notified → WAIT
4. User can finally list products
**Total time**: Days/weeks

**Instant Activation Flow:**
1. User applies → INSTANT seller status
2. Can list products immediately
**Total time**: Seconds

## When to Stop Using This

Once you have your first 10-20 sellers and first real transactions, you can:
1. Switch to manual approval flow
2. Add KYC verification requirements
3. Implement fraud checks

But for your "Make First $1" goal, this is perfect.
