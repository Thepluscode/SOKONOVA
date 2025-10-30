
'use client'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from './ui/Button'
import { useCart } from '@/lib/cart'

type Product = {
  id: string;
  name: string;
  description?: string;
  price: number;
  currency?: string;
  image: string;
}

const shimmerBase64 =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZyI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNmM2Y0ZjYiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSI1MCUiIHN0b3AtY29sb3I9IiNlNGU2ZWIiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjZjNmNGY2Ii8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogIDwvZGVmcz4KICA8cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0idXJsKCNnKSIvPgo8L3N2Zz4K";

export function ProductCard({ p }: { p: Product }) {
  const { add } = useCart()
  return (
    <div className="group rounded-2xl bg-card border border-border overflow-hidden hover:shadow-lg active:scale-[.99] focus-within:ring-2 focus-within:ring-primary/40 transition-all duration-300">
      <Link href={`/products/${p.id}`}>
        <div className="aspect-square rounded-t-xl bg-muted relative overflow-hidden">
          <Image
            src={p.image}
            alt={p.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            placeholder="blur"
            blurDataURL={shimmerBase64}
          />
        </div>
        <div className="p-4">
          <div className="font-medium line-clamp-2 group-hover:text-primary transition-colors">{p.name}</div>
          <div className="text-sm text-muted-foreground mt-1">${p.price.toFixed(2)}</div>
        </div>
      </Link>
      <div className="px-4 pb-4 flex gap-2">
        <Button onClick={() => add(p.id, 1)} className="flex-1 active:scale-[.99]">Add to cart</Button>
        <Link href={`/products/${p.id}`} className="text-sm underline self-center hover:text-primary transition-colors">View</Link>
      </div>
    </div>
  )
}

export function ProductCardSkeleton() {
  return (
    <div className="rounded-2xl bg-card border border-border overflow-hidden">
      <div className="aspect-square bg-muted animate-pulse" />
      <div className="p-4 space-y-2">
        <div className="h-4 bg-muted rounded animate-pulse" />
        <div className="h-3 bg-muted rounded w-1/3 animate-pulse" />
      </div>
      <div className="px-4 pb-4">
        <div className="h-9 bg-muted rounded animate-pulse" />
      </div>
    </div>
  )
}
