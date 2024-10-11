'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '../../components/Card'
import { Button } from '../../components/Button'
import { Input } from '../../components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { useGrants } from '../../context/GrantContext'
import { useAuth } from '../../context/AuthContext'

export default function Grants() {
  const { grants, isLoading, error } = useGrants()
  const { isAuthenticated } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterAgency, setFilterAgency] = useState('')

  const filteredGrants = grants.filter(grant => 
    grant.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterAgency === '' || grant.agency === filterAgency)
  )

  const agencies = [...new Set(grants.map(grant => grant.agency))]

  if (!isAuthenticated) {
    return <div>Please log in to view grants.</div>
  }

  if (isLoading) return <div>Loading grants...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Available Grants</h1>
      <p className="mb-4">Browse through available grants and find opportunities that match your business.</p>
      <div className="mb-6 flex justify-between items-center">
        <Input 
          type="text" 
          placeholder="Search grants..." 
          className="w-64"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Select value={filterAgency} onValueChange={setFilterAgency}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by agency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Agencies</SelectItem>
            {agencies.map(agency => (
              <SelectItem key={agency} value={agency}>{agency}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Card>
        <CardContent>
          {filteredGrants.length > 0 ? (
            filteredGrants.map((grant) => (
              <Link href={`/grants/${grant.id}`} key={grant.id}>
                <div className="border-b border-gray-200 last:border-b-0 py-4 hover:bg-gray-50 transition duration-150 ease-in-out">
                  <h2 className="text-lg font-semibold">{grant.title}</h2>
                  <p className="text-sm text-gray-500">{grant.agency}</p>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="text-sm">Due: {grant.dueDate}</span>
                    <span className="text-sm font-medium text-blue-600">{grant.matchScore}% match</span>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p>No grants available matching your criteria.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}