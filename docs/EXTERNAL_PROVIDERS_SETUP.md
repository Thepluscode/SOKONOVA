# External Notification Providers Setup Guide

## Overview

This guide explains how to configure external notification providers for the SokoNova marketplace platform. The platform supports:

- Email notifications via SendGrid
- SMS notifications via Africa's Talking
- WhatsApp notifications (planned)

## 1. SendGrid (Email Notifications)

### Prerequisites

1. A SendGrid account (free tier available at https://sendgrid.com/)
2. A verified sender domain or email address
3. SendGrid API key

### Setup Steps

1. **Create SendGrid Account**
   - Go to https://sendgrid.com/ and sign up for an account
   - Complete the verification process

2. **Create API Key**
   - Navigate to Settings > API Keys
   - Click "Create API Key"
   - Give it a name (e.g., "SokoNova Notifications")
   - Select "Restricted Access"
   - Grant "Mail Send" > "Full Access"
   - Click "Create & View"
   - Copy the API key (you won't see it again)

3. **Verify Sender Identity**
   - Navigate to Settings > Sender Authentication
   - Either set up Domain Authentication or create a Single Sender Verification
   - For development, Single Sender is sufficient
   - Use an email like `notifications@yourdomain.com`

4. **Configure Environment Variables**
   Add the following to your `backend/.env` file:
   ```
   SENDGRID_API_KEY=your_sendgrid_api_key_here
   SENDGRID_FROM_EMAIL=notifications@yourdomain.com
   ```

5. **Test Email Delivery**
   - Start the backend server
   - Trigger a notification that includes email (e.g., place an order)
   - Check SendGrid's Activity Feed for delivery status

### Troubleshooting

- **Emails not sending**: Check that your API key has Mail Send permissions
- **Emails going to spam**: Ensure proper sender authentication and content
- **Rate limiting**: Free accounts are limited to 100 emails/day

## 2. Africa's Talking (SMS Notifications)

### Prerequisites

1. An Africa's Talking account (free tier available at https://account.africastalking.com/)
2. A verified phone number
3. Africa's Talking API credentials

### Setup Steps

1. **Create Africa's Talking Account**
   - Go to https://account.africastalking.com/ and sign up
   - Complete the verification process

2. **Get API Credentials**
   - Navigate to Settings > API Key
   - Generate a new API key or use the default one
   - Note your username (displayed at the top right)

3. **Configure Short Code (Optional)**
   - Navigate to SMS > Short Codes
   - Purchase or configure a short code for branded SMS
   - Default is "SokoNova" if none configured

4. **Configure Environment Variables**
   Add the following to your `backend/.env` file:
   ```
   AFRICASTALKING_API_KEY=your_africastalking_api_key_here
   AFRICASTALKING_USERNAME=your_africastalking_username
   AFRICASTALKING_SHORT_CODE=SokoNova
   ```

5. **Test SMS Delivery**
   - Start the backend server
   - Trigger a notification that includes SMS (e.g., mark item as shipped)
   - Check your phone for the SMS

### Supported Countries

Africa's Talking works in:
- Kenya (primary)
- Nigeria
- Ghana
- Tanzania
- Uganda
- Rwanda
- Zambia
- Malawi
- Senegal

### Troubleshooting

- **SMS not sending**: Check API credentials and account balance
- **Wrong phone format**: Ensure numbers are in international format (+234XXXXXXXXX)
- **Delivery delays**: Check Africa's Talking status page for service issues

## 3. Twilio (Alternative SMS/WhatsApp Provider)

If Africa's Talking doesn't meet your needs, Twilio is a good alternative.

### Setup Steps

1. **Create Twilio Account**
   - Go to https://www.twilio.com/ and sign up
   - Complete verification

2. **Get Credentials**
   - Find Account SID and Auth Token in Console Dashboard
   - Purchase a phone number for SMS

3. **Configure Environment Variables**
   Uncomment and update these in `backend/.env`:
   ```
   # TWILIO_ACCOUNT_SID=your_account_sid
   # TWILIO_AUTH_TOKEN=your_auth_token
   # TWILIO_PHONE_NUMBER=+1234567890
   ```

4. **Update SMS Adapter**
   Modify `backend/src/modules/notifications/providers/sms.adapter.ts` to use Twilio instead of Africa's Talking.

## 4. Testing Notifications

### End-to-End Test Flow

1. **Place Test Order**
   - Log in as a buyer
   - Add item to cart and checkout
   - Complete payment
   - Verify:
     - Buyer receives email: "Payment Received"
     - Seller receives email: "New Paid Order"

2. **Test Fulfillment**
   - Log in as seller
   - Mark item as shipped
   - Verify:
     - Buyer receives SMS: "Your order has been shipped"
     - Buyer receives email with tracking info

3. **Test Delivery**
   - Log in as seller
   - Mark item as delivered
   - Verify:
     - Buyer receives email: "Your order has been delivered"

4. **Test Dispute Flow**
   - Log in as buyer
   - Open dispute on delivered item
   - Verify:
     - Seller receives email: "New Dispute"
   - Log in as seller/admin
   - Resolve dispute
   - Verify:
     - Buyer receives email: "Dispute Resolved"

5. **Test Payout**
   - Log in as admin
   - Process payout batch
   - Verify:
     - Seller receives email: "Payout Released"

6. **Test Review**
   - Log in as buyer
   - Leave review on delivered item
   - Verify:
     - Seller receives in-app notification: "New Review"

### Monitoring Delivery

Check the backend logs for notification delivery status:
```bash
# In backend directory
npm run start:dev
```

Look for log entries like:
```
[Nest] 12345 - NotificationsService: Email sent successfully to user@example.com
[Nest] 12345 - SmsAdapter: SMS sent successfully to +234XXXXXXXXX
```

## 5. User Notification Preferences

Users can control their notification preferences in their account settings:

- Email notifications: Toggle on/off
- SMS notifications: Toggle on/off
- Quiet hours: Set time ranges to suppress notifications
- Timezone: Ensures quiet hours work correctly

## 6. Best Practices

### Email Best Practices

1. **Branding**: Use consistent sender name and logo
2. **Content**: Keep messages clear and actionable
3. **Frequency**: Don't overwhelm users with too many emails
4. **Unsubscribe**: Include option to manage preferences

### SMS Best Practices

1. **Length**: Keep messages under 160 characters
2. **Timing**: Respect quiet hours and local timezones
3. **Content**: Make messages actionable and valuable
4. **Cost**: Be mindful of SMS costs for high-volume usage

### Error Handling

The notification system includes robust error handling:
- Failed notifications are logged but don't block core operations
- Timeout protection prevents hanging requests
- Retry logic for transient failures
- Graceful degradation (fallback to logging)

## 7. Scaling Considerations

### High Volume

For high-volume notifications:
- Consider upgrading from free tiers
- Implement rate limiting to prevent API abuse
- Use queue-based processing for better reliability
- Monitor delivery rates and adjust accordingly

### International Expansion

When expanding to new markets:
- Research local SMS providers for better rates
- Consider local email providers for better deliverability
- Adapt messaging for local languages/cultures
- Comply with local privacy regulations

## 8. Security

### API Keys

- Never commit API keys to version control
- Use environment variables for all credentials
- Rotate keys regularly
- Restrict API key permissions to minimum required

### User Privacy

- Respect user notification preferences
- Honor unsubscribe requests immediately
- Don't share user data with third parties
- Comply with GDPR/CCPA where applicable

## Next Steps

1. Set up SendGrid for email notifications
2. Set up Africa's Talking for SMS notifications
3. Test end-to-end notification flow
4. Monitor delivery rates and user feedback
5. Optimize content and timing based on engagement

For support, check the backend logs or contact the platform maintainers.