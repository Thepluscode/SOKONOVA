
'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const res = await signIn('credentials', { email, password, redirect: true, callbackUrl: '/' })
    setLoading(false)
  }
  return (
    <div className="mx-auto max-w-md px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-semibold mb-6">Sign in</h1>
      <form onSubmit={submit} className="space-y-3">
        <input className="w-full rounded-xl border border-border bg-background px-3 py-2" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="w-full rounded-xl border border-border bg-background px-3 py-2" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <Button disabled={loading}>{loading ? 'Signing in…' : 'Sign in'}</Button>
      </form>
      <div className="mt-4 text-sm">
        New here? <Link href="/signup" className="underline">Create an account</Link>
      </div>
    </div>
  )
}
