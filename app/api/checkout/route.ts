
import { NextResponse } from 'next/server'

export async function POST() {
  // In real life, create payment intent with your PSP here and return client secret
  return NextResponse.json({ clientSecret: 'mock_secret_ok', status: 'ok' })
}
