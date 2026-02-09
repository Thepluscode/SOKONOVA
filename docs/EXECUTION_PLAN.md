# SokoNova 30-Day Execution Plan (Africa-First, Stripe-Only, Vite Frontend)

Owner: You
Product UI: sokonova-frontend
Goal: "All features working correctly" within 30 days

This plan is ruthless on scope and focused on revenue safety. The objective is not to add more features. The objective is to make the current feature set real, secure, and reliable.

---

## Definition of "All Features Working Correctly"

All critical flows must pass with real data, real auth, and Stripe-only payments:

Buyer flows
- Browse -> search -> product detail -> add to cart -> checkout -> payment -> order success -> tracking
- Notification received for paid/shipped/delivered

Seller flows
- Apply -> approved -> list product -> manage inventory -> fulfill order -> view payout
- Notification received for new order and payout status

Admin flows
- Approve sellers -> monitor disputes -> manage payouts -> view ops dashboard

System integrity
- No unauthenticated writes to protected resources
- Stripe webhooks are verified and are the only path to payment success
- No localStorage-based identity for admin actions

---

## Scope Cuts (Non-Negotiable for 30 Days)

Deferred until after Day 30:
- Multi-provider payments beyond Stripe
- Mobile app
- AI recommendations, personalization experiments
- Any new marketplace modules not already in the repo

If it does not directly improve security, payments, discovery, or fulfillment, it does not ship in this window.

---

## Sprint Plan (30 Days)

### Sprint 1 (Days 1-7): Security + Stripe Money Flow
Objective: Make the product safe to accept real users and payments.

Day 1
- Freeze on sokonova-frontend as source of truth.
- List all mutation endpoints used by Vite app.
- Flag endpoints missing auth/role guards.

Day 2
- Add JWT guard + role guard to all protected backend controllers.
- Enforce self-access checks in controllers (buyerId/sellerId).

Day 3
- Remove any admin identity sourced from localStorage in Vite.
- Ensure admin actions require authenticated context.

Day 4
- Enforce Stripe webhook verification.
- Lock payment success transitions to verified webhook events only.

Day 5
- End-to-end test: buyer -> checkout -> Stripe -> webhook -> order paid.
- Fix any failing statuses or schema mismatches.

Day 6
- Audit logs for payments and fulfillment updates.
- Add minimal error handling for payment failures.

Day 7
- Sprint gate review.

Exit criteria
- No protected endpoint accessible without auth.
- Stripe webhook verified and authoritative.
- Core buyer checkout flow passes without manual DB updates.

---

### Sprint 2 (Days 8-14): Notifications + Post-Purchase Trust
Objective: Users always know what is happening.

Day 8
- Wire notifications for payment success/failure.

Day 9
- Wire notifications for fulfillment events (shipped/delivered/issues).

Day 10
- Wire notifications for disputes, reviews, and payouts.

Day 11
- Build notification inbox + bell in sokonova-frontend.

Day 12
- Connect notification UI to backend and verify unread counts.

Day 13
- End-to-end flow: checkout -> ship -> deliver with notifications.

Day 14
- Sprint gate review.

Exit criteria
- Buyer and seller notifications fire for every lifecycle event.
- Notification UI shows real data (not mocks).

---

### Sprint 3 (Days 15-21): Discovery + Conversion
Objective: Buyers can find and buy products without friction.

Day 15
- Implement real search endpoint with paging and filters.

Day 16
- Wire AdvancedSearch/AdvancedFilters to real data.

Day 17
- Implement trending/featured sellers on real data.

Day 18
- Optimize product detail page for conversion (images, reviews, stock status).

Day 19
- End-to-end test: search -> product -> cart -> checkout.

Day 20
- Fix UX bottlenecks in cart and checkout.

Day 21
- Sprint gate review.

Exit criteria
- Search returns relevant results with paging.
- 10 products -> 10 completed orders without manual fixes.

---

### Sprint 4 (Days 22-30): Seller Ops + Reliability + Launch Readiness
Objective: Sellers can operate without your help, platform is stable.

Day 22
- Harden seller onboarding approval flow.

Day 23
- Ensure seller payouts ledger is accurate and export works.

Day 24
- Verify seller fulfillment queue and inventory updates are reliable.

Day 25
- Add caching for discovery and analytics endpoints.

Day 26
- Add rate limits and basic monitoring (Sentry + logs).

Day 27
- Add integration tests for payment and fulfillment flows.

Day 28
- Regression pass on buyer/seller/admin flows.

Day 29
- Fix remaining critical issues only.

Day 30
- Launch readiness checklist and go/no-go decision.

Exit criteria
- A seller can list -> sell -> fulfill -> view payout without dev intervention.
- Core endpoints stable and monitored.
- All critical flows pass in staging.

---

## Weekly Scorecard

Each week ends with a brutal score:
- % of critical flows passing
- # of open P0 security bugs
- Median API latency for core endpoints
- Payment success rate from Stripe webhook

If any week ends with 2+ P0s, next week is security-only.

---

## Launch Checklist (Day 30)

- Buyer flow passes
- Seller flow passes
- Admin flow passes
- Stripe webhook verified and locked
- Auth/RBAC enforced everywhere
- Notifications complete and real
- Monitoring enabled

If any checkbox is red, launch is blocked.

---

## Mentor Warning

If you chase new features inside this 30-day window, you will fail.
Ship reliability, trust, and money flow first. That is what makes money.
