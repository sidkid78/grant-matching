'use client'

import React, { useState, useEffect } from 'react'
import Card from '../../components/Card'
import Button from '../../components/Button'
import { fetchUserProfile, updateUserProfile, uploadDocument } from '../../services/api'

export default function Profile() {
  const [profile, setProfile] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await fetchUserProfile('1') // Assuming user ID 1 for now
        setProfile(data)
        setIsLoading(false)
      } catch (err) {
        setError(err.message)
        setIsLoading(false)
      }
    }
    loadProfile()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setProfile({ ...profile, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await updateUserProfile('1', profile) // Assuming user ID 1 for now
      alert('Profile updated successfully')
    } catch (err) {
      setError(err.message)
    }
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (file) {
      try {
        await uploadDocument(file)
        alert('Document uploaded successfully')
      } catch (err) {
        setError(err.message)
      }
    }
  }

  if (isLoading) return <div>Loading profile...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Your Profile</h1>
      <p className="mb-4">Manage your account settings and company information here.</p>
      <Card title="Company Information" className="mb-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">Company Name</label>
              <input 
                type="text" 
                name="companyName" 
                id="companyName" 
                value={profile.companyName} 
                onChange={handleInputChange}
                className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" 
              />
            </div>
            <div>
              <label htmlFor="ueiCode" className="block text-sm font-medium text-gray-700">UEI Code</label>
              <input 
                type="text" 
                name="ueiCode" 
                id="ueiCode" 
                value={profile.ueiCode} 
                onChange={handleInputChange}
                className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" 
              />
            </div>
            <div>
              <label htmlFor="naicsCode" className="block text-sm font-medium text-gray-700">NAICS Code</label>
              <input 
                type="text" 
                name="naicsCode" 
                id="naicsCode" 
                value={profile.naicsCode} 
                onChange={handleInputChange}
                className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" 
              />
            </div>
            <div>
              <label htmlFor="employeeCount" className="block text-sm font-medium text-gray-700">Number of Employees</label>
              <input 
                type="number" 
                name="employeeCount" 
                id="employeeCount" 
                value={profile.employeeCount} 
                onChange={handleInputChange}
                className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" 
              />
            </div>
          </div>
          <div className="mt-6">
            <Button variant="primary" type="submit">Save Changes</Button>
          </div>
        </form>
      </Card>
      <Card title="Document Upload">
        <p className="mb-4">Upload your company documents to improve grant matching accuracy.</p>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
          <div className="space-y-1 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="flex text-sm text-gray-600">
              <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                <span>Upload a file</span>
                <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileUpload} />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500">PDF, DOC, DOCX up to 10MB</p>
          </div>
        </div>
      </Card>
    </div>
  )
}