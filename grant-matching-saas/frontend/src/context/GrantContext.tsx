'use client'

import React, { createContext, useState, useContext, useEffect, useCallback, FC, PropsWithChildren } from 'react'
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

export const GrantProvider: FC<PropsWithChildren> = ({ children }) => {
  const [grants, setGrants] = useState<Grant[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { isAuthenticated } = useAuth()

  const refreshGrants = useCallback(async () => {
    if (!isAuthenticated) return
    try {
      setIsLoading(true)
      const data = await fetchGrants()
      setGrants(data)
      setError(null)
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('An unknown error occurred')
      }
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated])

  useEffect(() => {
    refreshGrants()
  }, [refreshGrants])

  return (
    <GrantContext.Provider value={{ grants, isLoading, error, refreshGrants }}>
      {children}
    </GrantContext.Provider>
  )
}

export const useGrants = (): GrantContextType => {
  const context = useContext(GrantContext)
  if (!context) {
    throw new Error('useGrants must be used within a GrantProvider')
  }
  return context
}
