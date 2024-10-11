'use client'

import React, { createContext, useState, useContext, useEffect } from 'react'
import { fetchGrants } from '../services/api'
import { useAuth } from './AuthContext'

interface Grant {
  id: string
  title: string
  agency: string
  dueDate: string
  fundingAmount: string
  matchScore: number
}

interface GrantContextType {
  grants: Grant[]
  isLoading: boolean
  error: string | null
  refreshGrants: () => Promise<void>
}

const GrantContext = createContext<GrantContextType | undefined>(undefined)

export const GrantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [grants, setGrants] = useState<Grant[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { isAuthenticated } = useAuth()

  const refreshGrants = async () => {
    if (!isAuthenticated) return
    try {
      setIsLoading(true)
      const data = await fetchGrants()
      setGrants(data)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    refreshGrants()
  }, [isAuthenticated])

  return (
    <GrantContext.Provider value={{ grants, isLoading, error, refreshGrants }}>
      {children}
    </GrantContext.Provider>
  )
}

export const useGrants = () => {
  const context = useContext(GrantContext)
  if (context === undefined) {
    throw new Error('useGrants must be used within a GrantProvider')
  }
  return context
}