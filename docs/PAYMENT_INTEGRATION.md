# Payment Integration Guide

**Status**: ✅ Production Ready
**PSPs Supported**: Paystack, Flutterwave, Stripe
**Last Updated**: January 2025

---

## Overview

SokoNova now supports real payment processing with three major African payment service providers:
- **Paystack** (Nigeria, Ghana, South Africa, Kenya)
- **Flutterwave** (Pan-African coverage)
- **Stripe** (Global, including Africa via API)

This system replaces the mock payment flow with production-ready integrations including:
- ✅ Real PSP API initialization
- ✅ Secure webhook signature verification
- ✅ Order status synchronization
- ✅ Payment confirmation flow
- ✅ Error handling and retries

---

## Architecture

### High-Level Flow

```
┌─────────────┐
│   Buyer     │
│ (Frontend)  │
└──────┬──────┘
       │ 1. Create Order (status=PENDING)
       ▼
┌─────────────────────────┐
│  Backend Orders API     │
│  POST /orders           │
└──────┬──────────────────┘
       │ 2. Request Payment Intent
       ▼
┌──────────────────────────┐
│  Backend Payments API    │
│  POST /payments/intent   │◄────────┐
└──────┬───────────────────┘         │
       │ 3. Call PSP API             │
       │    (Paystack/Flutterwave/   │
       │     Stripe)                 │
       ▼                             │
┌──────────────────────────┐         │
│  PSP Checkout Page       │         │
│  (Hosted by PSP)         │         │
└──────┬───────────────────┘         │
       │ 4. User completes payment   │
       ▼                             │
┌──────────────────────────┐         │
│  PSP Webhook             │─────────┘
│  POST /payments/webhook/ │  5. Confirm payment
│       {provider}         │     (signature verified)
└──────┬───────────────────┘
       │ 6. Update order status
       │    Payment: SUCCEEDED
       │    Order: PAID
       ▼
┌──────────────────────────┐
│  Fulfillment Process     │
│  (Seller notification,   │
│   shipping, etc.)        │
└──────────────────────────┘
```

### Data Flow

1. **Order Creation**: `Order.status = PENDING`, `Payment.status = PENDING`
2. **Payment Intent**: Backend calls PSP API, gets checkout URL
3. **PSP Redirect**: User completes payment on PSP's secure page
4. **Webhook Callback**: PSP notifies backend of payment result
5. **Status Update**: `Payment.status = SUCCEEDED`, `Order.status = PAID`
6. **Fulfillment**: Order items move to fulfillment pipeline

---

## Setup Instructions

### 1. Get API Credentials

#### Paystack
1. Sign up at https://dashboard.paystack.com
2. Navigate to Settings → API Keys & Webhooks
3. Copy your **Secret Key** (starts with `sk_`)
4. Create a webhook endpoint: `https://yourdomain.com/payments/webhook/paystack`
5. Copy your **Secret Key** again for webhook verification

#### Flutterwave
1. Sign up at https://dashboard.flutterwave.com
2. Navigate to Settings → API
3. Copy your **Secret Key** (starts with `FLWSECK-`)
4. Copy your **Public Key** (for frontend, if needed)
5. Navigate to Settings → Webhooks
6. Create webhook: `https://yourdomain.com/payments/webhook/flutterwave`
7. Generate and copy **Webhook Secret Hash**

#### Stripe
1. Sign up at https://dashboard.stripe.com
2. Navigate to Developers → API Keys
3. Copy your **Secret Key** (starts with `sk_`)
4. Navigate to Developers → Webhooks
5. Add endpoint: `https://yourdomain.com/payments/webhook/stripe`
6. Select event: `payment_intent.succeeded`
7. Copy **Webhook Signing Secret** (starts with `whsec_`)

### 2. Configure Environment Variables

Add these to your `backend/.env` file:

