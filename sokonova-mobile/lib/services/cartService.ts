// Cart Service - API integration for cart module

import api from '../api';
import type { Cart } from '../types';

// Anonymous key for guest carts
const ANON_KEY_STORAGE = 'sokonova_anon_cart_key';

function getAnonKey(): string {
    let key = localStorage.getItem(ANON_KEY_STORAGE);
    if (!key) {
        key = `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem(ANON_KEY_STORAGE, key);
    }
    return key;
}

export const cartService = {
    /**
     * Get or create cart for user
     * GET /cart?userId=...&anonKey=...
     */
    get: async (userId?: string): Promise<Cart> => {
        const params = userId
            ? `userId=${userId}`
            : `anonKey=${getAnonKey()}`;
        return api.get<Cart>(`/cart?${params}`);
    },

    /**
     * Add item to cart
     * POST /cart/add
     */
    addItem: async (cartId: string, productId: string, qty: number = 1): Promise<Cart> => {
        return api.post<Cart>('/cart/add', { cartId, productId, qty });
    },

    /**
     * Remove item from cart
     * DELETE /cart/remove?cartId=...&productId=...
     */
    removeItem: async (cartId: string, productId: string): Promise<Cart> => {
        return api.delete<Cart>(`/cart/remove?cartId=${cartId}&productId=${productId}`);
    },

    /**
     * Clear entire cart
     * DELETE /cart/clear?cartId=...
     */
    clear: async (cartId: string): Promise<Cart> => {
        return api.delete<Cart>(`/cart/clear?cartId=${cartId}`);
    },

    /**
     * Update item quantity (convenience method)
     * Removes item if qty is 0, otherwise adds/updates
     */
    updateQuantity: async (cartId: string, productId: string, qty: number): Promise<Cart> => {
        if (qty <= 0) {
            return cartService.removeItem(cartId, productId);
        }
        return cartService.addItem(cartId, productId, qty);
    },
};

export default cartService;
