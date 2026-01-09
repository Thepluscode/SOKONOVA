// lib/api/cart.ts
import { apiBase, apiFetch } from "./base";
import { Cart } from "@/types/cart";
import { VersionConflictError, InventoryError, CartOperationError } from "./errors";

export async function ensureCart(userId?: string, anonKey?: string): Promise<Cart> {
  const params = new URLSearchParams();
  if (userId) params.set("userId", userId);
  if (!userId && anonKey) params.set("anonKey", anonKey);

  try {
    return await apiFetch(`${apiBase}/cart?${params.toString()}`);
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new CartOperationError(`Failed to load cart: ${error.message}`);
    }
    throw new CartOperationError('Failed to load cart: Unknown error');
  }
}

export async function cartAdd(cartId: string, productId: string, qty: number): Promise<Cart> {
  try {
    const response = await apiFetch(`${apiBase}/cart/add`, {
      method: "POST",
      body: JSON.stringify({ cartId, productId, qty }),
    });
    return response;
  } catch (error: unknown) {
    // Handle specific error types
    if (error instanceof Error) {
      if (error.message?.includes('version conflict')) {
        throw new VersionConflictError('Cart was modified by another operation. Please try again.');
      }
      if (error.message?.includes('units available')) {
        throw new InventoryError(error.message);
      }
      throw new CartOperationError(`Failed to add item to cart: ${error.message}`);
    }
    throw new CartOperationError('Failed to add item to cart: Unknown error');
  }
}

export async function cartRemove(cartId: string, productId: string): Promise<Cart> {
  try {
    const u = new URLSearchParams({ cartId, productId });
    const response = await apiFetch(`${apiBase}/cart/remove?${u.toString()}`, {
      method: "DELETE",
    });
    return response;
  } catch (error: unknown) {
    // Handle specific error types
    if (error instanceof Error) {
      if (error.message?.includes('version conflict')) {
        throw new VersionConflictError('Cart was modified by another operation. Please try again.');
      }
      throw new CartOperationError(`Failed to remove item from cart: ${error.message}`);
    }
    throw new CartOperationError('Failed to remove item from cart: Unknown error');
  }
}

export async function cartClear(cartId: string): Promise<Cart> {
  try {
    const u = new URLSearchParams({ cartId });
    const response = await apiFetch(`${apiBase}/cart/clear?${u.toString()}`, {
      method: "DELETE",
    });
    return response;
  } catch (error: unknown) {
    // Handle specific error types
    if (error instanceof Error) {
      if (error.message?.includes('version conflict')) {
        throw new VersionConflictError('Cart was modified by another operation. Please try again.');
      }
      throw new CartOperationError(`Failed to clear cart: ${error.message}`);
    }
    throw new CartOperationError('Failed to clear cart: Unknown error');
  }
}