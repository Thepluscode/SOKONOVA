// Compare utility functions for localStorage persistence

export interface CompareItem {
  id: number;
  name: string;
  price: number;
  seller: string;
  image: string;
  inStock: boolean;
  stockCount?: number;
  rating: number;
  reviews: number;
  category: string;
  description: string;
}

const COMPARE_STORAGE_KEY = 'sokonova_compare';
const MAX_COMPARE_ITEMS = 4;

export const getCompareList = (): CompareItem[] => {
  try {
    const compare = localStorage.getItem(COMPARE_STORAGE_KEY);
    return compare ? JSON.parse(compare) : [];
  } catch (error) {
    console.error('Error reading compare list from localStorage:', error);
    return [];
  }
};

export const saveCompareList = (compare: CompareItem[]): void => {
  try {
    localStorage.setItem(COMPARE_STORAGE_KEY, JSON.stringify(compare));
    window.dispatchEvent(new CustomEvent('compareUpdated', { detail: compare }));
  } catch (error) {
    console.error('Error saving compare list to localStorage:', error);
  }
};

export const addToCompare = (product: CompareItem): boolean => {
  const compare = getCompareList();
  
  if (compare.length >= MAX_COMPARE_ITEMS) {
    return false;
  }

  const exists = compare.find(item => item.id === product.id);
  if (!exists) {
    compare.push(product);
    saveCompareList(compare);
    return true;
  }
  
  return false;
};

export const removeFromCompare = (productId: number): void => {
  const compare = getCompareList();
  const updatedCompare = compare.filter(item => item.id !== productId);
  saveCompareList(updatedCompare);
};

export const clearCompare = (): void => {
  saveCompareList([]);
};

export const isInCompare = (productId: number): boolean => {
  const compare = getCompareList();
  return compare.some(item => item.id === productId);
};

export const getCompareCount = (): number => {
  return getCompareList().length;
};

export const canAddToCompare = (): boolean => {
  return getCompareList().length < MAX_COMPARE_ITEMS;
};
