// API Types matching backend Prisma schema
// Auto-generated from backend/prisma/schema.prisma

// ============================================
// Enums
// ============================================

export type Role = 'BUYER' | 'SELLER' | 'ADMIN';

export type OrderStatus = 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export type PaymentStatus = 'INITIATED' | 'SUCCEEDED' | 'FAILED';

export type PayoutStatus = 'PENDING' | 'PAID_OUT';

export type FulfillmentStatus = 'PACKED' | 'SHIPPED' | 'DELIVERED' | 'ISSUE';

export type ApplicationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export type DisputeReason = 'NOT_DELIVERED' | 'DAMAGED' | 'COUNTERFEIT' | 'WRONG_ITEM' | 'OTHER';

export type DisputeStatus = 
  | 'OPEN' 
  | 'SELLER_RESPONDED' 
  | 'RESOLVED_BUYER_COMPENSATED' 
  | 'RESOLVED_REDELIVERED' 
  | 'REJECTED';

export type KYCStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';

export type SubscriptionStatus = 'ACTIVE' | 'CANCELLED' | 'EXPIRED';

// ============================================
// Core Models
// ============================================

export interface User {
  id: string;
  email: string;
  name?: string;
  role: Role;
  city?: string;
  country?: string;
  phone?: string;
  sellerHandle?: string;
  shopName?: string;
  shopLogoUrl?: string;
  shopBannerUrl?: string;
  shopBio?: string;
  ratingAvg?: number;
  ratingCount?: number;
  bio?: string;
  notifyEmail: boolean;
  notifySms: boolean;
  notifyPush: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  sellerId: string;
  seller?: User;
  title: string;
  description: string;
  price: number;
  currency: string;
  imageUrl?: string;
  category?: string;
  ratingAvg?: number;
  ratingCount?: number;
  viewCount: number;
  inventory?: Inventory;
  createdAt: string;
  updatedAt: string;
}

export interface Inventory {
  id: string;
  productId: string;
  quantity: number;
  updatedAt: string;
}

export interface Cart {
  id: string;
  userId?: string;
  anonKey?: string;
  version: number;
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  product?: Product;
  qty: number;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  userId: string;
  total: number;
  currency: string;
  status: OrderStatus;
  items: OrderItem[];
  paymentRef?: string;
  shippingAdr?: string;
  payment?: Payment;
  buyerName?: string;
  buyerPhone?: string;
  buyerEmail?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  product?: Product;
  qty: number;
  price: number;
  sellerId: string;
  grossAmount: number;
  feeAmount: number;
  netAmount: number;
  payoutStatus: PayoutStatus;
  payoutBatchId?: string;
  paidAt?: string;
  currency: string;
  fulfillmentStatus: FulfillmentStatus;
  shippedAt?: string;
  deliveredAt?: string;
  trackingCode?: string;
  carrier?: string;
  deliveryProofUrl?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  orderId: string;
  provider: string;
  externalRef?: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  body: string;
  message: string;
  data?: Record<string, any>;
  type: string;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  orderItemId: string;
  sellerId: string;
  buyerId: string;
  productId: string;
  rating: number;
  comment: string;
  isVisible: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Dispute {
  id: string;
  orderItemId: string;
  buyerId: string;
  reasonCode: DisputeReason;
  description: string;
  photoProofUrl?: string;
  status: DisputeStatus;
  resolutionNote?: string;
  resolvedById?: string;
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SellerApplication {
  id: string;
  userId: string;
  businessName: string;
  phone: string;
  country: string;
  city: string;
  storefrontDesc: string;
  status: ApplicationStatus;
  adminNote?: string;
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// API Response Types
// ============================================

export interface ApiError {
  statusCode: number;
  message: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

// ============================================
// Auth Types
// ============================================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface JwtPayload {
  sub: string;
  email: string;
  role: Role;
}

// ============================================
// Request DTOs
// ============================================

export interface CreateOrderDto {
  userId?: string;
  shippingAdr?: string;
  buyerName?: string;
  buyerPhone?: string;
  buyerEmail?: string;
}

export interface CreatePaymentIntentDto {
  orderId: string;
  provider: 'flutterwave' | 'paystack' | 'stripe';
}

export interface CartAddDto {
  cartId: string;
  productId: string;
  qty: number;
}
