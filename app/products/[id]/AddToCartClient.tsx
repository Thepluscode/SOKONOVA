'use client'

import { useCart } from '@/lib/cart'
import { Button } from '@/components/ui/Button'

export function AddToCartClient({ id }: { id: string }) {
  const { add } = useCart()

  return (
    <Button
      className="mt-6"
      onClick={() => add(id, 1)}
    >
      Add to cart
    </Button>
  )
}
