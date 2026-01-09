// lib/api/api-partner-platform.ts
import { apiBase, apiFetch } from "./base";

/**
 * Register as a partner
 */
export function registerPartner(data: {
  companyName: string;
  contactEmail: string;
  apiKeyName: string;
}) {
  return apiFetch(`${apiBase}/api-partners/register`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * Generate API key
 */
export function generateApiKey(partnerId: string) {
  return apiFetch(`${apiBase}/api-partners/${partnerId}/generate-key`, {
    method: "POST",
  });
}

/**
 * Get products
 */
export function getPartnerProducts(apiKey: string, filters?: {
  limit?: number;
  offset?: number;
  category?: string;
}) {
  const params = new URLSearchParams();
  if (filters?.limit) params.append('limit', filters.limit.toString());
  if (filters?.offset) params.append('offset', filters.offset.toString());
  if (filters?.category) params.append('category', filters.category);
  
  const queryString = params.toString() ? `?${params.toString()}` : '';
  
  return apiFetch(`${apiBase}/api-partners/products${queryString}`, {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
    },
  });
}

/**
 * Get product by ID
 */
export function getPartnerProductById(apiKey: string, id: string) {
  return apiFetch(`${apiBase}/api-partners/products/${id}`, {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
    },
  });
}

/**
 * Create order
 */
export function createPartnerOrder(apiKey: string, data: {
  productId: string;
  quantity: number;
  customerInfo: {
    name: string;
    email: string;
    address: string;
  };
}) {
  return apiFetch(`${apiBase}/api-partners/orders`, {
    method: "POST",
    headers: {
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify(data),
  });
}

/**
 * Get all partners (admin only)
 */
export function getAllPartners(adminId: string) {
  return apiFetch(`${apiBase}/api-partners/admin/all?adminId=${adminId}`);
}

/**
 * Get partner by ID (admin only)
 */
export function getPartnerById(id: string, adminId: string) {
  return apiFetch(`${apiBase}/api-partners/${id}?adminId=${adminId}`);
}

/**
 * Update partner status (admin only)
 */
export function updatePartnerStatus(id: string, adminId: string, status: string) {
  return apiFetch(`${apiBase}/api-partners/${id}/status`, {
    method: "PUT",
    body: JSON.stringify({ adminId, status }),
  });
}

/**
 * Create webhook (admin only)
 */
export function createWebhook(partnerId: string, adminId: string, data: {
  url: string;
  events: string[];
  secret: string;
}) {
  return apiFetch(`${apiBase}/api-partners/${partnerId}/webhooks`, {
    method: "POST",
    body: JSON.stringify({ adminId, ...data }),
  });
}

/**
 * Get partner webhooks (admin only)
 */
export function getPartnerWebhooks(partnerId: string, adminId: string) {
  return apiFetch(`${apiBase}/api-partners/${partnerId}/webhooks?adminId=${adminId}`);
}

/**
 * Update webhook (admin only)
 */
export function updateWebhook(webhookId: string, adminId: string, data: {
  url?: string;
  events?: string[];
  secret?: string;
  active?: boolean;
}) {
  return apiFetch(`${apiBase}/api-partners/webhooks/${webhookId}`, {
    method: "PUT",
    body: JSON.stringify({ adminId, ...data }),
  });
}

/**
 * Delete webhook (admin only)
 */
export function deleteWebhook(webhookId: string, adminId: string) {
  return apiFetch(`${apiBase}/api-partners/webhooks/${webhookId}`, {
    method: "DELETE",
    body: JSON.stringify({ adminId }),
  });
}

/**
 * Get webhook deliveries (admin only)
 */
export function getWebhookDeliveries(webhookId: string, adminId: string) {
  return apiFetch(`${apiBase}/api-partners/webhooks/${webhookId}/deliveries?adminId=${adminId}`);
}