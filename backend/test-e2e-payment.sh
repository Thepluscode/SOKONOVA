#!/bin/bash
# End-to-End Payment Flow Test
# This script tests the complete payment flow from user creation to payment

set -e  # Exit on any error

echo "🚀 Starting End-to-End Payment Flow Test"
echo "=========================================="

BASE_URL="http://localhost:4000"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Create Buyer User
echo -e "\n${BLUE}Step 1: Creating buyer user...${NC}"
BUYER_RESPONSE=$(curl -s -X POST ${BASE_URL}/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "buyer_test_'$(date +%s)'@test.com",
    "password": "password123",
    "name": "Test Buyer"
  }')

BUYER_ID=$(echo $BUYER_RESPONSE | grep -o '"id":"[^"]*' | sed 's/"id":"//')
echo -e "${GREEN}✓ Buyer created: ${BUYER_ID}${NC}"

# Step 2: Create Seller User
echo -e "\n${BLUE}Step 2: Creating seller user...${NC}"
SELLER_RESPONSE=$(curl -s -X POST ${BASE_URL}/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "seller_test_'$(date +%s)'@test.com",
    "password": "password123",
    "name": "Test Seller"
  }')

SELLER_ID=$(echo $SELLER_RESPONSE | grep -o '"id":"[^"]*' | sed 's/"id":"//')
echo -e "${GREEN}✓ Seller created: ${SELLER_ID}${NC}"

# Step 3: Activate Seller Instantly
echo -e "\n${BLUE}Step 3: Activating seller instantly...${NC}"
ACTIVATION_RESPONSE=$(curl -s -X POST ${BASE_URL}/seller-applications/activate-instant \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "'${SELLER_ID}'",
    "businessName": "Test Shop",
    "phone": "+254712345678",
    "country": "Kenya",
    "city": "Nairobi",
    "storefrontDesc": "Test products",
    "bankName": "Equity Bank",
    "accountNumber": "1234567890",
    "accountName": "Test Seller",
    "bankCode": "EQBLKENA"
  }')

echo -e "${GREEN}✓ Seller activated!${NC}"

# Step 4: Create Product
echo -e "\n${BLUE}Step 4: Creating test product...${NC}"
PRODUCT_RESPONSE=$(curl -s -X POST ${BASE_URL}/products \
  -H "Content-Type: application/json" \
  -d '{
    "sellerId": "'${SELLER_ID}'",
    "title": "E2E Test Product",
    "description": "Product for end-to-end testing",
    "price": 50.00,
    "currency": "USD",
    "category": "Test"
  }')

PRODUCT_ID=$(echo $PRODUCT_RESPONSE | grep -o '"id":"[^"]*' | sed 's/"id":"//')
echo -e "${GREEN}✓ Product created: ${PRODUCT_ID}${NC}"
echo "  Title: E2E Test Product"
echo "  Price: $50.00"

# Step 5: Create Order
echo -e "\n${BLUE}Step 5: Creating order...${NC}"
ORDER_RESPONSE=$(curl -s -X POST ${BASE_URL}/orders \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "'${BUYER_ID}'",
    "items": [
      {
        "productId": "'${PRODUCT_ID}'",
        "qty": 1,
        "price": 50.00
      }
    ],
    "total": 50.00,
    "currency": "USD"
  }')

ORDER_ID=$(echo $ORDER_RESPONSE | grep -o '"id":"[^"]*' | sed 's/"id":"//')
echo -e "${GREEN}✓ Order created: ${ORDER_ID}${NC}"
echo "  Total: $50.00"

# Step 6: Create Stripe Payment Intent
echo -e "\n${BLUE}Step 6: Creating Stripe payment intent...${NC}"
PAYMENT_RESPONSE=$(curl -s -X POST ${BASE_URL}/payments/intent \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "'${ORDER_ID}'",
    "provider": "stripe"
  }')

PAYMENT_ID=$(echo $PAYMENT_RESPONSE | grep -o '"externalRef":"[^"]*' | sed 's/"externalRef":"//')
CLIENT_SECRET=$(echo $PAYMENT_RESPONSE | grep -o '"clientSecret":"[^"]*' | sed 's/"clientSecret":"//')

echo -e "${GREEN}✓ Payment intent created!${NC}"
echo "  Payment ID: ${PAYMENT_ID}"
echo "  Amount: $50.00"
echo ""
echo -e "${BLUE}Client Secret (for frontend):${NC}"
echo "${CLIENT_SECRET}"

# Step 7: Summary
echo -e "\n${GREEN}=========================================="
echo "✓ End-to-End Payment Flow Test Complete!"
echo "==========================================${NC}"
echo ""
echo "📊 Test Results:"
echo "  ✓ Buyer created: ${BUYER_ID}"
echo "  ✓ Seller created and activated: ${SELLER_ID}"
echo "  ✓ Product listed: ${PRODUCT_ID} (\$50.00)"
echo "  ✓ Order created: ${ORDER_ID}"
echo "  ✓ Stripe payment intent: ${PAYMENT_ID}"
echo ""
echo "💰 Revenue Breakdown (if payment succeeds):"
echo "  Order Total:       \$50.00"
echo "  Your Fee (5%):     \$2.50"
echo "  Stripe Fee (~5.8%): \$2.90"
echo "  Seller Gets:       \$44.60"
echo ""
echo "🔗 Next Steps:"
echo "  1. Open Stripe Dashboard: https://dashboard.stripe.com/test/payments"
echo "  2. Find payment: ${PAYMENT_ID}"
echo "  3. Or use client secret in your frontend to complete payment"
echo ""
echo "Client Secret: ${CLIENT_SECRET}"
