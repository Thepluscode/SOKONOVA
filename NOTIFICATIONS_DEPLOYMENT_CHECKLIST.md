# SokoNova Notifications - Production Deployment Checklist

## Pre-Deployment Checklist

### ✅ Code Complete
- [x] Database schema with notification preferences
- [x] SendGrid email integration
- [x] Africa's Talking SMS integration
- [x] User preferences page
- [x] Quiet hours logic
- [x] All modules integrated (Payments, Fulfillment, Disputes, Payouts, Reviews)
- [x] Error handling and logging
- [x] Environment variables documented

### 🔧 Provider Setup

#### SendGrid (Email)
- [ ] Create SendGrid account at https://sendgrid.com
- [ ] Verify sender domain (e.g., sokonova.com)
- [ ] Configure DNS records (SPF, DKIM, DMARC)
- [ ] Create API key with "Mail Send" permissions
- [ ] Add API key to production environment
- [ ] Test email delivery to real inbox
- [ ] Set up email authentication
- [ ] Configure bounce/spam handling
- [ ] Set up email analytics

**Cost:** Free tier (100 emails/day) or $19.95/month (50K emails)

#### Africa's Talking (SMS)
- [ ] Create account at https://africastalking.com
- [ ] Complete KYC verification
- [ ] Create application
- [ ] Add initial credits ($10-50 recommended)
- [ ] Copy API key and username
- [ ] Add credentials to production environment
- [ ] Test SMS delivery to real number
- [ ] Configure sender ID/shortcode
- [ ] Set up delivery reports
- [ ] Configure billing alerts

**Cost:** ~$0.0065 per SMS, no monthly fee

### 🗄️ Database

- [ ] Run migration: `npx prisma migrate deploy`
- [ ] Verify all fields created correctly
- [ ] Check indexes are in place
- [ ] Test database performance
- [ ] Set up database backups
- [ ] Configure connection pooling

### 🔐 Environment Variables

Production `.env` file must include:

```bash
# Database
DATABASE_URL=postgresql://...

# Frontend
FRONTEND_BASE_URL=https://sokonova.com

# SendGrid
SENDGRID_API_KEY=SG.xxx
SENDGRID_FROM_EMAIL=notifications@sokonova.com

# Africa's Talking
AFRICASTALKING_API_KEY=xxx
AFRICASTALKING_USERNAME=xxx
AFRICASTALKING_SHORT_CODE=SokoNova

# Payment providers (existing)
PAYSTACK_SECRET_KEY=xxx
FLUTTERWAVE_SECRET_KEY=xxx
```

- [ ] All environment variables set
- [ ] API keys are production keys (not sandbox)
- [ ] Email sender is verified
- [ ] Frontend URL is correct
- [ ] Secrets are secure (not in git)

### 🧪 Testing

#### Email Testing
- [ ] Send test email to yourself
- [ ] Verify email renders correctly
- [ ] Test on mobile email client
- [ ] Check spam folder
- [ ] Verify links work
- [ ] Test unsubscribe flow (if added)
- [ ] Check deliverability rate

#### SMS Testing
- [ ] Send test SMS to your phone
- [ ] Verify message arrives within 30 seconds
- [ ] Check message formatting
- [ ] Test international number format
- [ ] Verify sender ID displays correctly
- [ ] Test opt-out keywords (if configured)

#### Preferences Testing
- [ ] Navigate to `/account/settings/notifications`
- [ ] Toggle email notifications off
- [ ] Trigger notification - verify email not sent
- [ ] Toggle email back on
- [ ] Trigger notification - verify email sent
- [ ] Set quiet hours (e.g., 22:00 - 08:00)
- [ ] During quiet hours - verify email/SMS skipped
- [ ] Outside quiet hours - verify email/SMS sent
- [ ] Change timezone - verify respected
- [ ] Update phone number - verify SMS sent to new number

#### End-to-End Flow Testing
- [ ] Complete order → buyer receives email
- [ ] Complete order → seller receives email
- [ ] Mark shipped → buyer receives SMS
- [ ] Mark delivered → buyer receives notification
- [ ] Open dispute → seller receives email
- [ ] Resolve dispute → buyer receives notification
- [ ] Process payout → seller receives email
- [ ] Leave review → seller receives notification

### 📊 Monitoring

