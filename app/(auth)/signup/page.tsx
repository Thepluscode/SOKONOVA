
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'

export default function SignUpPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [role, setRole] = useState<'BUYER'|'SELLER'>('BUYER')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name, role })
    })
    setLoading(false)
    if (res.ok) router.push('/signin')
    else alert('Registration failed')
  }

  return (
    <div className="mx-auto max-w-md px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-semibold mb-6">Create your account</h1>
      <form onSubmit={submit} className="space-y-3">
        <input className="w-full rounded-xl border border-border bg-background px-3 py-2" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
        <input className="w-full rounded-xl border border-border bg-background px-3 py-2" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="w-full rounded-xl border border-border bg-background px-3 py-2" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <div className="text-sm">Role</div>
        <select className="w-full rounded-xl border border-border bg-background px-3 py-2" value={role} onChange={e=>setRole(e.target.value as any)}>
          <option value="BUYER">Buyer</option>
          <option value="SELLER">Seller</option>
        </select>
        <Button disabled={loading}>{loading ? 'Creating…' : 'Create account'}</Button>
      </form>
    </div>
  )
}
