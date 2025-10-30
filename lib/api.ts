// lib/api.ts
export const apiBase =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

async function handle(res: Response) {
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

// Products
export function getProducts() {
  return fetch(`${apiBase}/products`, {
    cache: "no-store",
  }).then(handle);
}

export function getProduct(id: string) {
  return fetch(`${apiBase}/products/${id}`, {
    cache: "no-store",
  }).then(handle);
}

// Cart lifecycle
export function ensureCart(userId?: string, anonKey?: string) {
  const params = new URLSearchParams();
  if (userId) params.set("userId", userId);
  if (!userId && anonKey) params.set("anonKey", anonKey);

  return fetch(`${apiBase}/cart?${params.toString()}`, {
    cache: "no-store",
    credentials: "include",
  }).then(handle);
}

export function cartAdd(cartId: string, productId: string, qty: number) {
  return fetch(`${apiBase}/cart/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cartId, productId, qty }),
    credentials: "include",
  }).then(handle);
}

export function cartRemove(cartId: string, productId: string) {
  const u = new URLSearchParams({ cartId, productId });
  return fetch(`${apiBase}/cart/remove?${u.toString()}`, {
    method: "DELETE",
    credentials: "include",
  }).then(handle);
}

export function cartClear(cartId: string) {
  const u = new URLSearchParams({ cartId });
  return fetch(`${apiBase}/cart/clear?${u.toString()}`, {
    method: "DELETE",
    credentials: "include",
  }).then(handle);
}

// Orders
export function createOrder(
  cartId: string,
  userId: string,
  total: number,
  currency: string,
  shippingAdr?: string
) {
  const u = new URLSearchParams({ cartId });
  return fetch(`${apiBase}/orders/create?${u.toString()}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, total, currency, shippingAdr }),
    credentials: "include",
  }).then(handle);
}

// Payments
export function createPaymentIntent(
  orderId: string,
  provider: "flutterwave" | "paystack" | "stripe"
) {
  return fetch(`${apiBase}/payments/intent`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ orderId, provider }),
    credentials: "include",
  }).then(handle);
}

export function getPaymentStatus(orderId: string) {
  return fetch(`${apiBase}/payments/${orderId}`, {
    cache: "no-store",
    credentials: "include",
  }).then(handle);
}

// ========== SELLER ENDPOINTS ==========

/**
 * Get all products for a seller
 */
export function getSellerProducts(sellerId: string) {
  return fetch(`${apiBase}/seller/products?sellerId=${sellerId}`, {
    cache: "no-store",
    credentials: "include",
  }).then(handle);
}

/**
 * Create a new product (seller)
 */
export function createSellerProduct(data: {
  sellerId: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  imageUrl?: string;
}) {
  return fetch(`${apiBase}/seller/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  }).then(handle);
}

/**
 * Update product details (seller)
 */
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
  return fetch(`${apiBase}/seller/products/${productId}?sellerId=${sellerId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  }).then(handle);
}

/**
 * Update product inventory (seller)
 */
