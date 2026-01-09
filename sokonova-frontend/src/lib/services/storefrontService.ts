// Storefront Service - API integration for sellers and store pages

import api from '../api';

interface Seller {
    id: string;
    name: string;
    handle: string;
    description?: string;
    image?: string;
    rating: number;
    totalReviews: number;
    totalProducts: number;
    location: string;
    verified: boolean;
    badge?: string;
    userId: string;
    createdAt: string;
}

interface StorefrontDetails {
    seller: Seller;
    products: any[];
    categories: string[];
    ratings: {
        average: number;
        total: number;
        distribution: { [key: number]: number };
    };
}

export const storefrontService = {
    /**
     * List all verified sellers
     * GET /storefront/sellers
     */
    listSellers: async (filters?: { category?: string; location?: string; search?: string }): Promise<Seller[]> => {
        const params = new URLSearchParams();
        if (filters?.category) params.append('category', filters.category);
        if (filters?.location) params.append('location', filters.location);
        if (filters?.search) params.append('search', filters.search);
        const query = params.toString() ? `?${params.toString()}` : '';
        return api.get<Seller[]>(`/storefront/sellers${query}`);
    },

    /**
     * Get a seller's storefront by handle
     * GET /storefront/:handle
     */
    getByHandle: async (handle: string): Promise<StorefrontDetails> => {
        return api.get<StorefrontDetails>(`/storefront/${handle}`);
    },

    /**
     * Get seller by ID
     * GET /storefront/seller/:id
     */
    getById: async (id: string): Promise<Seller> => {
        return api.get<Seller>(`/storefront/seller/${id}`);
    },

    /**
     * Get seller products
     * GET /storefront/:handle/products
     */
    getProducts: async (handle: string, options?: { page?: number; limit?: number; category?: string }): Promise<any[]> => {
        const params = new URLSearchParams();
        if (options?.page) params.append('page', options.page.toString());
        if (options?.limit) params.append('limit', options.limit.toString());
        if (options?.category) params.append('category', options.category);
        const query = params.toString() ? `?${params.toString()}` : '';
        return api.get(`/storefront/${handle}/products${query}`);
    },

    /**
     * Get seller reviews
     * GET /storefront/:handle/reviews
     */
    getReviews: async (handle: string, page: number = 1): Promise<any[]> => {
        return api.get(`/storefront/${handle}/reviews?page=${page}`);
    },

    /**
     * Follow a seller
     * POST /storefront/:handle/follow
     */
    follow: async (handle: string): Promise<{ following: boolean }> => {
        return api.post(`/storefront/${handle}/follow`, {});
    },

    /**
     * Unfollow a seller
     * DELETE /storefront/:handle/follow
     */
    unfollow: async (handle: string): Promise<{ following: boolean }> => {
        return api.delete(`/storefront/${handle}/follow`);
    },

    /**
     * Get featured sellers for homepage
     * GET /storefront/featured
     */
    getFeatured: async (limit: number = 8): Promise<Seller[]> => {
        return api.get<Seller[]>(`/storefront/featured?limit=${limit}`);
    },
};

export default storefrontService;
