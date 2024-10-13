'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { useAuth } from '../../context/AuthContext'

interface Grant {
  title: string
  agency: string
  due_date: string
  funding_amount: string
  opportunity_id: string
  match_score: number
}

export default function Dashboard() {
  const [matchedGrants, setMatchedGrants] = useState<Grant[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { isAuthenticated, user, token } = useAuth()

  useEffect(() => {
    if (isAuthenticated && token) {
      fetchMatchedGrants()
    }
  }, [isAuthenticated, token])

  const fetchMatchedGrants = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch('http://localhost:5000/api/grants/matches', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (!response.ok) {
        throw new Error('Failed to fetch matched grants')
      }
      const data = await response.json()
      setMatchedGrants(data)
    } catch (err) {
      console.error('Error fetching grants:', err)
      setError('Failed to fetch matched grants. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isAuthenticated) {
    return <div className="text-center mt-8">Please log in to view your dashboard.</div>
  }

  if (isLoading) return <div className="text-center mt-8">Loading dashboard...</div>
  if (error) return <div className="text-center mt-8 text-red-500">{error}</div>

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <Card>
        <CardContent>
          <h2 className="text-xl font-semibold mb-4">Welcome, {user?.email}</h2>
          <p>Here&apos;s an overview of your matched grants and quick actions.</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <h2 className="text-xl font-semibold mb-4">Your Matched Grants</h2>
          {matchedGrants.length > 0 ? (
            <ul className="space-y-4">
              {matchedGrants.map((grant) => (
                <li key={grant.opportunity_id} className="border-b pb-4 last:border-b-0">
                  <Link href={`/grants/${grant.opportunity_id}`}>
                    <h3 className="text-lg font-semibold">{grant.title}</h3>
                  </Link>
                  <p className="text-sm text-muted-foreground">{grant.agency}</p>
                  <p className="text-sm">Due: {new Date(grant.due_date).toLocaleDateString()}</p>
                  <p className="text-sm">Funding: {grant.funding_amount}</p>
                  <div className="mt-2 flex items-center">
                    <div className="w-full bg-secondary rounded-full h-2.5 mr-2">
                      <div 
                        className="bg-primary h-2.5 rounded-full" 
                        style={{ width: `${grant.match_score}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{grant.match_score}% match</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No matched grants found. Update your profile to improve matches.</p>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <Button asChild className="w-full">
              <Link href="/profile">Update Profile</Link>
            </Button>
            <Button asChild className="w-full">
              <Link href="/grants">Browse All Grants</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}