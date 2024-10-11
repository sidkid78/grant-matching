import React from 'react'
import Link from 'next/link'
import './globals.css'
import { AuthProvider } from '../context/AuthContext'
import { GrantProvider } from '../context/GrantContext'
import { NotificationBell } from '../components/NotificationBell'
import { UserNav } from '../components/UserNav'

export const metadata = {
  title: 'Grant Matching SaaS',
  description: 'Find the perfect funding opportunities for your business',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-100">
        <AuthProvider>
          <GrantProvider>
            <nav className="bg-white shadow-sm">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                  <div className="flex">
                    <Link href="/" className="flex-shrink-0 flex items-center">
                      Grant Matcher
                    </Link>
                    <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                      <Link href="/dashboard" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                        Dashboard
                      </Link>
                      <Link href="/grants" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                        Grants
                      </Link>
                      <Link href="/profile" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                        Profile
                      </Link>
                    </div>
                  </div>
                  <div className="hidden sm:ml-6 sm:flex sm:items-center">
                    <NotificationBell />
                    <UserNav />
                  </div>
                </div>
              </div>
            </nav>

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
              {children}
            </main>

            <footer className="bg-white border-t border-gray-200">
              <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <p className="text-center text-sm text-gray-500">
                  © 2024 Grant Matcher. All rights reserved.
                </p>
              </div>
            </footer>
          </GrantProvider>
        </AuthProvider>
      </body>
    </html>
  )
}