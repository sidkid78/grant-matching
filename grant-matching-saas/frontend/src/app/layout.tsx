import React from 'react'
import Link from 'next/link'
import '../styles/globals.css'
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
      <body className="min-h-screen bg-background font-sans antialiased">
        <AuthProvider>
          <GrantProvider>
            <div className="relative flex min-h-screen flex-col">
              <header className="sticky top-0 z-40 border-b bg-background">
                <div className="container flex h-16 items-center justify-between py-4">
                  <div className="flex gap-6 md:gap-10">
                    <Link href="/" className="flex items-center space-x-2">
                      <span className="inline-block font-bold">Grant Matcher</span>
                    </Link>
                    <nav className="flex gap-6">
                      <Link
                        href="/dashboard"
                        className="flex items-center text-sm font-medium text-muted-foreground"
                      >
                        Dashboard
                      </Link>
                      <Link
                        href="/grants"
                        className="flex items-center text-sm font-medium text-muted-foreground"
                      >
                        Grants
                      </Link>
                      <Link
                        href="/profile"
                        className="flex items-center text-sm font-medium text-muted-foreground"
                      >
                        Profile
                      </Link>
                    </nav>
                  </div>
                  <div className="flex items-center gap-4">
                    <NotificationBell />
                    <UserNav />
                  </div>
                </div>
              </header>
              <main className="flex-1">
                <div className="container py-6">
                  {children}
                </div>
              </main>
              <footer className="border-t bg-background">
                <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
                  <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
                    <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                      Built by{" "}
                      <a
                        href="#"
                        target="_blank"
                        rel="noreferrer"
                        className="font-medium underline underline-offset-4"
                      >
                        Your Company
                      </a>
                      . The source code is available on{" "}
                      <a
                        href="#"
                        target="_blank"
                        rel="noreferrer"
                        className="font-medium underline underline-offset-4"
                      >
                        GitHub
                      </a>
                      .
                    </p>
                  </div>
                </div>
              </footer>
            </div>
          </GrantProvider>
        </AuthProvider>
      </body>
    </html>
  )
}