export function updateSellerInventory(
  sellerId: string,
  productId: string,
  quantity: number
) {
  return fetch(`${apiBase}/seller/products/${productId}/inventory?sellerId=${sellerId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ quantity }),
    credentials: "include",
  }).then(handle);
}

/**
 * Promote a user to seller role
 * In production, this would require admin approval or payment
 */
export function promoteToSeller(userId: string) {
  return fetch(`${apiBase}/users/${userId}/promote-seller`, {
    method: "POST",
    credentials: "include",
  }).then(handle);
}

// ========== PAYOUT ENDPOINTS ==========

/**
 * Get pending (unpaid) earnings for a seller
 * Returns gross sales, fees, and net amount owed
 */
export function sellerGetPendingPayout(sellerId: string) {
  const params = new URLSearchParams({ sellerId });
  return fetch(`${apiBase}/payouts/seller/pending?${params.toString()}`, {
    cache: "no-store",
    credentials: "include",
  }).then(handle);
}

/**
 * Get all earnings history (pending and paid) for a seller
 */
export function sellerGetAllPayouts(sellerId: string) {
  const params = new URLSearchParams({ sellerId });
  return fetch(`${apiBase}/payouts/seller/all?${params.toString()}`, {
    cache: "no-store",
    credentials: "include",
  }).then(handle);
}

/**
 * Get CSV download URL for seller earnings
 * Use this for bank transfer / mobile money reconciliation
 */
export function sellerPayoutCsvUrl(sellerId: string) {
  const params = new URLSearchParams({ sellerId });
  return `${apiBase}/payouts/seller/csv?${params.toString()}`;
}

/**
 * Admin: Mark order items as paid out
 */
export function adminMarkPaidOut(orderItemIds: string[], batchId: string) {
  return fetch(`${apiBase}/payouts/admin/mark-paid`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ orderItemIds, batchId }),
    credentials: "include",
  }).then(handle);
}

/**
 * Admin: Get payout summary for all sellers
 */
export function adminPayoutSummary() {
  return fetch(`${apiBase}/payouts/admin/summary`, {
    cache: "no-store",
    credentials: "include",
  }).then(handle);
}

// ========== FULFILLMENT ENDPOINTS ==========

/**
 * Buyer: Get order tracking information
 */
export function getOrderTracking(orderId: string, userId: string) {
  const params = new URLSearchParams({ userId });
  return fetch(`${apiBase}/fulfillment/tracking/${orderId}?${params.toString()}`, {
    cache: "no-store",
    credentials: "include",
  }).then(handle);
}

/**
 * Seller: Get open fulfillment queue (items to ship)
 */
export function sellerGetOpenFulfillment(sellerId: string) {
  const params = new URLSearchParams({ sellerId });
  return fetch(`${apiBase}/fulfillment/seller/open?${params.toString()}`, {
    cache: "no-store",
    credentials: "include",
  }).then(handle);
}

/**
 * Seller: Get fulfillment statistics
 */
export function sellerGetFulfillmentStats(sellerId: string) {
  const params = new URLSearchParams({ sellerId });
  return fetch(`${apiBase}/fulfillment/seller/stats?${params.toString()}`, {
    cache: "no-store",
    credentials: "include",
  }).then(handle);
}

/**
 * Seller: Mark item as shipped
 */
export function sellerMarkShipped(
  orderItemId: string,
  sellerId: string,
  carrier?: string,
  trackingCode?: string,
  note?: string,
) {
  const params = new URLSearchParams({ sellerId });
  return fetch(`${apiBase}/fulfillment/seller/ship/${orderItemId}?${params.toString()}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ carrier, trackingCode, note }),
    credentials: "include",
  }).then(handle);
}

/**
 * Seller: Mark item as delivered
 */
export function sellerMarkDelivered(
  orderItemId: string,
  sellerId: string,
  proofUrl?: string,
  note?: string,
) {
  const params = new URLSearchParams({ sellerId });
  return fetch(`${apiBase}/fulfillment/seller/deliver/${orderItemId}?${params.toString()}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ proofUrl, note }),
    credentials: "include",
  }).then(handle);
}

/**
 * Seller: Mark item as having an issue
 */
export function sellerMarkIssue(
  orderItemId: string,
  sellerId: string,
  note: string,
) {
  const params = new URLSearchParams({ sellerId });
  return fetch(`${apiBase}/fulfillment/seller/issue/${orderItemId}?${params.toString()}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ note }),
    credentials: "include",
  }).then(handle);
}

// ========================================
// SELLER APPLICATIONS
// ========================================

/**
 * Submit seller application
 */
export function submitSellerApplication(data: {
  userId: string;
  businessName: string;
  phone: string;
  country: string;
  city: string;
  storefrontDesc: string;
}) {
  return fetch(`${apiBase}/seller-applications/apply`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  }).then(handle);
}

