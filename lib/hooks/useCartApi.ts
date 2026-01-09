// lib/hooks/useCartApi.ts
import { useState, useCallback } from 'react';
import {
  ensureCart as apiEnsureCart,
  cartAdd as apiCartAdd,
  cartRemove as apiCartRemove,
  cartClear as apiCartClear,
} from '@/lib/api/cart';
import { Cart } from '@/types/cart';
import { VersionConflictError, InventoryError, CartOperationError } from '@/lib/api/errors';

export function useCartApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [versionConflict, setVersionConflict] = useState<boolean>(false);
  const [inventoryError, setInventoryError] = useState<string | null>(null);

  const clearErrors = useCallback(() => {
    setError(null);
    setVersionConflict(false);
    setInventoryError(null);
  }, []);

  const ensureCart = useCallback(async (userId?: string, anonKey?: string) => {
    setLoading(true);
    clearErrors();
    try {
      const data = await apiEnsureCart(userId, anonKey);
      return data;
    } catch (err) {
      if (err instanceof VersionConflictError) {
        setVersionConflict(true);
        setError('Cart was modified by another operation. Please try again.');
      } else if (err instanceof InventoryError) {
        setInventoryError(err.message);
        setError(err.message);
      } else {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load cart';
        setError(errorMessage);
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, [clearErrors]);

  const cartAdd = useCallback(async (cartId: string, productId: string, qty: number) => {
    setLoading(true);
    clearErrors();
    try {
      const updatedCart = await apiCartAdd(cartId, productId, qty);
      return updatedCart;
    } catch (err) {
      if (err instanceof VersionConflictError) {
        setVersionConflict(true);
        setError('Cart was modified by another operation. Please try again.');
      } else if (err instanceof InventoryError) {
        setInventoryError(err.message);
        setError(err.message);
      } else {
        const errorMessage = err instanceof Error ? err.message : 'Failed to add item to cart';
        setError(errorMessage);
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, [clearErrors]);

  const cartRemove = useCallback(async (cartId: string, productId: string) => {
    setLoading(true);
    clearErrors();
    try {
      const updatedCart = await apiCartRemove(cartId, productId);
      return updatedCart;
    } catch (err) {
      if (err instanceof VersionConflictError) {
        setVersionConflict(true);
        setError('Cart was modified by another operation. Please try again.');
      } else {
        const errorMessage = err instanceof Error ? err.message : 'Failed to remove item from cart';
        setError(errorMessage);
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, [clearErrors]);

  const cartClear = useCallback(async (cartId: string) => {
    setLoading(true);
    clearErrors();
    try {
      const updatedCart = await apiCartClear(cartId);
      return updatedCart;
    } catch (err) {
      if (err instanceof VersionConflictError) {
        setVersionConflict(true);
        setError('Cart was modified by another operation. Please try again.');
      } else {
        const errorMessage = err instanceof Error ? err.message : 'Failed to clear cart';
        setError(errorMessage);
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, [clearErrors]);

  return {
    loading,
    error,
    versionConflict,
    inventoryError,
    clearErrors,
    ensureCart,
    cartAdd,
    cartRemove,
    cartClear,
  };
}