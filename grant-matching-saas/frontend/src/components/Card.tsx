'use client'

import { FC, PropsWithChildren } from 'react'
import { CardHeader } from './ui/cardHeader'
import { CardTitle } from './ui/cardTitle'

interface CardProps {
  title?: string
  className?: string
}

const Card: FC<PropsWithChildren<CardProps>> = ({ children, title, className = '' }) => {
  return (
    <div className={`bg-white shadow overflow-hidden sm:rounded-lg ${className}`}>
      {title && (
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
      )}
      <div className="px-4 py-5 sm:p-6">{children}</div>
    </div>
  )
}

export { Card }