/**
 * Check my application status
 */
export function getMySellerApplication(userId: string) {
  const qs = new URLSearchParams({ userId });
  return fetch(`${apiBase}/seller-applications/mine?${qs.toString()}`, {
    cache: "no-store",
    credentials: "include",
  }).then(async (res) => {
    if (!res.ok) return null;
    return res.json();
  });
}

/**
 * Admin: Get pending applications
 */
export function getAdminPendingApplications(adminId: string) {
  const qs = new URLSearchParams({ adminId });
  return fetch(`${apiBase}/seller-applications/pending?${qs.toString()}`, {
    cache: "no-store",
    credentials: "include",
  }).then(handle);
}

/**
 * Admin: Approve application
 */
export function adminApproveApplication(
  appId: string,
  adminId: string,
  adminNote?: string,
) {
  return fetch(`${apiBase}/seller-applications/${appId}/approve`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ adminId, adminNote }),
  }).then(handle);
}

/**
 * Admin: Reject application
 */
export function adminRejectApplication(
  appId: string,
  adminId: string,
  adminNote?: string,
) {
  return fetch(`${apiBase}/seller-applications/${appId}/reject`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ adminId, adminNote }),
  }).then(handle);
}

// ========================================
// DISPUTES
// ========================================

/**
 * Buyer: Open a dispute
 */
export function openDispute(data: {
  buyerId: string;
  orderItemId: string;
  reasonCode: string;
  description: string;
  photoProofUrl?: string;
}) {
  return fetch(`${apiBase}/disputes/open`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  }).then(handle);
}

/**
 * Buyer: List my disputes
 */
export function getMyDisputes(buyerId: string) {
  const qs = new URLSearchParams({ buyerId });
  return fetch(`${apiBase}/disputes/mine?${qs.toString()}`, {
    cache: "no-store",
    credentials: "include",
  }).then(handle);
}

/**
 * Seller: View disputes involving their items
 */
export function sellerGetDisputes(sellerId: string) {
  const qs = new URLSearchParams({ sellerId });
  return fetch(`${apiBase}/disputes/seller?${qs.toString()}`, {
    cache: "no-store",
    credentials: "include",
  }).then(handle);
}

/**
 * Seller/Admin: Resolve dispute
 */
export function resolveDispute(
  disputeId: string,
  actorId: string,
  status: string,
  resolutionNote?: string,
) {
  return fetch(`${apiBase}/disputes/${disputeId}/resolve`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ actorId, status, resolutionNote }),
  }).then(handle);
}

/**
 * PUBLIC: Get storefront by seller handle
 */
