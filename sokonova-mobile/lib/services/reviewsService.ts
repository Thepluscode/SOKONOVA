// Reviews Service - API integration for product reviews

import api from '../api';

interface Review {
    id: string;
    productId: string;
    userId: string;
    rating: number;
    title?: string;
    content: string;
    images?: string[];
    verified: boolean;
    helpful: number;
    createdAt: string;
    user?: {
        firstName: string;
        lastName: string;
        avatarUrl?: string;
    };
}

interface ReviewSummary {
    average: number;
    total: number;
    distribution: { [key: number]: number };
}

export const reviewsService = {
    /**
     * Get reviews for a product
     * GET /reviews/product/:productId
     */
    getByProduct: async (productId: string, page: number = 1): Promise<Review[]> => {
        return api.get<Review[]>(`/reviews/product/${productId}?page=${page}`);
    },

    /**
     * Get review summary for a product
     * GET /reviews/product/:productId/summary
     */
    getSummary: async (productId: string): Promise<ReviewSummary> => {
        return api.get<ReviewSummary>(`/reviews/product/${productId}/summary`);
    },

    /**
     * Create a review
     * POST /reviews
     */
    create: async (data: {
        orderItemId: string;
        rating: number;
        comment: string;
    }): Promise<Review> => {
        return api.post<Review>('/reviews', data);
    },

    /**
     * Update a review
     * PATCH /reviews/:id
     */
    update: async (id: string, data: Partial<{
        rating: number;
        comment: string;
    }>): Promise<Review> => {
        return api.patch<Review>(`/reviews/${id}`, data);
    },

    /**
     * Delete a review
     * DELETE /reviews/:id
     */
    delete: async (id: string): Promise<void> => {
        return api.delete(`/reviews/${id}`);
    },

    /**
     * Mark review as helpful
     * POST /reviews/:id/helpful
     */
    markHelpful: async (id: string): Promise<{ helpful: number }> => {
        return api.post(`/reviews/${id}/helpful`, {});
    },

    /**
     * Get user's reviews
     * GET /reviews/user/:userId
     */
    getByUser: async (userId: string): Promise<Review[]> => {
        return api.get<Review[]>(`/reviews/user/${userId}`);
    },

    /**
     * Get pending reviews (products ordered but not reviewed)
     * GET /reviews/pending
     */
    getPending: async (): Promise<{ productId: string; orderId: string; product: any }[]> => {
        return api.get('/reviews/pending');
    },
};

export default reviewsService;
