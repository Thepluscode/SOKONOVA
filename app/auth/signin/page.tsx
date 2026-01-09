'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'

export default function SignInPage() {
  const [email, setEmail] = useState('buyer@sokonova.dev')
  const [password, setPassword] = useState('buyer123')
  const [loading, setLoading] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Map entered credentials to demo accounts
    let demoEmail = email;
    let demoPassword = password;
    
    if (email === 'admin@sokonova.dev') {
      demoEmail = 'admin@sokonova.dev';
      demoPassword = 'admin123';
    } else if (email === 'seller@sokonova.dev') {
      demoEmail = 'seller@sokonova.dev';
      demoPassword = 'seller123';
    } else {
      // Default to buyer account for any other email
      demoEmail = 'buyer@sokonova.dev';
      demoPassword = 'buyer123';
    }
    
    await signIn('credentials', { email: demoEmail, password: demoPassword, callbackUrl: '/' })
    setLoading(false)
  }

  return (
    <div className="mx-auto max-w-md px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-semibold mb-6">Sign in to SokoNova</h1>
      <div className="rounded-2xl border border-border p-6 bg-card space-y-4">
        <form onSubmit={submit} className="space-y-3">
          <input className="w-full rounded-xl border border-border bg-background px-3 py-2" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
          <input type="password" className="w-full rounded-xl border border-border bg-background px-3 py-2" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
          <Button disabled={loading} type="submit">{loading ? 'Signing in…' : 'Sign in (Demo)'}</Button>
        </form>
        <div className="text-sm text-muted-foreground">Demo users: buyer@sokonova.dev / buyer123, seller@sokonova.dev / seller123, admin@sokonova.dev / admin123</div>
        <Button variant="secondary" onClick={() => signIn('cognito', { callbackUrl: '/' })}>Sign in with Cognito</Button>
      </div>
    </div>
  )
}