export async function getStorefrontByHandle(handle: string) {
  const res = await fetch(`${apiBase}/storefront/handle/${handle}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Storefront not found");
  return res.json(); // { seller, products }
}

/**
 * Seller: Update storefront profile
 */
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
  return fetch(`${apiBase}/users/${userId}/storefront`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  }).then(handle);
}


/**
 * Buyer: Submit a review for a delivered item
 */
export async function submitReview(data: {
  buyerId: string;
  orderItemId: string;
  rating: number;
  comment: string;
}) {
  const res = await fetch(`${apiBase}/reviews/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to submit review");
  return res.json();
}

/**
 * PUBLIC: Get reviews for a seller's storefront
 */
export async function getSellerReviews(handle: string) {
  const res = await fetch(`${apiBase}/reviews/seller/${handle}`, {
    cache: "no-store",
  });
  if (!res.ok) {
    // do not hard-crash storefront if no reviews yet
    return { seller: null, reviews: [] };
  }
  return res.json();
}


/**
 * PUBLIC: Get discovery highlights (categories + regions with featured sellers)
 */
export async function getDiscoveryHighlights() {
  const res = await fetch(`${apiBase}/discovery/highlights`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to load discovery highlights");
  return res.json();
}

/**
 * PUBLIC: Get category page data (sellers + products for a category)
 */
export async function getCategoryPage(slug: string) {
  const res = await fetch(`${apiBase}/discovery/by-category/${slug}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to load category page");
  return res.json(); // { slug, sellers, products }
}

/**
 * PUBLIC: Get region page data (sellers + products for a region)
 */
export async function getRegionPage(regionSlug: string) {
  const res = await fetch(`${apiBase}/discovery/by-region/${regionSlug}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to load region page");
  return res.json(); // { region, sellers, products }
}

/**
 * SELLER: Get analytics summary (revenue, top SKUs, dispute rate, rating trend)
 */
export function getSellerAnalyticsSummary(sellerId: string) {
  const params = new URLSearchParams({ sellerId });
  return fetch(
    `${apiBase}/analytics/seller/summary?${params.toString()}`,
    {
      cache: "no-store",
      credentials: "include",
    }
  ).then(async (res) => {
    if (!res.ok) throw new Error("analytics summary failed");
    return res.json();
  });
}

/**
 * ADMIN: Get ops summary (GMV, categories, sellers, disputes, payout liability)
 */
export async function getOpsSummary(adminId: string) {
  const base = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";
  const qs = new URLSearchParams({ adminId });
  const res = await fetch(`${base}/admin/ops/summary?${qs.toString()}`, {
    cache: "no-store",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to load ops summary");
  return res.json();
}

// ========================================
// NOTIFICATIONS
// ========================================

/**
 * Get notifications for a user
 */
export async function getNotifications(
  userId: string,
  limit = 50,
  unreadOnly = false
) {
  const params = new URLSearchParams({ userId, limit: limit.toString() });
  if (unreadOnly) params.set("unreadOnly", "true");

  const res = await fetch(`${apiBase}/notifications?${params.toString()}`, {
    cache: "no-store",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to load notifications");
  return res.json();
}

/**
 * Get unread notification count
 */
export async function getUnreadCount(userId: string): Promise<number> {
  const res = await fetch(
    `${apiBase}/notifications/unread-count?userId=${userId}`,
    {
      cache: "no-store",
      credentials: "include",
    }
  );
  if (!res.ok) throw new Error("Failed to load unread count");
  const data = await res.json();
  return Number(data);
}

/**
 * Mark a notification as read
 */
export async function markNotificationRead(
  notificationId: string,
  userId: string
) {
  const res = await fetch(`${apiBase}/notifications/${notificationId}/read`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ userId }),
  });
  if (!res.ok) throw new Error("Failed to mark notification as read");
  return res.json();
}

/**
 * Mark all notifications as read
 */
export async function markAllNotificationsRead(userId: string) {
  const res = await fetch(`${apiBase}/notifications/mark-all-read`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ userId }),
  });
  if (!res.ok) throw new Error("Failed to mark all notifications as read");
  return res.json();
}

/**
 * Delete a notification
 */
export async function deleteNotification(
  notificationId: string,
  userId: string
) {
  const res = await fetch(`${apiBase}/notifications/${notificationId}/delete`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ userId }),
  });
  if (!res.ok) throw new Error("Failed to delete notification");
  return res.json();
}

// ========================================
// LANDING PAGE
// ========================================

/**
 * Get trending products for homepage
 */
export async function getTrendingProducts(limit = 8) {
  const res = await fetch(`${apiBase}/products?limit=${limit}`, {
    cache: "no-store",
  });
  if (!res.ok) return [];
  return res.json();
}

/**
 * Get featured sellers for homepage
 */
export async function getFeaturedSellers(limit = 6) {
  const res = await fetch(`${apiBase}/storefront/featured?limit=${limit}`, {
    cache: "no-store",
  });
  if (!res.ok) {
    // Fallback: get top-rated sellers
    const usersRes = await fetch(
      `${apiBase}/users?role=SELLER&sortBy=rating&limit=${limit}`,
      { cache: "no-store" }
    );
    if (!usersRes.ok) return [];
    return usersRes.json();
  }
  return res.json();
}
