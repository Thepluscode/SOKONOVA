// Social Service - API integration for social shopping features

import api from '../api';

interface Post {
    id: string;
    userId: string;
    user: {
        firstName: string;
        lastName: string;
        avatarUrl?: string;
    };
    content: string;
    productId?: string;
    product?: {
        id: string;
        title: string;
        price: number;
        imageUrl: string;
        rating: number;
    };
    likes: number;
    comments: number;
    liked: boolean;
    saved: boolean;
    createdAt: string;
}

interface SuggestedUser {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl?: string;
    followers: number;
    isFollowing: boolean;
}

export const socialService = {
    /**
     * Get social feed
     * GET /social/feed
     */
    getFeed: async (page: number = 1, type: 'feed' | 'trending' | 'following' = 'feed'): Promise<Post[]> => {
        return api.get<Post[]>(`/social/feed?page=${page}&type=${type}`);
    },

    /**
     * Get trending products
     * GET /social/trending
     */
    getTrending: async (limit: number = 10): Promise<any[]> => {
        return api.get(`/social/trending?limit=${limit}`);
    },

    /**
     * Get suggested users to follow
     * GET /social/suggested
     */
    getSuggested: async (): Promise<SuggestedUser[]> => {
        return api.get<SuggestedUser[]>('/social/suggested');
    },

    /**
     * Create a post
     * POST /social/posts
     */
    createPost: async (content: string, productId?: string): Promise<Post> => {
        return api.post<Post>('/social/posts', { content, productId });
    },

    /**
     * Like a post
     * POST /social/posts/:id/like
     */
    likePost: async (postId: string): Promise<{ likes: number }> => {
        return api.post(`/social/posts/${postId}/like`, {});
    },

    /**
     * Unlike a post
     * DELETE /social/posts/:id/like
     */
    unlikePost: async (postId: string): Promise<{ likes: number }> => {
        return api.delete(`/social/posts/${postId}/like`);
    },

    /**
     * Save a post
     * POST /social/posts/:id/save
     */
    savePost: async (postId: string): Promise<void> => {
        return api.post(`/social/posts/${postId}/save`, {});
    },

    /**
     * Follow a user
     * POST /social/follow/:userId
     */
    followUser: async (userId: string): Promise<void> => {
        return api.post(`/social/follow/${userId}`, {});
    },

    /**
     * Unfollow a user
     * DELETE /social/follow/:userId
     */
    unfollowUser: async (userId: string): Promise<void> => {
        return api.delete(`/social/follow/${userId}`);
    },

    /**
     * Get comments on a post
     * GET /social/posts/:id/comments
     */
    getComments: async (postId: string, page: number = 1): Promise<any[]> => {
        return api.get(`/social/posts/${postId}/comments?page=${page}`);
    },

    /**
     * Add comment to a post
     * POST /social/posts/:id/comments
     */
    addComment: async (postId: string, content: string): Promise<any> => {
        return api.post(`/social/posts/${postId}/comments`, { content });
    },

    /**
     * Share a product
     * POST /social/share
     */
    shareProduct: async (productId: string, message?: string): Promise<Post> => {
        return api.post<Post>('/social/share', { productId, message });
    },
};

export default socialService;
