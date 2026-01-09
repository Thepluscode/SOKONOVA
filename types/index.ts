export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  qty: number;
  createdAt: string;
  updatedAt: string;
  product?: {
    id: string;
    title: string;
    price: number;
    currency: string;
    imageUrl?: string | null;
  };
}

// Simplified cart item for Redis storage
export interface RedisCartItem {
  productId: string;
  qty: number;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  imageUrl?: string | null;
  category?: string;
  ratingAvg?: number;
  ratingCount?: number;
  createdAt: string;
  updatedAt: string;
}