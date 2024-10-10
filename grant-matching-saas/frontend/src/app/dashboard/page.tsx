import React from 'react'

export default function Dashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <p className="mb-4">Welcome to your dashboard. Here you can view your grant matches and applications.</p>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-2">Your Grant Matches</h2>
        <p>No grant matches found yet. Start by uploading your company documents.</p>
      </div>
    </div>
  )
}