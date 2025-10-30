
import { NextResponse } from 'next/server'
import { products } from '@/lib/mockData'

export async function GET() {
  return NextResponse.json({ products })
}
