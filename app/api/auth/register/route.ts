
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcrypt'

export async function POST(req: NextRequest) {
  const { email, password, name, role } = await req.json().catch(() => ({}))
  if (!email || !password) return NextResponse.json({ error: 'email and password required' }, { status: 400 })
  const hash = await bcrypt.hash(password, 10)
  try {
    const user = await prisma.user.create({
      data: { email: email.toLowerCase(), passwordHash: hash, name: name ?? null, role: role ?? 'BUYER' }
    })
    return NextResponse.json({ id: user.id, email: user.email })
  } catch (e) {
    return NextResponse.json({ error: 'email already exists' }, { status: 400 })
  }
}
