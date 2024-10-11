'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Card from '../../components/ui/card'
import CardContent from '../../components/ui/cardContent'
import { useAuth } from '../../context/AuthContext'
import { withAuth } from '../../components/withAuth'

interface Grant {
  id: number
  title: string
  agency: string
  due_date: string
  funding_amount: string
  match_score: number
}

function Dashboard() {
  const { isAuthenticated } = useAuth()
  const [grants, setGrants] = useState<Grant[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    async function fetchGrants() {
      try {
        const response = await fetch('/api/grants')
        const data = await response.json()
        setGrants(data)
      } catch {
        setError('Failed to fetch grants')
      } finally {
        setIsLoading(false)
      }
    }

    fetchGrants()
  }, [isAuthenticated, router])

  if (isLoading) return <div>Loading grants...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <Card>
        <CardContent>
          {grants.length > 0 ? (
            grants.map((grant) => (
              <Link href={`/grants/${grant.id}`} key={grant.id}>
                <div className="border-b border-gray-200 last:border-b-0 py-4 hover:bg-gray-50 transition duration-150 ease-in-out">
                  <h2 className="text-lg font-semibold">{grant.title}</h2>
                  <p className="text-sm text-gray-500">{grant.agency}</p>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="text-sm">Due: {grant.due_date}</span>
                    <span className="text-sm font-medium text-blue-600">{grant.match_score}% match</span>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p>No grants available.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default withAuth(Dashboard)