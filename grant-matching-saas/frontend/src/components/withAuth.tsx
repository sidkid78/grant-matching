'use client'

import { useEffect, FC } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../context/AuthContext'

export function withAuth<P extends object>(WrappedComponent: FC<P>) {
  const WithAuth: FC<P> = (props) => {
    const { isAuthenticated, isLoading } = useAuth()
    const router = useRouter()

    useEffect(() => {
      if (!isLoading && !isAuthenticated) {
        router.push('/login')
      }
    }, [isAuthenticated, isLoading, router])

    if (isLoading) {
      return <div>Loading...</div>
    }

    if (!isAuthenticated) {
      return null
    }

    return <WrappedComponent {...props} />
  }

  return WithAuth
}