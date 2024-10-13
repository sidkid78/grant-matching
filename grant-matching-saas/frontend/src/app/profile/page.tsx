'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Card, CardContent } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { useAuth } from '../../context/AuthContext'

interface Profile {
  email: string
  company_name?: string
  uei_code?: string
  naics_code?: string
  employee_count?: number
}

export default function Profile() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { isAuthenticated, token, user } = useAuth()

  const fetchProfile = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch('http://localhost:5000/api/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (!response.ok) {
        throw new Error('Failed to fetch profile')
      }
      const data = await response.json()
      setProfile(data)
    } catch (err) {
      console.error('Error fetching profile:', err)
      setError('Failed to fetch profile. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }, [token])

  useEffect(() => {
    if (isAuthenticated && token) {
      fetchProfile()
    }
  }, [isAuthenticated, token, fetchProfile])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Implement profile update logic here
    console.log('Profile update submitted')
  }

  if (!isAuthenticated) {
    return <div className="text-center mt-8">Please log in to view your profile.</div>
  }

  if (isLoading) return <div className="text-center mt-8">Loading profile...</div>
  if (error) return <div className="text-center mt-8 text-red-500">{error}</div>

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Your Profile</h1>
      <Card>
        <CardContent>
          <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <Input
                type="email"
                id="email"
                value={user?.email || ''}
                disabled
                className="mt-1"
              />
            </div>
            <div>
              <label htmlFor="company_name" className="block text-sm font-medium text-gray-700">
                Company Name
              </label>
              <Input
                type="text"
                id="company_name"
                value={profile?.company_name || ''}
                onChange={(e) => setProfile(prev => ({ ...prev!, company_name: e.target.value }))}
                className="mt-1"
              />
            </div>
            <div>
              <label htmlFor="uei_code" className="block text-sm font-medium text-gray-700">
                UEI Code
              </label>
              <Input
                type="text"
                id="uei_code"
                value={profile?.uei_code || ''}
                onChange={(e) => setProfile(prev => ({ ...prev!, uei_code: e.target.value }))}
                className="mt-1"
              />
            </div>
            <div>
              <label htmlFor="naics_code" className="block text-sm font-medium text-gray-700">
                NAICS Code
              </label>
              <Input
                type="text"
                id="naics_code"
                value={profile?.naics_code || ''}
                onChange={(e) => setProfile(prev => ({ ...prev!, naics_code: e.target.value }))}
                className="mt-1"
              />
            </div>
            <div>
              <label htmlFor="employee_count" className="block text-sm font-medium text-gray-700">
                Number of Employees
              </label>
              <Input
                type="number"
                id="employee_count"
                value={profile?.employee_count || ''}
                onChange={(e) => setProfile(prev => ({ ...prev!, employee_count: parseInt(e.target.value) }))}
                className="mt-1"
              />
            </div>
            <Button type="submit">Update Profile</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
