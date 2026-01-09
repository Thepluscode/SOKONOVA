"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import { useSession } from "next-auth/react";
import { useCartApi } from '@/lib/hooks/useCartApi';
import { CartItem } from '@/types';

type CartLine = CartItem;

type CartCtx = {
  cartId: string | null;
  items: CartLine[];
  loading: boolean;
  error: string | null;
  versionConflict: boolean;
  inventoryError: string | null;
  refresh: () => Promise<string | null>;
  add: (productId: string, qty?: number) => Promise<void>;
  remove: (productId: string) => Promise<void>;
  clear: () => Promise<void>;
  retry: () => Promise<void>;
};

const CartContext = createContext<CartCtx | null>(null);

const ANON_KEY_KEY = "sokonova.anonKey";
function getAnonKey() {
  if (typeof window === "undefined") return null;
  let k = window.localStorage.getItem(ANON_KEY_KEY);
  if (!k) {
    k = Math.random().toString(16).slice(2);
    window.localStorage.setItem(ANON_KEY_KEY, k);
  }
  return k;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [cartId, setCartId] = useState<string | null>(null);
  const [items, setItems] = useState<CartLine[]>([]);
  const { loading, error, versionConflict, inventoryError, clearErrors, ensureCart, cartAdd, cartRemove, cartClear } = useCartApi();

  const updateCartState = useCallback((cartData: any) => {
    setCartId(cartData.id);
    setItems(
      (cartData.items || []).map((ci: any) => ({
        productId: ci.productId,
        qty: ci.qty,
        product: ci.product
          ? {
              id: ci.product.id,
              title: ci.product.title,
              price: Number(ci.product.price),
              currency: ci.product.currency,
              imageUrl: ci.product.imageUrl,
            }
          : undefined,
      }))
    );
  }, []);

  const refresh = useCallback(async () => {
    try {
      const anonKey =
        !session?.user?.id ? getAnonKey() ?? undefined : undefined;
      const data = await ensureCart(session?.user?.id, anonKey);

      updateCartState(data);
      
      // Return the cart ID for use in race condition fixes
      return data.id;
    } catch (error) {
      console.error("Error refreshing cart:", error);
      return null;
    }
  }, [session?.user?.id, ensureCart, updateCartState]);

  useEffect(() => {
    refresh();
  }, [session?.user?.id, refresh]);

  const add = useCallback(async (pid: string, qty: number = 1) => {
    try {
      // Ensure we have a cart first
      let activeCartId = cartId;
      if (!activeCartId) {
        activeCartId = await refresh();
      }

      if (!activeCartId) {
        throw new Error("Failed to create cart");
      }

      const updatedCart = await cartAdd(activeCartId, pid, qty);
      updateCartState(updatedCart);
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  }, [cartId, refresh, cartAdd, updateCartState]);

  const remove = useCallback(async (pid: string) => {
    try {
      if (!cartId) return;
      const updatedCart = await cartRemove(cartId, pid);
      updateCartState(updatedCart);
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  }, [cartId, cartRemove, updateCartState]);

  const clear = useCallback(async () => {
    try {
      if (!cartId) return;
      const updatedCart = await cartClear(cartId);
      updateCartState(updatedCart);
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  }, [cartId, cartClear, updateCartState]);

  const retry = useCallback(async () => {
    clearErrors();
    await refresh();
  }, [clearErrors, refresh]);

  const api: CartCtx = useMemo(
    () => ({
      cartId,
      items,
      loading,
      error,
      versionConflict,
      inventoryError,
      refresh,
      add,
      remove,
      clear,
      retry,
    }),
    [cartId, items, loading, error, versionConflict, inventoryError, refresh, add, remove, clear, retry]
  );

  return (
    <CartContext.Provider value={api}>{children}</CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}