
import { NextRequest, NextResponse } from 'next/server'
import { getRedis } from '@/lib/redis'
import { getOrCreateSessionId } from '@/lib/session'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import type { CartItem } from '@/types'

const key = (sidOrUser: string, isUser: boolean) => isUser ? `sn:cart:user:${sidOrUser}` : `sn:cart:${sidOrUser}`

async function currentKey(res?: NextResponse) {
  const session = await getServerSession(authOptions)
  if (session?.user?.id) return { k: key(session.user.id, true), res }
  const r = res ?? NextResponse.next()
  const sid = getOrCreateSessionId(r)
  return { k: key(sid, false), res: r }
}

export async function GET() {
  const res = NextResponse.next()
  const { k } = await currentKey(res)
  const redis = getRedis()
  const data = await redis.get(k)
  const items: CartItem[] = data ? JSON.parse(data) : []
  return NextResponse.json({ items })
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  const { productId, qty } = body as { productId?: string; qty?: number }
  if (!productId) return NextResponse.json({ error: 'productId required' }, { status: 400 })
  const { k } = await currentKey()
  const redis = getRedis()
  const data = await redis.get(k)
  const items: CartItem[] = data ? JSON.parse(data) : []

  const i = items.findIndex(x => x.productId === productId)
  if (i >= 0) items[i].qty += qty ?? 1
  else items.push({ productId, qty: qty ?? 1 })

  await redis.set(k, JSON.stringify(items), 'EX', 60 * 60 * 24 * 30)
  return NextResponse.json({ ok: true, items })
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const productId = searchParams.get('productId')
  const clear = searchParams.get('clear')

  const { k } = await currentKey()
  const redis = getRedis()
  const data = await redis.get(k)
  let items: CartItem[] = data ? JSON.parse(data) : []

  if (clear) items = []
  else if (productId) items = items.filter(x => x.productId !== productId)
  else return NextResponse.json({ error: 'Provide productId or clear=1' }, { status: 400 })

  await redis.set(k, JSON.stringify(items), 'EX', 60 * 60 * 24 * 30)
  return NextResponse.json({ ok: true, items })
}
