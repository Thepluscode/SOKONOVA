'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '../../../components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card'
import { Skeleton } from '../../../components/ui/Skeleton'

// Extend the Session interface
declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      role?: 'BUYER' | 'SELLER' | 'ADMIN'
    }
  }
}

interface Application {
  id: string
  businessName: string
  phone: string
  country: string
  city: string
  storefrontDesc: string
  status: string
  user: {
    id: string
    name: string
    email: string
  }
}

export default function AdminApplicationsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const userId = session?.user?.id
  const userRole = session?.user?.role

  useEffect(() => {
    if (status === 'loading') return

    if (!session?.user) {
      router.push('/auth/signin')
      return
    }

    if (userRole !== "ADMIN") {
      router.push('/')
      return
    }

    const fetchApplications = async () => {
      try {
        const res = await fetch(`/api/admin/applications?adminId=${userId}`)
        if (!res.ok) throw new Error('Failed to fetch applications')
        const data = await res.json()
        setApplications(data)
      } catch (err) {
        console.error('Failed to fetch applications:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchApplications()
  }, [session?.user, status, userId, userRole, router])

  const handleApprove = async (appId: string) => {
    try {
      const res = await fetch(`/api/admin/applications/${appId}/approve`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminId: userId })
      })
      if (!res.ok) throw new Error('Failed to approve application')
      // Refresh the list
      setApplications(applications.map(app => 
        app.id === appId ? { ...app, status: 'APPROVED' } : app
      ))
    } catch (err) {
      console.error('Failed to approve application:', err)
    }
  }

  const handleReject = async (appId: string) => {
    try {
      const res = await fetch(`/api/admin/applications/${appId}/reject`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminId: userId })
      })
      if (!res.ok) throw new Error('Failed to reject application')
      // Refresh the list
      setApplications(applications.map(app => 
        app.id === appId ? { ...app, status: 'REJECTED' } : app
      ))
    } catch (err) {
      console.error('Failed to reject application:', err)
    }
  }

  if (status === 'loading') {
    return (
      <div className="container mx-auto py-8">
        <div className="mb-6">
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-4" />
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-20" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Seller Applications</h1>
        <p className="text-muted-foreground">Review and approve pending seller applications</p>
      </div>

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-4" />
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-20" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : applications.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">No pending applications</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {applications.map((app) => (
            <Card key={app.id}>
              <CardHeader>
                <CardTitle>{app.businessName}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Applicant:</span> {app.user.name}</p>
                  <p><span className="font-medium">Email:</span> {app.user.email}</p>
                  <p><span className="font-medium">Phone:</span> {app.phone}</p>
                  <p><span className="font-medium">Location:</span> {app.city}, {app.country}</p>
                  <p><span className="font-medium">Description:</span> {app.storefrontDesc}</p>
                  <p><span className="font-medium">Status:</span> 
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                      app.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                      app.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {app.status}
                    </span>
                  </p>
                </div>
                {app.status === 'PENDING' && (
                  <div className="flex gap-2 mt-4">
                    <Button 
                      size="sm" 
                      onClick={() => handleApprove(app.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Approve
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive" 
                      onClick={() => handleReject(app.id)}
                    >
                      Reject
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}