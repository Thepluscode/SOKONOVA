// Wishlist Service - API integration for user wishlists

import api from '../api';
import type { Product } from '../types';

interface WishlistItem {
    id: string;
    userId: string;
    productId: string;
    product?: Product;
    addedAt: string;
}

// Local storage fallback for anonymous users
const WISHLIST_KEY = 'wishlist_items';

function getLocalWishlist(): string[] {
    try {
        return JSON.parse(localStorage.getItem(WISHLIST_KEY) || '[]');
    } catch {
        return [];
    }
}

function setLocalWishlist(items: string[]): void {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(items));
}

export const wishlistService = {
    /**
     * Get user's wishlist items
     * GET /wishlist/user/:userId
     */
    getItems: async (userId: string): Promise<WishlistItem[]> => {
        return api.get<WishlistItem[]>(`/wishlist/user/${userId}`);
    },

    /**
     * Add item to wishlist
     * POST /wishlist
     */
    addItem: async (userId: string, productId: string): Promise<WishlistItem> => {
        return api.post<WishlistItem>('/wishlist', { userId, productId });
    },

    /**
     * Remove item from wishlist
     * DELETE /wishlist/:itemId
     */
    removeItem: async (itemId: string): Promise<void> => {
        return api.delete(`/wishlist/${itemId}`);
    },

    /**
     * Remove by product ID
     * DELETE /wishlist/product/:productId
     */
    removeByProduct: async (userId: string, productId: string): Promise<void> => {
        return api.delete(`/wishlist/user/${userId}/product/${productId}`);
    },

    /**
     * Clear all wishlist items
     * DELETE /wishlist/user/:userId/clear
     */
    clearAll: async (userId: string): Promise<void> => {
        return api.delete(`/wishlist/user/${userId}/clear`);
    },

    /**
     * Check if product is in wishlist
     * GET /wishlist/check/:productId
     */
    isInWishlist: async (userId: string, productId: string): Promise<boolean> => {
        try {
            const result = await api.get<{ inWishlist: boolean }>(`/wishlist/user/${userId}/check/${productId}`);
            return result.inWishlist;
        } catch {
            return false;
        }
    },

    // Anonymous user fallback methods (localStorage)
    local: {
        getItems: (): string[] => getLocalWishlist(),

        addItem: (productId: string): void => {
            const items = getLocalWishlist();
            if (!items.includes(productId)) {
                items.push(productId);
                setLocalWishlist(items);
            }
        },

        removeItem: (productId: string): void => {
            const items = getLocalWishlist().filter(id => id !== productId);
            setLocalWishlist(items);
        },

        clearAll: (): void => {
            setLocalWishlist([]);
        },

        isInWishlist: (productId: string): boolean => {
            return getLocalWishlist().includes(productId);
        },
    },
};

export default wishlistService;
