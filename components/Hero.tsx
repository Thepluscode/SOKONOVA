import { Button } from './ui/Button'
import Image from 'next/image'

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-24 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground border border-border">
            Africa’s new market constellation
          </span>
          <h1 className="mt-4 text-4xl sm:text-5xl font-bold tracking-tight">
            Shop local. <span className="text-primary">Shine global.</span>
          </h1>
          <p className="mt-4 text-base text-muted-foreground max-w-prose">
            Discover thousands of products from trusted sellers across Africa. Secure payments, transparent shipping, and a delightful experience.
          </p>
          <div className="mt-6 flex gap-3">
            <Button>Start Shopping</Button>
            <Button variant="secondary">Become a Seller</Button>
          </div>
        </div>
        <div className="relative rounded-2xl bg-card shadow-card dark:shadow-card-dark p-6">
          <Image src="/mock-product.png" alt="Products" width={800} height={500} className="rounded-xl w-full h-auto" />
        </div>
      </div>
    </section>
  )
}
