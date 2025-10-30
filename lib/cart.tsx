"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  ensureCart,
  cartAdd,
  cartRemove,
  cartClear,
} from "@/lib/api";
import { useSession } from "next-auth/react";

type CartLine = {
  productId: string;
  qty: number;
  product?: {
    id: string;
    title: string;
    price: string | number;
    currency: string;
    imageUrl?: string | null;
  };
};

type CartCtx = {
  cartId: string | null;
  items: CartLine[];
  refresh: () => Promise<void>;
  add: (productId: string, qty?: number) => Promise<void>;
  remove: (productId: string) => Promise<void>;
  clear: () => Promise<void>;
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

  const refresh = async () => {
    try {
      const anonKey =
        !session?.user?.id ? getAnonKey() ?? undefined : undefined;
      const data = await ensureCart(session?.user?.id, anonKey);

      setCartId(data.id);
      setItems(
        (data.items || []).map((ci: any) => ({
          productId: ci.productId,
          qty: ci.qty,
          product: ci.product
            ? {
                id: ci.product.id,
                title: ci.product.title,
                price: ci.product.price,
                currency: ci.product.currency,
                imageUrl: ci.product.imageUrl,
              }
            : undefined,
        }))
      );
    } catch (error) {
      console.error("Error refreshing cart:", error);
    }
  };

  useEffect(() => {
    refresh();
  }, [session?.user?.id]);

  const api: CartCtx = useMemo(
    () => ({
      cartId,
      items,
      refresh,
      add: async (pid, qty = 1) => {
        try {
          // Ensure we have a cart first
          let activeCartId = cartId;
          if (!activeCartId) {
            await refresh();
            activeCartId = cartId;
          }

          if (!activeCartId) {
            throw new Error("Failed to create cart");
          }

          await cartAdd(activeCartId, pid, qty);
          await refresh();
        } catch (error) {
          console.error("Error adding to cart:", error);
        }
      },
      remove: async (pid) => {
        try {
          if (!cartId) return;
          await cartRemove(cartId, pid);
          await refresh();
        } catch (error) {
          console.error("Error removing from cart:", error);
        }
      },
      clear: async () => {
        try {
          if (!cartId) return;
          await cartClear(cartId);
          await refresh();
        } catch (error) {
          console.error("Error clearing cart:", error);
        }
      },
    }),
    [cartId, items, session?.user?.id]
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
