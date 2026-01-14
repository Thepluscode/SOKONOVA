// Disputes Service - API integration for disputes module

import api from '../api';

interface Dispute {
  id: string;
  orderItemId: string;
  buyerId: string;
  reasonCode: string;
  description: string;
  status: string;
  createdAt: string;
}

export const disputesService = {
  /**
   * Open a dispute
   * POST /disputes/open
   */
  open: async (data: {
    orderItemId: string;
    reasonCode: string;
    description: string;
    photoProofUrl?: string;
  }): Promise<Dispute> => {
    return api.post<Dispute>('/disputes/open', data);
  },

  /**
   * Seller disputes queue
   * GET /disputes/seller
   */
  listForSeller: async (sellerId?: string): Promise<any[]> => {
    const query = sellerId ? `?sellerId=${sellerId}` : '';
    return api.get<any[]>(`/disputes/seller${query}`);
  },

  /**
   * Admin disputes queue
   * GET /disputes/admin
   */
  listAll: async (): Promise<any[]> => {
    return api.get<any[]>('/disputes/admin');
  },
};

export default disputesService;
