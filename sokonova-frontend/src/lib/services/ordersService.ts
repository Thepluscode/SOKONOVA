// Orders Service - API integration for orders module

import api from '../api';
import type { Order, CreateOrderDto } from '../types';

export const ordersService = {
    /**
     * Get orders for current user
     * GET /orders/mine
     */
    listMine: async (): Promise<Order[]> => {
        return api.get<Order[]>('/orders/mine');
    },
    /**
     * Admin: get orders for a user
     * GET /orders/user/:userId
     */
    listForUser: async (userId: string): Promise<Order[]> => {
        return api.get<Order[]>(`/orders/user/${userId}`);
    },
    /**
     * Seller: get orders that include seller items
     * GET /orders/seller
     */
    listForSeller: async (sellerId?: string): Promise<Order[]> => {
        const query = sellerId ? `?sellerId=${sellerId}` : '';
        return api.get<Order[]>(`/orders/seller${query}`);
    },

    /**
     * Create order from cart
     * POST /orders/create?cartId=...
     */
    create: async (dto: CreateOrderDto, cartId: string): Promise<Order> => {
        return api.post<Order>(`/orders/create?cartId=${cartId}`, dto);
    },

    /**
     * Get order by ID
     * GET /orders/:id
     */
    getById: async (id: string): Promise<Order> => {
        return api.get<Order>(`/orders/${id}`);
    },
};

export default ordersService;
