import React from 'react'

export default function Profile() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Your Profile</h1>
      <p className="mb-4">Manage your account settings and company information here.</p>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-2">Company Information</h2>
        <p>No company information available. Please update your profile.</p>
      </div>
    </div>
  )
}