import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { cartService } from '../lib/services';
import { useAuth } from '../lib/auth';

interface CartContextValue {
    cartCount: number;
    refreshCart: () => Promise<void>;
    incrementCount: () => void;
    decrementCount: () => void;
    setCount: (count: number) => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [cartCount, setCartCount] = useState(0);
    const { user } = useAuth();

    const refreshCart = useCallback(async () => {
        try {
            const cart = await cartService.get(user?.id);
            const count = cart?.items?.reduce((sum: number, item: { qty: number }) => sum + item.qty, 0) || 0;
            setCartCount(count);
        } catch (err) {
            console.error('Failed to fetch cart count:', err);
        }
    }, [user?.id]);

    // Fetch cart count on mount and when user changes
    useEffect(() => {
        refreshCart();
    }, [refreshCart]);

    const incrementCount = useCallback(() => {
        setCartCount(prev => prev + 1);
    }, []);

    const decrementCount = useCallback(() => {
        setCartCount(prev => Math.max(0, prev - 1));
    }, []);

    const setCount = useCallback((count: number) => {
        setCartCount(count);
    }, []);

    return (
        <CartContext.Provider value={{ cartCount, refreshCart, incrementCount, decrementCount, setCount }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within CartProvider');
    }
    return context;
}
