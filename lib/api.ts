// lib/api.ts
// This file is deprecated. Please use the domain-specific API modules instead:
// - lib/api/products.ts
// - lib/api/cart.ts
// - lib/api/orders.ts
// - lib/api/payments.ts
// - lib/api/seller.ts
// - lib/api/payouts.ts
// - lib/api/fulfillment.ts
// - lib/api/seller-applications.ts
// - lib/api/disputes.ts
// - lib/api/storefront.ts
// - lib/api/reviews.ts
// - lib/api/discovery.ts
// - lib/api/analytics.ts
// - lib/api/notifications.ts
// - lib/api/landing.ts

export const apiBase =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

async function handle(res: Response) {
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

// This file is deprecated. Please use the domain-specific API modules instead.
console.warn('Warning: lib/api.ts is deprecated. Please import from domain-specific modules in lib/api/ instead.');

// Exporting base utilities for backward compatibility
export { handle };

// Placeholder functions to prevent breaking changes
// These should not be used in new code

export function getProducts() {
  throw new Error('getProducts is deprecated. Import from lib/api/products.ts instead.');
}

export function getProduct(id: string) {
  throw new Error('getProduct is deprecated. Import from lib/api/products.ts instead.');
}

export function getTrendingProducts(limit = 8) {
  throw new Error('getTrendingProducts is deprecated. Import from lib/api/landing.ts instead.');
}

export function ensureCart(userId?: string, anonKey?: string) {
  throw new Error('ensureCart is deprecated. Import from lib/api/cart.ts instead.');
}

export function cartAdd(cartId: string, productId: string, qty: number) {
  throw new Error('cartAdd is deprecated. Import from lib/api/cart.ts instead.');
}

export function cartRemove(cartId: string, productId: string) {
  throw new Error('cartRemove is deprecated. Import from lib/api/cart.ts instead.');
}

export function cartClear(cartId: string) {
  throw new Error('cartClear is deprecated. Import from lib/api/cart.ts instead.');
}

export function createOrder(
  cartId: string,
  userId: string,
  total: number,
  currency: string,
  shippingAdr?: string
) {
  throw new Error('createOrder is deprecated. Import from lib/api/orders.ts instead.');
}

export function createPaymentIntent(
  orderId: string,
  provider: "flutterwave" | "paystack" | "stripe"
) {
  throw new Error('createPaymentIntent is deprecated. Import from lib/api/payments.ts instead.');
}

export function getPaymentStatus(orderId: string) {
  throw new Error('getPaymentStatus is deprecated. Import from lib/api/payments.ts instead.');
}

export function getSellerProducts(sellerId: string) {
  throw new Error('getSellerProducts is deprecated. Import from lib/api/seller.ts instead.');
}

export function createSellerProduct(data: {
  sellerId: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  imageUrl?: string;
}) {
  throw new Error('createSellerProduct is deprecated. Import from lib/api/seller.ts instead.');
}

export function updateSellerProduct(
  sellerId: string,
  productId: string,
  data: {
    title?: string;
    description?: string;
    price?: number;
    currency?: string;
    imageUrl?: string;
  }
) {
  throw new Error('updateSellerProduct is deprecated. Import from lib/api/seller.ts instead.');
}

export function updateSellerInventory(
  sellerId: string,
  productId: string,
  quantity: number
) {
  throw new Error('updateSellerInventory is deprecated. Import from lib/api/seller.ts instead.');
}

export function promoteToSeller(userId: string) {
  throw new Error('promoteToSeller is deprecated. Import from lib/api/seller.ts instead.');
}

export function sellerGetPendingPayout(sellerId: string) {
  throw new Error('sellerGetPendingPayout is deprecated. Import from lib/api/payouts.ts instead.');
}

export function sellerGetAllPayouts(sellerId: string) {
  throw new Error('sellerGetAllPayouts is deprecated. Import from lib/api/payouts.ts instead.');
}

export function sellerPayoutCsvUrl(sellerId: string) {
  throw new Error('sellerPayoutCsvUrl is deprecated. Import from lib/api/payouts.ts instead.');
}

export function adminMarkPaidOut(orderItemIds: string[], batchId: string) {
  throw new Error('adminMarkPaidOut is deprecated. Import from lib/api/payouts.ts instead.');
}

export function adminPayoutSummary() {
  throw new Error('adminPayoutSummary is deprecated. Import from lib/api/payouts.ts instead.');
}

export function getOrderTracking(orderId: string, userId: string) {
  throw new Error('getOrderTracking is deprecated. Import from lib/api/fulfillment.ts instead.');
}

export function sellerGetOpenFulfillment(sellerId: string) {
  throw new Error('sellerGetOpenFulfillment is deprecated. Import from lib/api/fulfillment.ts instead.');
}

export function sellerGetFulfillmentStats(sellerId: string) {
  throw new Error('sellerGetFulfillmentStats is deprecated. Import from lib/api/fulfillment.ts instead.');
}

export function sellerMarkShipped(
  orderItemId: string,
  sellerId: string,
  carrier?: string,
  trackingCode?: string,
  note?: string,
) {
  throw new Error('sellerMarkShipped is deprecated. Import from lib/api/fulfillment.ts instead.');
}

export function sellerMarkDelivered(
  orderItemId: string,
  sellerId: string,
  proofUrl?: string,
  note?: string,
) {
  throw new Error('sellerMarkDelivered is deprecated. Import from lib/api/fulfillment.ts instead.');
}

export function sellerMarkIssue(
  orderItemId: string,
  sellerId: string,
  note: string,
) {
  throw new Error('sellerMarkIssue is deprecated. Import from lib/api/fulfillment.ts instead.');
}

export function submitSellerApplication(data: {
  userId: string;
  businessName: string;
  phone: string;
  country: string;
  city: string;
  storefrontDesc: string;
}) {
  throw new Error('submitSellerApplication is deprecated. Import from lib/api/seller-applications.ts instead.');
}

export function getMySellerApplication(userId: string) {
  throw new Error('getMySellerApplication is deprecated. Import from lib/api/seller-applications.ts instead.');
}

export function getAdminPendingApplications(adminId: string) {
  throw new Error('getAdminPendingApplications is deprecated. Import from lib/api/seller-applications.ts instead.');
}

export function adminApproveApplication(
  appId: string,
  adminId: string,
  adminNote?: string,
) {
  throw new Error('adminApproveApplication is deprecated. Import from lib/api/seller-applications.ts instead.');
}

export function adminRejectApplication(
  appId: string,
  adminId: string,
  adminNote?: string,
) {
  throw new Error('adminRejectApplication is deprecated. Import from lib/api/seller-applications.ts instead.');
}

export function openDispute(data: {
  buyerId: string;
  orderItemId: string;
  reasonCode: string;
  description: string;
  photoProofUrl?: string;
}) {
  throw new Error('openDispute is deprecated. Import from lib/api/disputes.ts instead.');
}

export function getMyDisputes(buyerId: string) {
  throw new Error('getMyDisputes is deprecated. Import from lib/api/disputes.ts instead.');
}

export function sellerGetDisputes(sellerId: string) {
  throw new Error('sellerGetDisputes is deprecated. Import from lib/api/disputes.ts instead.');
}

export function resolveDispute(
  disputeId: string,
  actorId: string,
  status: string,
  resolutionNote?: string,
) {
  throw new Error('resolveDispute is deprecated. Import from lib/api/disputes.ts instead.');
}

export async function getStorefrontByHandle(handle: string) {
  throw new Error('getStorefrontByHandle is deprecated. Import from lib/api/storefront.ts instead.');
}

export function updateStorefront(
  userId: string,
  data: {
    shopName?: string;
    sellerHandle?: string;
    shopLogoUrl?: string;
    shopBannerUrl?: string;
    shopBio?: string;
    country?: string;
    city?: string;
  }
) {
  throw new Error('updateStorefront is deprecated. Import from lib/api/storefront.ts instead.');
}

export async function submitReview(data: {
  buyerId: string;
  orderItemId: string;
  rating: number;
  comment: string;
}) {
  throw new Error('submitReview is deprecated. Import from lib/api/reviews.ts instead.');
}

export async function getSellerReviews(handle: string) {
  throw new Error('getSellerReviews is deprecated. Import from lib/api/reviews.ts instead.');
}

export async function getDiscoveryHighlights() {
  throw new Error('getDiscoveryHighlights is deprecated. Import from lib/api/discovery.ts instead.');
}

export async function getCategoryPage(slug: string) {
  throw new Error('getCategoryPage is deprecated. Import from lib/api/discovery.ts instead.');
}

export async function getRegionPage(regionSlug: string) {
  throw new Error('getRegionPage is deprecated. Import from lib/api/discovery.ts instead.');
}

export async function getSellerAnalyticsSummary(sellerId: string) {
  return (await import('./api/analytics')).getSellerAnalyticsSummary(sellerId);
}

export async function getOpsSummary(adminId: string) {
  return (await import('./api/analytics')).getOpsSummary(adminId);
}

export async function getNotifications(
  userId: string,
  limit = 50,
  unreadOnly = false
) {
  throw new Error('getNotifications is deprecated. Import from lib/api/notifications.ts instead.');
}

export async function getUnreadCount(userId: string): Promise<number> {
  throw new Error('getUnreadCount is deprecated. Import from lib/api/notifications.ts instead.');
}

export async function markNotificationRead(
  notificationId: string,
  userId: string
) {
  throw new Error('markNotificationRead is deprecated. Import from lib/api/notifications.ts instead.');
}

export async function markAllNotificationsRead(userId: string) {
  throw new Error('markAllNotificationsRead is deprecated. Import from lib/api/notifications.ts instead.');
}

export async function deleteNotification(
  notificationId: string,
  userId: string
) {
  throw new Error('deleteNotification is deprecated. Import from lib/api/notifications.ts instead.');
}

export function getFeaturedSellers(limit = 6) {
  throw new Error('getFeaturedSellers is deprecated. Import from lib/api/storefront.ts instead.');
}