#### Setup Alerts
- [ ] Email delivery failures
- [ ] SMS delivery failures
- [ ] High error rates
- [ ] Provider API downtime
- [ ] Low SMS credits (Africa's Talking)
- [ ] Daily email limit reached (SendGrid)

#### Logging
- [ ] Enable production logging
- [ ] Configure log levels
- [ ] Set up log aggregation (optional: Datadog, Sentry)
- [ ] Monitor notification success rates
- [ ] Track user preference changes

#### Metrics to Track
- [ ] Total notifications sent per day
- [ ] Email delivery rate
- [ ] SMS delivery rate
- [ ] Email open rate
- [ ] Notification click-through rate
- [ ] Opt-out rate
- [ ] Quiet hours usage
- [ ] Cost per notification

### 🔗 UI Integration

- [ ] Add preferences link to user navigation menu
- [ ] Add preferences link to footer
- [ ] Add "Manage Notifications" link to emails
- [ ] Update help documentation
- [ ] Create FAQ about notifications
- [ ] Add onboarding tooltip for new users

### 📱 User Communication

- [ ] Announce new notification features
- [ ] Send email to existing users about preferences
- [ ] Create help article: "Managing Your Notifications"
- [ ] Add notification preferences to user onboarding
- [ ] Create video tutorial (optional)

### 🚀 Deployment Steps

#### 1. Database Migration
```bash
# On production server
cd backend
npx prisma migrate deploy
npx prisma generate
```

#### 2. Backend Deployment
```bash
# Build
npm run build

# Run tests (if any)
npm test

# Deploy to production
# (varies by hosting: Vercel, Railway, AWS, etc.)
```

#### 3. Frontend Deployment
```bash
# Build
npm run build

# Deploy
# (varies by hosting)
```

#### 4. Smoke Testing
- [ ] Visit production URL
- [ ] Create test order
- [ ] Verify notifications sent
- [ ] Check database for notification records
- [ ] Verify email received
- [ ] Verify SMS received (if enabled)

### 🐛 Rollback Plan

If issues occur:

1. **Email/SMS not sending:**
   - Check environment variables
   - Verify API keys are correct
   - Check provider dashboard for errors
   - Falls back to logging - no data loss

2. **Database errors:**
   - Rollback migration: `npx prisma migrate rollback`
   - Restore from backup

3. **Performance issues:**
   - Disable external providers temporarily
   - System will log only (degraded but functional)
   - Scale database if needed

### 📈 Post-Deployment

#### Week 1
- [ ] Monitor error rates daily
- [ ] Check email deliverability
- [ ] Check SMS delivery rates
- [ ] Review user feedback
- [ ] Adjust notification copy if needed

#### Week 2-4
- [ ] Analyze user preference patterns
- [ ] Optimize email open rates
- [ ] Review costs (email + SMS)
- [ ] Identify most valuable notification types
- [ ] A/B test notification copy (optional)

#### Month 2+
- [ ] Implement weekly digest emails
- [ ] Add Web Push notifications
- [ ] Create notification templates
- [ ] Add multi-language support
- [ ] Implement advanced segmentation

### 💰 Cost Management

#### SendGrid Budget
- Start with free tier (100 emails/day)
- Monitor usage in dashboard
- Upgrade to paid plan if needed ($19.95/month)
- Set up billing alerts

#### Africa's Talking Budget
- Start with $50 credit
- Monitor usage in dashboard
- Set up auto-recharge
- Configure low balance alerts (e.g., < $10)
- Budget $100-500/month depending on volume

### 🎯 Success Metrics

Target metrics for first month:

- **Email Delivery Rate:** > 95%
- **SMS Delivery Rate:** > 98%
- **Email Open Rate:** > 25%
- **Opt-out Rate:** < 2%
- **Cost per notification:** < $0.01
- **User satisfaction:** > 4/5 stars

### 📞 Support Contacts

- **SendGrid Support:** https://support.sendgrid.com
- **Africa's Talking Support:** support@africastalking.com
- **SokoNova Team:** [Your team contact]

### 🆘 Troubleshooting

#### Email Not Sending

**Symptoms:** Logs show email attempts but nothing arrives

**Check:**
1. SENDGRID_API_KEY is set correctly
2. Sender email is verified in SendGrid
3. Check SendGrid activity dashboard
4. Verify not in spam folder
5. Check DNS records (SPF, DKIM)

**Fix:**
- Re-verify sender domain
- Check API key permissions
- Review SendGrid error logs

#### SMS Not Sending

**Symptoms:** Logs show SMS attempts but nothing arrives

**Check:**
1. AFRICASTALKING_API_KEY and USERNAME correct
2. Account has sufficient credits
3. Phone number has country code
4. Number is valid in target country
5. Check Africa's Talking logs

**Fix:**
- Top up account credits
- Verify phone number format
- Check supported countries
- Review delivery reports

#### Preferences Not Saving

**Symptoms:** User changes settings but they don't persist

**Check:**
1. Database migration ran successfully
2. Backend API endpoint working
3. Frontend making correct PATCH request
4. Prisma client regenerated
5. Browser console for errors

**Fix:**
- Run `npx prisma generate`
- Check API logs for errors
- Verify JWT/session is valid

### ✅ Launch Checklist Summary

**Must Have (Before Launch):**
- [x] Code deployed to production
- [ ] Database migrated
- [ ] Environment variables set
- [ ] SendGrid configured
- [ ] Africa's Talking configured
- [ ] End-to-end testing complete
- [ ] Monitoring set up

**Should Have (Week 1):**
- [ ] User documentation
- [ ] Help articles
- [ ] FAQ section
- [ ] Support team trained
- [ ] Rollback plan tested

**Nice to Have (Month 1):**
- [ ] A/B testing setup
- [ ] Advanced analytics
- [ ] Weekly digests
- [ ] Push notifications

---

## Quick Start Commands

```bash
# Production deployment
cd backend
npx prisma migrate deploy
npm run build
npm run start:prod

# Check logs
pm2 logs sokonova-backend

# Monitor notifications
psql $DATABASE_URL -c "SELECT COUNT(*) FROM \"Notification\" WHERE \"createdAt\" > NOW() - INTERVAL '1 day';"

# Check SendGrid stats
curl https://api.sendgrid.com/v3/stats \
  -H "Authorization: Bearer $SENDGRID_API_KEY"

# Check Africa's Talking balance
curl https://api.africastalking.com/version1/user?username=$AFRICASTALKING_USERNAME \
  -H "apiKey: $AFRICASTALKING_API_KEY"
```

---

## Final Sign-Off

**Backend Lead:** ______________________ Date: __________

**Frontend Lead:** ______________________ Date: __________

**DevOps Lead:** ______________________ Date: __________

**Product Owner:** ______________________ Date: __________

---

**Status:** Ready for Production Deployment 🚀

**Last Updated:** October 30, 2025

**Next Review:** After first week of production
