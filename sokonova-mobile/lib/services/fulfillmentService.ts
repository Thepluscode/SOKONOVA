// Fulfillment Service - API integration for fulfillment/shipping module

import api from '../api';

interface DeliveryEstimate {
    estimatedDays: number;
    estimatedDate: string;
    confidence: 'high' | 'medium' | 'low';
}

interface ShippingOption {
    carrier: string;
    name: string;
    price: number;
    estimatedDays: number;
}

interface TrackingInfo {
    trackingNumber: string;
    carrier: string;
    status: string;
    events: Array<{
        timestamp: string;
        description: string;
        location?: string;
    }>;
}

interface FulfillmentStats {
    pending: number;
    shipped: number;
    delivered: number;
    issues: number;
}

export const fulfillmentService = {
    // ========== Buyer Endpoints ==========

    /**
     * Get delivery estimate for product
     * GET /fulfillment/products/:productId/delivery-estimate
     */
    getDeliveryEstimate: async (productId: string, location?: string): Promise<DeliveryEstimate> => {
        const query = location ? `?location=${encodeURIComponent(location)}` : '';
        return api.get<DeliveryEstimate>(`/fulfillment/products/${productId}/delivery-estimate${query}`);
    },

    /**
     * Get shipping options for items
     * POST /fulfillment/shipping-options
     */
    getShippingOptions: async (
        items: Array<{ productId: string; quantity: number }>,
        location?: string
    ): Promise<ShippingOption[]> => {
        return api.post<ShippingOption[]>('/fulfillment/shipping-options', { items, location });
    },

    /**
     * Track shipment by tracking number
     * GET /fulfillment/track/:trackingNumber
     */
    trackShipment: async (trackingNumber: string): Promise<TrackingInfo> => {
        return api.get<TrackingInfo>(`/fulfillment/track/${trackingNumber}`);
    },

    /**
     * Get order tracking status
     * GET /fulfillment/tracking/:orderId
     */
    getOrderTracking: async (orderId: string): Promise<unknown> => {
        return api.get(`/fulfillment/tracking/${orderId}`);
    },

    // ========== Seller Endpoints ==========

    /**
     * Get seller's open fulfillment queue
     * GET /fulfillment/seller/open
     */
    getSellerOpenFulfillment: async (): Promise<unknown[]> => {
        return api.get<unknown[]>(`/fulfillment/seller/open`);
    },

    /**
     * Get seller fulfillment stats
     * GET /fulfillment/seller/stats
     */
    getSellerStats: async (): Promise<FulfillmentStats> => {
        return api.get<FulfillmentStats>(`/fulfillment/seller/stats`);
    },

    /**
     * Mark item as shipped
     * PATCH /fulfillment/seller/ship/:orderItemId
     */
    markShipped: async (
        orderItemId: string,
        data: { carrier?: string; trackingCode?: string; note?: string }
    ): Promise<unknown> => {
        return api.patch(`/fulfillment/seller/ship/${orderItemId}`, data);
    },

    /**
     * Mark item as delivered
     * PATCH /fulfillment/seller/deliver/:orderItemId
     */
    markDelivered: async (
        orderItemId: string,
        data: { proofUrl?: string; note?: string }
    ): Promise<unknown> => {
        return api.patch(`/fulfillment/seller/deliver/${orderItemId}`, data);
    },

    /**
     * Mark item with issue
     * PATCH /fulfillment/seller/issue/:orderItemId
     */
    markIssue: async (
        orderItemId: string,
        note: string
    ): Promise<unknown> => {
        return api.patch(`/fulfillment/seller/issue/${orderItemId}`, { note });
    },

    /**
     * Get delivery promise for product display
     * GET /fulfillment/delivery-promise/:productId
     */
    getDeliveryPromise: async (productId: string, location?: string): Promise<DeliveryEstimate> => {
        const query = location ? `?location=${encodeURIComponent(location)}` : '';
        return api.get<DeliveryEstimate>(`/fulfillment/delivery-promise/${productId}${query}`);
    },
};

export default fulfillmentService;
