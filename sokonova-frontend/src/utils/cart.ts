// Cart utility functions for localStorage persistence

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  seller: string;
  image: string;
  inStock: boolean;
  stockCount?: number;
}

const CART_STORAGE_KEY = 'sokonova_cart';

export const getCart = (): CartItem[] => {
  try {
    const cart = localStorage.getItem(CART_STORAGE_KEY);
    return cart ? JSON.parse(cart) : [];
  } catch (error) {
    console.error('Error reading cart from localStorage:', error);
    return [];
  }
};

export const saveCart = (cart: CartItem[]): void => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    // Dispatch custom event for cart updates
    window.dispatchEvent(new CustomEvent('cartUpdated', { detail: cart }));
  } catch (error) {
    console.error('Error saving cart to localStorage:', error);
  }
};

export const addToCart = (product: Omit<CartItem, 'quantity'>, quantity: number = 1): void => {
  const cart = getCart();
  const existingItem = cart.find(item => item.id === product.id);

  if (existingItem) {
    existingItem.quantity += quantity;
    // Check stock limit
    if (product.stockCount && existingItem.quantity > product.stockCount) {
      existingItem.quantity = product.stockCount;
    }
  } else {
    cart.push({ ...product, quantity });
  }

  saveCart(cart);
};

export const updateCartItemQuantity = (productId: number, quantity: number): void => {
  const cart = getCart();
  const item = cart.find(item => item.id === productId);

  if (item) {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      item.quantity = quantity;
      saveCart(cart);
    }
  }
};

export const removeFromCart = (productId: number): void => {
  const cart = getCart();
  const updatedCart = cart.filter(item => item.id !== productId);
  saveCart(updatedCart);
};

export const clearCart = (): void => {
  saveCart([]);
};

export const getCartTotal = (): number => {
  const cart = getCart();
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
};

export const getCartItemCount = (): number => {
  const cart = getCart();
  return cart.reduce((count, item) => count + item.quantity, 0);
};

export const isInCart = (productId: number): boolean => {
  const cart = getCart();
  return cart.some(item => item.id === productId);
};
