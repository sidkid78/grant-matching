'use client'

import { FC } from 'react'
import { Button } from './Button'
import { Card } from './Card'
import { CardHeader } from './ui/cardHeader'
import { CardTitle } from './ui/cardTitle'
import { Label } from './ui/label'

interface GrantCardProps {
  title: string
  agency: string
  dueDate: string
  fundingAmount: string
  matchScore: number
}

const GrantCard: FC<GrantCardProps> = ({ title, agency, dueDate, fundingAmount, matchScore }) => {
  function renderDetail(label: string, value: string | number, isProgressBar: boolean = false) {
    return (
      <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
        <dt>
          <Label htmlFor={`${label.toLowerCase().replace(/\s+/g, '-')}`}>{label}</Label>
        </dt>
        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2" id={`${label.toLowerCase().replace(/\s+/g, '-')}`}>
          {isProgressBar ? (
            <div className="flex items-center">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${value}%` }} // This line remains as Tailwind doesn't support dynamic widths
                ></div>
              </div>
              <span className="ml-2">{value}%</span>
            </div>
          ) : (
            value
          )}
        </dd>
      </div>
    )
  }

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">{agency}</p>
      </CardHeader>
      <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
        <dl className="sm:divide-y sm:divide-gray-200">
          {renderDetail('Due Date', dueDate)}
          {renderDetail('Funding Amount', fundingAmount)}
          {renderDetail('Match Score', matchScore, true)}
        </dl>
      </div>
      <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
        <Button variant="primary" size="small">View Details</Button>
      </div>
    </Card>
  )
}

export { GrantCard }