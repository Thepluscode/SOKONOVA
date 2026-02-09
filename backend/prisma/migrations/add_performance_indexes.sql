-- Performance Indexes for SokoNova Marketplace
-- Run this after deploying to production
-- These indexes optimize common query patterns

-- Products: Seller filtering and active status
CREATE INDEX IF NOT EXISTS "idx_products_seller_active" ON "Product"("sellerId", "isActive");

-- Products: Category filtering
CREATE INDEX IF NOT EXISTS "idx_products_category" ON "Product"("category") WHERE "category" IS NOT NULL;

-- Products: Search by title (for LIKE queries)
CREATE INDEX IF NOT EXISTS "idx_products_title_trgm" ON "Product" USING gin("title" gin_trgm_ops);

-- Orders: Status and creation date (for seller/admin dashboards)
CREATE INDEX IF NOT EXISTS "idx_orders_status_created" ON "Order"("status", "createdAt" DESC);

-- OrderItems: Seller earnings queries
CREATE INDEX IF NOT EXISTS "idx_orderitems_seller_payout" ON "OrderItem"("sellerId", "payoutStatus", "createdAt" DESC);

-- OrderItems: Fulfillment tracking
CREATE INDEX IF NOT EXISTS "idx_orderitems_fulfillment" ON "OrderItem"("fulfillmentStatus", "sellerId");

-- Cart: User and anonymous cart lookups
CREATE INDEX IF NOT EXISTS "idx_cart_userid" ON "Cart"("userId") WHERE "userId" IS NOT NULL;
CREATE INDEX IF NOT EXISTS "idx_cart_anonkey" ON "Cart"("anonKey") WHERE "anonKey" IS NOT NULL;

-- Notifications: User unread notifications
CREATE INDEX IF NOT EXISTS "idx_notifications_user_unread" ON "Notification"("userId", "isRead", "createdAt" DESC);

-- SellerApplications: Pending applications for admin review
CREATE INDEX IF NOT EXISTS "idx_seller_applications_status" ON "SellerApplication"("status", "createdAt" DESC);

-- Reviews: Product reviews (visible only)
CREATE INDEX IF NOT EXISTS "idx_reviews_product_visible" ON "Review"("productId", "isVisible", "createdAt" DESC);

-- PayoutRequests: Status filtering
CREATE INDEX IF NOT EXISTS "idx_payout_requests_status" ON "PayoutRequest"("status", "createdAt" DESC);

-- Disputes: Open disputes for admin dashboard
CREATE INDEX IF NOT EXISTS "idx_disputes_status" ON "Dispute"("status", "createdAt" DESC);
