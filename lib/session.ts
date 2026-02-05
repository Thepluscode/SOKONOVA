
import { cookies } from 'next/headers'
import { customAlphabet } from 'nanoid'

const nano = customAlphabet('abcdef0123456789', 24)
const COOKIE = 'sn_sid'
export const sessionCookieName = COOKIE

export async function getOrCreateSessionId() {
  const jar = await cookies()
  const existing = jar.get(COOKIE)?.value
  if (existing) return existing
  const sid = nano()
  jar.set(COOKIE, sid, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 30 // 30 days
  })
  return sid
}
