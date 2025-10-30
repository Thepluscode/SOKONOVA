
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { customAlphabet } from 'nanoid'

const nano = customAlphabet('abcdef0123456789', 24)
const COOKIE = 'sn_sid'
export const sessionCookieName = COOKIE

export function getOrCreateSessionId(res?: NextResponse) {
  const jar = cookies()
  const existing = jar.get(COOKIE)?.value
  if (existing) return existing
  const sid = nano()
  if (res) {
    res.cookies.set(COOKIE, sid, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 30 // 30 days
    })
  }
  return sid
}
