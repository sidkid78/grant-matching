'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../context/AuthContext'
import { withAuth } from '../../components/withAuth'
import Card from '../../components/ui/card'
import CardContent from '../../components/ui/cardContent'

interface UserProfile {
  name: string
  email: string
  organization: string
}

function Profile() {
  const { isAuthenticated } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    async function fetchProfile() {
      try {
        const response = await fetch('/api/profile')
        const data = await response.json()
        setProfile(data)
      } catch {
        setError('Failed to fetch profile')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [isAuthenticated, router])

  if (isLoading) return <div>Loading profile...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Profile</h1>
      {profile ? (
        <Card>
          <CardContent>
            <div className="mb-4">
              <h2 className="text-xl font-semibold">Name: {profile.name}</h2>
              <p className="text-sm text-gray-500">Email: {profile.email}</p>
              <p className="text-sm text-gray-500">Organization: {profile.organization}</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <p>No profile data available.</p>
      )}
    </div>
  )
}

export default withAuth(Profile)