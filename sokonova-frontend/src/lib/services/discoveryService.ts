// Discovery Service - API integration for search + discovery endpoints

import api, { buildQuery } from '../api';
import type { Product } from '../types';

export interface DiscoverySearchParams {
  q?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  inStock?: boolean;
  country?: string;
  sellerId?: string;
  sort?: 'trending' | 'newest' | 'price_asc' | 'price_desc' | 'rating' | 'popular';
  page?: number;
  limit?: number;
}

export interface DiscoverySearchResponse {
  items: Product[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const discoveryService = {
  /**
   * Search products with paging + filters
   * GET /discovery/search
   */
  search: async (params: DiscoverySearchParams): Promise<DiscoverySearchResponse> => {
    const query = buildQuery(params as Record<string, string | number | boolean | undefined>);
    return api.get<DiscoverySearchResponse>(`/discovery/products-search${query}`);
  },
};

export default discoveryService;