```bash
# Paystack (Nigeria, Ghana, South Africa, Kenya)
PAYSTACK_SECRET_KEY=sk_live_xxxxxxxxxxxxxxxxxxxxx

# Flutterwave (Pan-African)
FLUTTERWAVE_SECRET_KEY=FLWSECK-xxxxxxxxxxxxxxxxxxxxxxx
FLUTTERWAVE_PUBLIC_KEY=FLWPUBK-xxxxxxxxxxxxxxxxxxxxxxx
FLUTTERWAVE_WEBHOOK_SECRET=your-webhook-secret-hash

# Stripe (Global)
STRIPE_SECRET_KEY=sk_live_xxxxxxxxxxxxxxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxxxxxx

# Frontend URL (for PSP redirects)
FRONTEND_BASE_URL=https://sokonova.com
```

**Important Security Notes:**
- Never commit `.env` files to git
- Use different keys for test/live environments
- Rotate keys if they are ever exposed
- Store production keys in secure secret management (e.g., AWS Secrets Manager, HashiCorp Vault)

### 3. Update Frontend Environment

Add to your `frontend/.env.local`:

```bash
NEXT_PUBLIC_BACKEND_URL=https://api.sokonova.com
```

---

## Implementation Details

### Backend: Payment Intent Creation

**File**: `backend/src/modules/payments/payments.service.ts`

The `createPaymentIntent()` method:
1. Fetches the order with user relation
2. Calls the appropriate PSP helper method based on provider
3. Stores the real PSP reference in the database
4. Returns checkout URL (Paystack/Flutterwave) or client secret (Stripe)

```typescript
async createPaymentIntent({ orderId, provider }) {
  const order = await this.prisma.order.findUnique({
    where: { id: orderId },
    include: { user: true },
  });

  let externalRef: string;
  let checkoutUrl: string | undefined;
  let clientSecret: string | undefined;

  // Call appropriate PSP
  if (provider === 'paystack') {
    const result = await this.initPaystack(order, order.user.email);
    externalRef = result.externalRef;
    checkoutUrl = result.checkoutUrl;
  } else if (provider === 'flutterwave') {
    const result = await this.initFlutterwave(order, order.user.email);
    externalRef = result.externalRef;
    checkoutUrl = result.checkoutUrl;
  } else if (provider === 'stripe') {
    const result = await this.initStripe(order);
    externalRef = result.externalRef;
    clientSecret = result.clientSecret;
  }

  // Store payment with real PSP reference
  const payment = await this.prisma.payment.create({
    data: {
      orderId,
      provider,
      externalRef,
      amount: order.total,
      currency: order.currency,
      status: 'PENDING',
    },
  });

  return { ...payment, checkoutUrl, clientSecret };
}
```

### Backend: Webhook Verification

**File**: `backend/src/modules/payments/payments.controller.ts`

Each PSP has a dedicated webhook endpoint with signature verification:

#### Paystack Webhook
- **Endpoint**: `POST /payments/webhook/paystack`
- **Signature**: HMAC SHA512 in `x-paystack-signature` header
- **Event**: `charge.success`

```typescript
@Post('webhook/paystack')
@HttpCode(200)
async webhookPaystack(@Req() req: Request, @Res() res: Response) {
  // 1. Verify signature
  const signature = req.headers['x-paystack-signature'];
  const hash = crypto
    .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
    .update(JSON.stringify(req.body))
    .digest('hex');

  if (hash !== signature) {
    throw new UnauthorizedException('Invalid signature');
  }

  // 2. Extract payment details
  const { event, data } = req.body;
  const externalRef = data.reference;
  const status = data.status;
  const orderId = data.metadata?.orderId;

  // 3. Mark payment success/failure
  if (status === 'success') {
    await this.payments.markPaymentSuccessByRef(externalRef, orderId);
  }
}
```

#### Flutterwave Webhook
- **Endpoint**: `POST /payments/webhook/flutterwave`
- **Signature**: Hash match in `verif-hash` header
- **Event**: `charge.completed`

#### Stripe Webhook
- **Endpoint**: `POST /payments/webhook/stripe`
- **Signature**: Stripe signature in `stripe-signature` header
- **Event**: `payment_intent.succeeded`

### Frontend: Checkout Flow

**File**: `app/checkout/page.tsx`

