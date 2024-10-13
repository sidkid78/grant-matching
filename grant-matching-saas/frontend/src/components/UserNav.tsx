'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from './ui/button'
import { useAuth } from '../context/AuthContext'

export function UserNav() {
  const { isAuthenticated, logout, user } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center space-x-4">
        <Button asChild variant="ghost">
          <Link href="/login">Login</Link>
        </Button>
        <Button asChild>
          <Link href="/register">Register</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-4">
      <span className="text-sm text-muted-foreground">{user?.email}</span>
      <Button onClick={handleLogout} variant="ghost">
        Logout
      </Button>
    </div>
  )
}