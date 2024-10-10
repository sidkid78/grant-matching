import React from 'react'

export default function Home() {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to Grant Matching SaaS</h1>
      <p className="text-xl mb-8">Find the perfect funding opportunities for your business</p>
      <button type="button" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Get Started
      </button>
    </div>
  )
}