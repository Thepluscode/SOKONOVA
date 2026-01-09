'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useTheme } from '@/lib/theme'
import { Button } from './ui/Button'
import { useCart } from '@/lib/cart'
import { signIn, signOut, useSession } from 'next-auth/react'
import { NotificationBell } from './NotificationBell'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Navbar() {
  const { dark, toggle } = useTheme()
  const { data: session } = useSession()
  const { items } = useCart()
  const cartCount = items.reduce((s, i) => s + i.qty, 0)

  const userRole = session?.user?.role

  return (
    <header className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/sokonova-logo.svg" alt="SokoNova" width={28} height={28} />
          <span className="font-semibold tracking-tight">SokoNova</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link href="/" className="hover:text-primary">Home</Link>
          <Link href="/services" className="hover:text-primary">Services</Link>
          <Link href="/subscriptions" className="hover:text-primary">Premium</Link>
          <Link href="/partner/register" className="hover:text-primary">Partner API</Link>
          <Link href="/cart" className="hover:text-primary">Cart ({cartCount})</Link>
          <Link href="/checkout" className="hover:text-primary">Checkout</Link>
          {userRole === 'SELLER' && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="font-medium">
                  Seller Dashboard
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/seller">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/seller/trust">Trust & Safety</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/seller/sponsored-placements">Sponsored Placements</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/seller/services">Services Marketplace</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          {userRole === 'ADMIN' && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="font-medium">
                  Admin
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/admin/applications">Applications</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/admin/ops">Operations</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/admin/trust">Trust & Safety</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/admin/sponsored-placements">Sponsored Placements</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/admin/subscriptions">Subscriptions</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/admin/control-tower">Control Tower</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/admin/impact-inclusion">Impact & Inclusion</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/admin/api-partners">API Partners</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          {userRole === 'BUYER' && (
            <Link href="/sell/apply" className="hover:text-primary text-green-600 dark:text-green-400 font-medium">
              Become a Seller
            </Link>
          )}
        </nav>
        <div className="flex items-center gap-2">
          {session?.user && (
            <NotificationBell userId={session.user.id} />
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
            <div className="flex gap-2">
              <Link href="/auth/signup">
                <Button variant="ghost">Sign Up</Button>
              </Link>
              <Button onClick={() => signIn()}>Sign In</Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}