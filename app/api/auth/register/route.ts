import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const { email, name, role } = await req.json().catch(() => ({}))
  if (!email) return NextResponse.json({ error: 'email required' }, { status: 400 })
  
  // Validate and normalize role
  const normalizedRole = role && ['BUYER', 'SELLER'].includes(role.toUpperCase()) 
    ? role.toUpperCase() 
    : 'BUYER'
  
  try {
    const user = await prisma.user.create({
      data: { 
        email: email.toLowerCase(), 
        name: name ?? null, 
        role: normalizedRole 
      }
    })
    return NextResponse.json({ id: user.id, email: user.email })
  } catch (e) {
    return NextResponse.json({ error: 'email already exists' }, { status: 400 })
  }
}