'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { useAuth } from '../../context/AuthContext'

interface Grant {
  title: string
  agency: string
  due_date: string
  funding_amount: string
  opportunity_id: string
  description: string
}

export default function Grants() {
  const [grants, setGrants] = useState<Grant[]>([])
  const [filteredGrants, setFilteredGrants] = useState<Grant[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const { isAuthenticated, token } = useAuth()

  useEffect(() => {
    if (isAuthenticated && token) {
      fetchGrants()
    }
  }, [isAuthenticated, token])

  useEffect(() => {
    if (grants.length > 0) {
      setFilteredGrants(
        grants.filter(grant =>
          grant.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          grant.agency.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    }
  }, [searchTerm, grants])

  const fetchGrants = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch('http://localhost:5000/api/grants', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (!response.ok) {
        throw new Error('Failed to fetch grants')
      }
      const data = await response.json()
      setGrants(data)
      setFilteredGrants(data)
    } catch (err) {
      console.error('Error fetching grants:', err)
      setError('Failed to fetch grants. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isAuthenticated) {
    return <div className="text-center mt-8">Please log in to view grants.</div>
  }

  if (isLoading) return <div className="text-center mt-8">Loading grants...</div>
  if (error) return <div className="text-center mt-8 text-red-500">{error}</div>

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Available Grants</h1>
      <div className="flex justify-between items-center">
        <Input
          type="text"
          placeholder="Search grants..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <Card>
        <CardContent>
          {filteredGrants.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {filteredGrants.map((grant) => (
                <li key={grant.opportunity_id} className="py-4">
                  <Link href={`/grants/${grant.opportunity_id}`} className="block hover:bg-gray-50">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">{grant.title}</h3>
                        <p className="text-sm text-gray-500">{grant.agency}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm">Due: {new Date(grant.due_date).toLocaleDateString()}</p>
                        <p className="text-sm font-medium">{grant.funding_amount}</p>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p>No grants available matching your criteria.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}