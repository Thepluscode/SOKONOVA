import type { Product } from '@/types'

export const products: Product[] = [
  {
    id: 'p-1',
    title: 'Wireless Headphones',
    description: 'Comfortable over-ear wireless headphones with rich sound.',
    price: 199.99,
    currency: 'USD',
    imageUrl: '/mock-product.png',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'p-2',
    title: 'Smartwatch Pro',
    description: 'Track health metrics and notifications on the go.',
    price: 149.00,
    currency: 'USD',
    imageUrl: '/mock-product.png',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'p-3',
    title: 'Eco Water Bottle',
    description: 'Reusable stainless steel bottle with 24h insulation.',
    price: 24.50,
    currency: 'USD',
    imageUrl: '/mock-product.png',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'p-4',
    title: 'Bluetooth Speaker',
    description: 'Portable speaker with deep bass and 12h battery life.',
    price: 89.00,
    currency: 'USD',
    imageUrl: '/mock-product.png',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]