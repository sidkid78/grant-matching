'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { fetchGrant } from '../../../services/api'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/Card'
import { Button } from '../../../components/Button'

export default function GrantDetail() {
  const { id } = useParams()
  const [grant, setGrant] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadGrant() {
      try {
        setIsLoading(true)
        const data = await fetchGrant(id)
        setGrant(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }
    loadGrant()
  }, [id])

  if (isLoading) return <div>Loading grant details...</div>
  if (error) return <div>Error: {error}</div>
  if (!grant) return <div>Grant not found</div>

  return (
    <Card>
      <CardHeader>
        <CardTitle>{grant.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500 mb-4">{grant.agency}</p>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Due Date</h3>
            <p>{grant.dueDate}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Funding Amount</h3>
            <p>{grant.fundingAmount}</p>
          </div>
        </div>
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Match Score</h3>
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${grant.matchScore}%` }}></div>
          </div>
          <p className="text-sm text-gray-500 mt-1">{grant.matchScore}% match</p>
        </div>
        <Button>Apply for Grant</Button>
      </CardContent>
    </Card>
  )
}