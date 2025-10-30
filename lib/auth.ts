
import type { NextAuthOptions } from 'next-auth'
import CognitoProvider from 'next-auth/providers/cognito'
import Credentials from 'next-auth/providers/credentials'

// Demo in-memory users for Credentials fallback (dev only)
const demoUsers = [
  { id: 'u-1', name: 'Buyer Bee', email: 'buyer@sokonova.dev', role: 'buyer', password: 'buyer123' },
  { id: 'u-2', name: 'Seller Sage', email: 'seller@sokonova.dev', role: 'seller', password: 'seller123' },
  { id: 'u-3', name: 'Admin Ace',  email: 'admin@sokonova.dev', role: 'admin',  password: 'admin123' },
]

export const authOptions: NextAuthOptions = {
  providers: [
    ...(process.env.COGNITO_CLIENT_ID && process.env.COGNITO_CLIENT_SECRET && process.env.COGNITO_ISSUER ? [
      CognitoProvider({
        clientId: process.env.COGNITO_CLIENT_ID!,
        clientSecret: process.env.COGNITO_CLIENT_SECRET!,
        issuer: process.env.COGNITO_ISSUER!,
      })
    ] : []),
    // Fallback local credentials for dev
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        const user = demoUsers.find(u => u.email === credentials.email && u.password === credentials.password)
        if (!user) return null
        return { id: user.id, name: user.name, email: user.email, role: user.role }
      },
    }),
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, user }) {
      if (user && (user as any).role) token.role = (user as any).role
      return token
    },
    async session({ session, token }) {
      if (token?.sub) session.user.id = token.sub
      if (token?.role) (session.user as any).role = token.role
      return session
    },
  },
  pages: {
    signIn: '/auth/signin'
  },
  secret: process.env.NEXTAUTH_SECRET,
}
