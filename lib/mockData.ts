
import type { Product } from '@/types'

export const products: Product[] = [
  {
    id: 'p-1',
    name: 'Wireless Headphones',
    price: 199.99,
    currency: 'USD',
    image: '/mock-product.png',
    description: 'Comfortable over-ear wireless headphones with rich sound.'
  },
  {
    id: 'p-2',
    name: 'Smartwatch Pro',
    price: 149.00,
    currency: 'USD',
    image: '/mock-product.png',
    description: 'Track health metrics and notifications on the go.'
  },
  {
    id: 'p-3',
    name: 'Eco Water Bottle',
    price: 24.50,
    currency: 'USD',
    image: '/mock-product.png',
    description: 'Reusable stainless steel bottle with 24h insulation.'
  },
  {
    id: 'p-4',
    name: 'Bluetooth Speaker',
    price: 89.00,
    currency: 'USD',
    image: '/mock-product.png',
    description: 'Portable speaker with deep bass and 12h battery life.'
  }
]
