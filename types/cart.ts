import { CartItem } from "./index";

export interface Cart {
  id: string;
  userId?: string | null;
  anonKey?: string | null;
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
}