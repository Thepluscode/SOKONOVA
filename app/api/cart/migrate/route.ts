import { NextResponse } from 'next/server'
import { getRedis } from '@/lib/redis'
import { getOrCreateSessionId } from '@/lib/session'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import type { CartItem } from '@/types'

const guestKey = (sid: string) => `sn:cart:${sid}`
const userKey = (uid: string) => `sn:cart:user:${uid}`

export async function POST() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Not signed in' }, { status: 401 })
  const res = NextResponse.next()
  const sid = getOrCreateSessionId(res)
  const redis = getRedis()
  const [guest, user] = await Promise.all([
    redis.get(guestKey(sid)),
    redis.get(userKey(session.user.id))
  ])
  const gi: CartItem[] = guest ? JSON.parse(guest) : []
  const ui: CartItem[] = user ? JSON.parse(user) : []
  // merge
  const map = new Map<string, number>()
  for (const it of [...ui, ...gi]) map.set(it.productId, (map.get(it.productId) ?? 0) + it.qty)
  // Fix: Convert MapIterator to array properly for all TypeScript targets
  const merged = Array.from(map.entries()).map(([productId, qty]) => ({ productId, qty }))
  await Promise.all([
    redis.set(userKey(session.user.id), JSON.stringify(merged), 'EX', 60*60*24*30),
    redis.del(guestKey(sid))
  ])
  return NextResponse.json({ ok: true, items: merged })
}