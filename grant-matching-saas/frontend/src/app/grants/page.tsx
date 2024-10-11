'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Card from '../../components/ui/card'
import CardContent from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { useAuth } from '../../context/AuthContext'
import { GrantSearch } from '../../components/GrantSearch'

interface Grant {
  id: number
  title: string
  agency: string
  due_date: string
  funding_amount: string
}

interface SearchParams {
  page?: string;
  per_page?: string;
  [key: string]: string | undefined; // Allows for additional query parameters
}

export default function Grants() {
  const [grants, setGrants] = useState<Grant[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalGrants, setTotalGrants] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  const fetchGrants = useCallback(async (params: SearchParams = {}) => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    try {
      setIsLoading(true)
      const queryParams = new URLSearchParams({
        ...params,
        page: params.page || currentPage.toString(),
        per_page: '10'
      })
      const response = await fetch(`http://localhost:5000/api/grants/search?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (!response.ok) {
        throw new Error('Failed to fetch grants')
      }
      const data = await response.json()
      setGrants(data.grants)
      setTotalGrants(data.total)
      setTotalPages(data.pages)
      setCurrentPage(data.current_page)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated, currentPage, router])

  useEffect(() => {
    fetchGrants()
  }, [isAuthenticated, fetchGrants])

  function handleSearch(params: SearchParams) {
    fetchGrants(params)
  }

  const handlePageChange = (newPage: number) => {
    fetchGrants({ page: newPage.toString() })
  }

  if (!isAuthenticated) {
    return <div>Please log in to view grants.</div>
  }

  if (isLoading) return <div>Loading grants...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Available Grants</h1>
      <p className="mb-4">Browse through available grants and find opportunities that match your business.</p>
      <GrantSearch onSearch={handleSearch} />
      <Card className="mt-6">
        <CardContent>
          {grants.length > 0 ? (
            grants.map((grant) => (
              <Link href={`/grants/${grant.id}`} key={grant.id}>
                <div className="border-b border-gray-200 last:border-b-0 py-4 hover:bg-gray-50 transition duration-150 ease-in-out">
                  <h2 className="text-lg font-semibold">{grant.title}</h2>
                  <p className="text-sm text-gray-500">{grant.agency}</p>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="text-sm">Due: {new Date(grant.due_date).toLocaleDateString()}</span>
                    <span className="text-sm font-medium text-blue-600">{grant.funding_amount}</span>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p>No grants available matching your criteria.</p>
          )}
        </CardContent>
      </Card>
      <div className="mt-4 flex justify-between items-center">
        <p>Showing {grants.length} of {totalGrants} grants</p>
        <div>
          <Button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="mr-2"
          >
            Previous
          </Button>
          <Button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}