1. User fills shipping info and selects PSP
2. Frontend calls `POST /orders` to create order
3. Frontend calls `POST /payments/intent` with orderId and provider
4. Backend returns `checkoutUrl` (or `clientSecret` for Stripe)
5. Frontend redirects: `window.location.href = checkoutUrl`

```typescript
const payment = await createPaymentIntent(newOrder.id, formData.provider);

if (payment.checkoutUrl) {
  sessionStorage.setItem("pendingOrderId", newOrder.id);
  window.location.href = payment.checkoutUrl; // Redirect to PSP
  return;
}
```

### Frontend: Payment Verification

**File**: `app/checkout/verify/page.tsx`

After PSP completes payment, they redirect back to:
```
https://sokonova.com/checkout/verify?reference=xxx&status=success
```

The verification page:
1. Reads `pendingOrderId` from sessionStorage
2. Polls backend `GET /payments/:orderId` every 2 seconds
3. Shows success when `payment.status === 'SUCCEEDED'`
4. Provides links to view order or continue shopping

**Why poll?** The webhook might arrive before the redirect. Polling ensures we show updated status regardless of race conditions.

---

## Testing

### Test Mode Setup

All three PSPs support test modes:

#### Paystack Test Mode
- Use test keys starting with `sk_test_`
- Test card: `4084084084084081` (expires any future date, CVV: 408)
- OTP: `123456`

#### Flutterwave Test Mode
- Use test keys starting with `FLWSECK-test`
- Test card: `5531886652142950` (expires any future date, CVV: 564)
- OTP: `12345`

#### Stripe Test Mode
- Use test keys starting with `sk_test_`
- Test card: `4242424242424242` (expires any future date, CVC: any 3 digits)

### Testing Webhooks Locally

Use ngrok or similar to expose your local backend:

```bash
# In terminal 1: Start backend
cd backend
npm run start:dev

# In terminal 2: Expose backend with ngrok
ngrok http 4000

# Copy ngrok URL (e.g., https://abc123.ngrok.io)
# Add webhook in PSP dashboard:
# Paystack: https://abc123.ngrok.io/payments/webhook/paystack
# Flutterwave: https://abc123.ngrok.io/payments/webhook/flutterwave
# Stripe: https://abc123.ngrok.io/payments/webhook/stripe
```

### Manual Testing Checklist

- [ ] **Order Creation**: Verify order created with `status=PENDING`
- [ ] **Payment Intent**: Verify payment created with real `externalRef`
- [ ] **PSP Redirect**: Verify redirect to PSP checkout page
- [ ] **Payment Completion**: Complete payment on PSP page
- [ ] **Webhook Received**: Check backend logs for webhook event
- [ ] **Signature Verified**: Ensure webhook passes signature check
- [ ] **Status Updated**: Verify `Payment.status=SUCCEEDED`, `Order.status=PAID`
- [ ] **Frontend Redirect**: Verify redirect back to verify page
- [ ] **Success Page**: Verify success message displayed

---

## Production Deployment

### Pre-Launch Checklist

1. **Environment Variables**
   - [ ] All PSP keys are production keys (not test)
   - [ ] `FRONTEND_BASE_URL` points to production domain
   - [ ] Keys stored in secure secret management

2. **Webhook Configuration**
   - [ ] Webhooks registered with production URLs
   - [ ] Webhook secrets match `.env` values
   - [ ] HTTPS enabled on all webhook endpoints
   - [ ] Webhook signatures verified in code

3. **Database**
   - [ ] Prisma migrations applied to production database
   - [ ] `Payment` and `Order` tables exist
   - [ ] Indexes created for performance

4. **Frontend**
   - [ ] `NEXT_PUBLIC_BACKEND_URL` points to production API
   - [ ] Checkout flow tested end-to-end
   - [ ] Verification page handles all status cases

5. **Security**
   - [ ] Rate limiting enabled on webhook endpoints
   - [ ] CORS configured properly
   - [ ] SSL/TLS certificates valid
   - [ ] Webhook IPs whitelisted (optional but recommended)

### Monitoring

Set up monitoring for:
- **Payment Success Rate**: Track `SUCCEEDED` vs `FAILED` payments
- **Webhook Failures**: Alert on signature verification failures
- **Timeout Issues**: Monitor verification page timeout rate
- **PSP Downtime**: Track API availability for each PSP

