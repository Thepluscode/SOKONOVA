
'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useTheme } from '@/lib/theme'
import { Button } from './ui/Button'
import { useCart } from '@/lib/cart'
import { signIn, signOut, useSession } from 'next-auth/react'
import { NotificationBell } from './NotificationBell'

export function Navbar() {
  const { dark, toggle } = useTheme()
  const { data: session } = useSession()
  const { items } = useCart()
  const cartCount = items.reduce((s, i) => s + i.qty, 0)

  const userRole = (session?.user as any)?.role

  return (
    <header className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/sokonova-logo.svg" alt="SokoNova" width={28} height={28} />
          <span className="font-semibold tracking-tight">SokoNova</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link href="/" className="hover:text-primary">Home</Link>
          <Link href="/cart" className="hover:text-primary">Cart ({cartCount})</Link>
          <Link href="/checkout" className="hover:text-primary">Checkout</Link>
          {userRole === 'SELLER' && (
            <Link href="/seller" className="hover:text-primary font-medium">Seller Dashboard</Link>
          )}
          {userRole === 'ADMIN' && (
            <Link href="/admin/applications" className="hover:text-primary font-medium">Admin</Link>
          )}
          {userRole === 'BUYER' && (
            <Link href="/sell/apply" className="hover:text-primary text-green-600 dark:text-green-400 font-medium">
              Become a Seller
            </Link>
          )}
        </nav>
        <div className="flex items-center gap-2">
          {session?.user && (
            <NotificationBell userId={(session.user as any).id} />
          )}
          <Button variant="ghost" onClick={toggle} aria-label="Toggle theme">
            {dark ? 'Light' : 'Dark'}
          </Button>
          {session?.user ? (
            <>
              <span className="hidden sm:inline text-sm">Hi, {session.user.name ?? 'User'}</span>
              <Button variant="ghost" onClick={() => signOut()}>Sign out</Button>
            </>
          ) : (
            <Button onClick={() => signIn()}>Sign In</Button>
          )}
        </div>
      </div>
    </header>
  )
}
