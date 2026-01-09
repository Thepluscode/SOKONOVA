// Products Service - API integration for products module

import api, { buildQuery } from '../api';
import type { Product } from '../types';

interface ProductFilters {
    sellerId?: string;
    category?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    limit?: number;
    offset?: number;
    page?: number;
    pageSize?: number;
    sortBy?: 'price' | 'createdAt' | 'title';
    sortOrder?: 'asc' | 'desc';
}

interface PaginatedResponse<T> {
    data: T[];
    meta: {
        total: number;
        page: number;
        pageSize: number;
        totalPages: number;
    };
}

export const productsService = {
    /**
     * List all products with optional filters
     * GET /products
     */
    list: async (filters?: ProductFilters): Promise<Product[]> => {
        const query = filters ? buildQuery(filters as Record<string, string | number | boolean | undefined>) : '';
        return api.get<Product[]>(`/products${query}`);
    },

    /**
     * List products with pagination
     * GET /products?page=1&pageSize=20
     */
    listPaginated: async (filters?: ProductFilters): Promise<PaginatedResponse<Product>> => {
        const params = {
            page: filters?.page || 1,
            pageSize: filters?.pageSize || 20,
            ...filters,
        };
        const query = buildQuery(params as Record<string, string | number | boolean | undefined>);
        return api.get<PaginatedResponse<Product>>(`/products${query}`);
    },

    /**
     * Get product by ID
     * GET /products/:id
     */
    getById: async (id: string): Promise<Product> => {
        return api.get<Product>(`/products/${id}`);
    },

    /**
     * Get multiple products by IDs
     * GET /products?ids=id1,id2,id3
     */
    getByIds: async (ids: string[]): Promise<Product[]> => {
        return api.get<Product[]>(`/products?ids=${ids.join(',')}`);
    },

    /**
     * Get products by seller
     * GET /products?sellerId=...
     */
    getBySeller: async (sellerId: string): Promise<Product[]> => {
        return api.get<Product[]>(`/products?sellerId=${sellerId}`);
    },

    /**
     * Get products by category
     * GET /products?category=...
     */
    getByCategory: async (category: string): Promise<Product[]> => {
        return api.get<Product[]>(`/products?category=${category}`);
    },

    // Seller endpoints (require auth)

    /**
     * Create new product (seller)
     * POST /products
     */
    create: async (data: {
        sellerId: string;
        title: string;
        description: string;
        price: number;
        currency?: string;
        imageUrl?: string;
        category?: string;
    }): Promise<Product> => {
        return api.post<Product>('/products', data);
    },

    /**
     * Update product (seller)
     * PATCH /products/:id
     */
    update: async (id: string, data: Partial<{
        title: string;
        description: string;
        price: number;
        currency: string;
        imageUrl: string;
        category: string;
    }>): Promise<Product> => {
        return api.patch<Product>(`/products/${id}`, data);
    },

    /**
     * Update inventory quantity (seller)
     * PATCH /products/:id/inventory
     */
    updateInventory: async (id: string, quantity: number): Promise<Product> => {
        return api.patch<Product>(`/products/${id}/inventory`, { quantity });
    },
};

export default productsService;
