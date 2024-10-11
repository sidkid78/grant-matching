'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card } from '../../components/ui/card'
import { CardContent } from '../../components/ui/card'
import { CardHeader } from '../../components/ui/card'
import { cardTitle } from '../../components/ui/card'
import { button } from '../../components/ui/button'
import { useAuth } from '../../context/AuthContext'

interface Grant {
  id: number
  title: string
  agency: string
  due_date: string
  funding_amount: string
  match_score: number
}

export default function Dashboard() {
  const [matchedGrants, setMatchedGrants] = useState<Grant[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    if (isAuthenticated) {
      fetchMatchedGrants()
    }
  }, [isAuthenticated])

  const fetchMatchedGrants = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/grants/matches', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (!response.ok) {
        throw new Error('Failed to fetch matched grants')
      }
      const data = await response.json()
      setMatchedGrants(data)
    } catch {
      setError('Failed to fetch matched grants')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isAuthenticated) {
    return <div>Please log in to view your dashboard.</div>
  }

  if (isLoading) return <div>Loading dashboard...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      <h1  className="text-3xl font-bold mb-4">Dashboard</h1>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Your Matched Grants</CardTitle>
        </CardHeader>
        <CardContent>
          {matchedGrants.length > 0 ? (
            <ul className="space-y-4">
              {matchedGrants.map((grant) => (
                <li key={grant.id} className="border-b pb-4 last:border-b-0">
                  <Link href={`/grants/${grant.id}`}>
                    <h3 className="text-lg font-semibold">{grant.title}</h3>
                  </Link>
                  <p className="text-sm text-gray-600">{grant.agency}</p>
                  <p className="text-sm">Due: {new Date(grant.due_date).toLocaleDateString()}</p>
                  <p className="text-sm">Funding: {grant.funding_amount}</p>
                  <div className="mt-2 flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full" 
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
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
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