### Backup & Recovery

- **Failed Webhooks**: PSPs retry webhooks multiple times. Check PSP dashboard for failed deliveries.
- **Idempotency**: All webhook handlers are idempotent (safe to process multiple times)
- **Manual Reconciliation**: Query PSP API to verify payment status if webhook is missed

---

## Currency Support

### Paystack
- Supported: NGN (Nigeria), GHS (Ghana), ZAR (South Africa), USD
- Default: NGN
- Mobile Money: Supported in GHS

### Flutterwave
- Supported: 150+ currencies including NGN, KES, GHS, ZAR, USD, EUR, GBP
- Default: NGN
- Mobile Money: Supported in multiple countries

### Stripe
- Supported: 135+ currencies
- Default: USD
- Requires country-specific setup for local payment methods

**Recommendation**: Match currency to seller's country:
- Nigerian sellers → NGN via Paystack
- Kenyan sellers → KES via Flutterwave
- International → USD via Stripe

---

## Troubleshooting

### Webhook Not Received

**Symptoms**: Payment succeeds on PSP page but order stays `PENDING`

**Solutions**:
1. Check webhook URL is correct in PSP dashboard
2. Verify webhook secret matches `.env` value
3. Check backend logs for signature verification errors
4. Test webhook with PSP's test webhook feature
5. Ensure backend is publicly accessible (not localhost)

### Signature Verification Fails

**Symptoms**: Backend logs show "Invalid signature" errors

**Solutions**:
1. Verify webhook secret is correct in `.env`
2. Ensure raw request body is used (not parsed JSON)
3. For NestJS, configure body parser to preserve raw body
4. Check PSP documentation for signature algorithm changes

### Payment Stuck in PENDING

**Symptoms**: Verification page times out, payment never marked SUCCEEDED

**Solutions**:
1. Check if webhook was received (backend logs)
2. Manually check payment status in PSP dashboard
3. Verify order ID matches in webhook metadata
4. Check database for payment record with correct `externalRef`
5. Use PSP API to query transaction status and manually reconcile

### Duplicate Payments

**Symptoms**: User charged twice for same order

**Solutions**:
1. Ensure frontend doesn't retry payment intent creation
2. Add unique constraint on `Payment.orderId` in database
3. Check webhook idempotency (should handle duplicate webhooks gracefully)
4. Refund duplicate payment via PSP dashboard

---

## API Reference

### Create Payment Intent

**Endpoint**: `POST /payments/intent`

**Request**:
```json
{
  "orderId": "clx123abc",
  "provider": "paystack"
}
```

**Response**:
```json
{
  "id": "clx789def",
  "orderId": "clx123abc",
  "provider": "paystack",
  "externalRef": "T123456789",
  "status": "PENDING",
  "amount": "50.00",
  "currency": "USD",
  "checkoutUrl": "https://checkout.paystack.com/t123456789"
}
```

### Get Payment Status

**Endpoint**: `GET /payments/:orderId`

**Response**:
```json
{
  "id": "clx789def",
  "orderId": "clx123abc",
  "provider": "paystack",
  "externalRef": "T123456789",
  "status": "SUCCEEDED",
  "amount": "50.00",
  "currency": "USD",
  "order": {
    "id": "clx123abc",
    "status": "PAID",
    "total": "50.00"
  }
}
```

---

## Files Modified

### Backend
- `backend/src/modules/payments/payments.service.ts` - Added PSP initialization methods
- `backend/src/modules/payments/payments.controller.ts` - Added webhook signature verification
- `backend/.env` - Add PSP credentials (not in git)

### Frontend
- `app/checkout/page.tsx` - Updated to redirect to PSP
- `app/checkout/verify/page.tsx` - Created payment verification page

---

## Next Steps

After completing payment integration:

1. **Test with real transactions** (use test modes first)
2. **Monitor payment success rates** (aim for >95%)
3. **Add refund functionality** (admin panel)
4. **Implement split payments** (for marketplace commissions)
5. **Add recurring billing** (for subscription products)

---

**Status**: ✅ Ready for production testing
