export interface Category {
  name: string;
  icon: string;
  count: number;
  href: string;
}

export const CATEGORIES: Category[] = [
  { name: "Electronics", icon: "📱", count: 1240, href: "/products?category=electronics" },
  { name: "Fashion", icon: "👗", count: 2890, href: "/products?category=fashion" },
  { name: "Home & Living", icon: "🏠", count: 1567, href: "/products?category=home" },
  { name: "Beauty", icon: "💄", count: 892, href: "/products?category=beauty" },
  { name: "Sports", icon: "⚽", count: 743, href: "/products?category=sports" },
  { name: "Food & Drinks", icon: "🍕", count: 456, href: "/products?category=food" },
];