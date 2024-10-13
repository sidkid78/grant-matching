import { FC } from 'react'
import { Button } from '../components/ui/button'
import '../styles/globals.css'

const Home: FC = () => {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to Grant Matching SaaS</h1>
      <p className="text-xl mb-8">Find the perfect funding opportunities for your business</p>
      <Button variant="primary">Get Started</Button>
    </div>
  )
}

export default Home
