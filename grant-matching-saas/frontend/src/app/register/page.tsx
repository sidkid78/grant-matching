'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Card, CardContent } from '../../components/ui/card'

export default function Register() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    companyName: '',
    ueiCode: '',
    naicsCode: '',
    employeeCount: ''
  })
  const [error, setError] = useState('')
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          company_name: formData.companyName,
          uei_code: formData.ueiCode,
          naics_code: formData.naicsCode,
          employee_count: parseInt(formData.employeeCount)
        }),
      })
      if (response.ok) {
        router.push('/login')
      } else {
        const data = await response.json()
        setError(data.msg)
      }
    } catch (err) {
      setError(`An error occurred during registration: ${err instanceof Error ? err.message : String(err)}`)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardContent>
          <div className="p-4">
            <h2 className="text-2xl font-bold text-center">Register</h2>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <Input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <Input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                Company Name
              </label>
              <Input
                type="text"
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="ueiCode" className="block text-sm font-medium text-gray-700">
                UEI Code
              </label>
              <Input
                type="text"
                id="ueiCode"
                name="ueiCode"
                value={formData.ueiCode}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="naicsCode" className="block text-sm font-medium text-gray-700">
                NAICS Code
              </label>
              <Input
                type="text"
                id="naicsCode"
                name="naicsCode"
                value={formData.naicsCode}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="employeeCount" className="block text-sm font-medium text-gray-700">
                Number of Employees
              </label>
              <Input
                type="number"
                id="employeeCount"
                name="employeeCount"
                value={formData.employeeCount}
                onChange={handleChange}
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" className="w-full">
              Register
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Login here
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
