import { NextRequest, NextResponse } from 'next/server'
import { getRedis } from '@/lib/redis'
import { cookies } from 'next/headers'
import { nanoid } from 'nanoid'
import type { RedisCartItem } from '@/types'

async function currentKey() {
  const cookieStore = cookies()
  let anonKey = cookieStore.get('cart_anon_key')?.value
  if (!anonKey) {
    anonKey = `anon_${nanoid()}`
    // Set cookie for 30 days
    cookies().set('cart_anon_key', anonKey, {
      maxAge: 60 * 60 * 24 * 30,
      httpOnly: true,
      sameSite: 'lax',
    })
  }
  return { k: `cart:${anonKey}` }
}

export async function GET() {
  const { k } = await currentKey()
  const redis = getRedis()
  const data = await redis.get(k)
  const items: RedisCartItem[] = data ? JSON.parse(data) : []
  return NextResponse.json({ items })
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  const { productId, qty } = body as { productId?: string; qty?: number }
  if (!productId) return NextResponse.json({ error: 'productId required' }, { status: 400 })
  const { k } = await currentKey()
  const redis = getRedis()
  const data = await redis.get(k)
  const items: RedisCartItem[] = data ? JSON.parse(data) : []

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
  let items: RedisCartItem[] = data ? JSON.parse(data) : []

  if (clear) items = []
  else if (productId) items = items.filter(x => x.productId !== productId)
  else return NextResponse.json({ error: 'Provide productId or clear=1' }, { status: 400 })

  await redis.set(k, JSON.stringify(items), 'EX', 60 * 60 * 24 * 30)
  return NextResponse.json({ ok: true, items })
}