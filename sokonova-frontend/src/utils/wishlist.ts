// Wishlist utility functions for localStorage persistence

export interface WishlistItem {
  id: number;
  name: string;
  price: number;
  seller: string;
  image: string;
  inStock: boolean;
  stockCount?: number;
  addedAt: string;
}

const WISHLIST_STORAGE_KEY = 'sokonova_wishlist';

export const getWishlist = (): WishlistItem[] => {
  try {
    const wishlist = localStorage.getItem(WISHLIST_STORAGE_KEY);
    return wishlist ? JSON.parse(wishlist) : [];
  } catch (error) {
    console.error('Error reading wishlist from localStorage:', error);
    return [];
  }
};

export const saveWishlist = (wishlist: WishlistItem[]): void => {
  try {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
    window.dispatchEvent(new CustomEvent('wishlistUpdated', { detail: wishlist }));
  } catch (error) {
    console.error('Error saving wishlist to localStorage:', error);
  }
};

export const addToWishlist = (product: Omit<WishlistItem, 'addedAt'>): void => {
  const wishlist = getWishlist();
  const exists = wishlist.find(item => item.id === product.id);

  if (!exists) {
    wishlist.push({ ...product, addedAt: new Date().toISOString() });
    saveWishlist(wishlist);
  }
};

export const removeFromWishlist = (productId: number): void => {
  const wishlist = getWishlist();
  const updatedWishlist = wishlist.filter(item => item.id !== productId);
  saveWishlist(updatedWishlist);
};

export const clearWishlist = (): void => {
  saveWishlist([]);
};

export const isInWishlist = (productId: number): boolean => {
  const wishlist = getWishlist();
  return wishlist.some(item => item.id === productId);
};

export const getWishlistCount = (): number => {
  return getWishlist().length;
};
