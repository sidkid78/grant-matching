import React from 'react'
import Button from '../components/Button'

export default function Home() {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to Grant Matching SaaS</h1>
      <p className="text-xl mb-8">Find the perfect funding opportunities for your business</p>
      <Button variant="primary" size="large">Get Started</Button>
    </div>
  )
}