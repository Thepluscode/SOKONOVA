'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

export default function SignUpPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Basic validation
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    
    setLoading(true)
    setError(null)
    
    try {
      // For demo purposes, we'll map the entered email to the appropriate demo account
      let demoEmail = email;
      let demoPassword = password;
      
      // Map entered credentials to demo accounts
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
      
      await signIn('credentials', { 
        email: demoEmail, 
        password: demoPassword, 
        callbackUrl: '/' 
      })
    } catch (err) {
      setError('Failed to create account. Please try again.')
      console.error('Signup error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-semibold mb-6">Create an account</h1>
      <div className="rounded-2xl border border-border p-6 bg-card space-y-4">
        {error && (
          <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}
        
        <form onSubmit={submit} className="space-y-3">
          <div>
            <input 
              className="w-full rounded-xl border border-border bg-background px-3 py-2" 
              placeholder="Full name" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              required
            />
          </div>
          
          <div>
            <input 
              type="email" 
              className="w-full rounded-xl border border-border bg-background px-3 py-2" 
              placeholder="Email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required
            />
          </div>
          
          <div>
            <input 
              type="password" 
              className="w-full rounded-xl border border-border bg-background px-3 py-2" 
              placeholder="Password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required
            />
          </div>
          
          <div>
            <input 
              type="password" 
              className="w-full rounded-xl border border-border bg-background px-3 py-2" 
              placeholder="Confirm Password" 
              value={confirmPassword} 
              onChange={e => setConfirmPassword(e.target.value)} 
              required
            />
          </div>
          
          <Button disabled={loading} type="submit" className="w-full">
            {loading ? 'Creating account…' : 'Sign up (Demo)'}
          </Button>
        </form>
        
        <div className="text-sm text-muted-foreground">
          Demo users: buyer@sokonova.dev / buyer123, seller@sokonova.dev / seller123, admin@sokonova.dev / admin123
        </div>
        
        <div className="text-center text-sm text-muted-foreground pt-4">
          Already have an account?{' '}
          <Link href="/auth/signin" className="text-primary hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  )
}