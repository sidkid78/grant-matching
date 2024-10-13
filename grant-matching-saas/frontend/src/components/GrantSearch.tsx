import React, { useState } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Label } from './ui/label'

interface SearchParams {
  query: string;
  agency: string;
  min_amount: string;
  max_amount: string;
  start_date: string;
  end_date: string;
  sort_by: string;
  sort_order: string;
}

interface GrantSearchProps {
  onSearch: (params: SearchParams) => void;
}

export function GrantSearch({ onSearch }: GrantSearchProps) {
  const [query, setQuery] = useState('')
  const [agency, setAgency] = useState('')
  const [minAmount, setMinAmount] = useState('')
  const [maxAmount, setMaxAmount] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [sortBy, setSortBy] = useState('due_date')
  const [sortOrder, setSortOrder] = useState('asc')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch({
      query,
      agency,
      min_amount: minAmount,
      max_amount: maxAmount,
      start_date: startDate,
      end_date: endDate,
      sort_by: sortBy,
      sort_order: sortOrder
    })
  }

  function renderInput(
    id: string, 
    type: string, 
    value: string, 
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, 
    placeholder: string = ''
  ) {
    return (
      <div>
        <Label htmlFor={id}>{id.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</Label>
        <Input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
      </div>
    )
  }

  return (
    <form onSubmit={handleSearch} className="space-y-4">
      {renderInput('query', 'text', query, (e) => setQuery(e.target.value), 'Search grants...')}
      {renderInput('agency', 'text', agency, (e) => setAgency(e.target.value), 'Filter by agency...')}
      <div className="flex space-x-4">
        <div className="flex-1">
          {renderInput('minAmount', 'number', minAmount, (e) => setMinAmount(e.target.value), 'Min amount...')}
        </div>
        <div className="flex-1">
          {renderInput('maxAmount', 'number', maxAmount, (e) => setMaxAmount(e.target.value), 'Max amount...')}
        </div>
      </div>
      <div className="flex space-x-4">
        <div className="flex-1">
          {renderInput('startDate', 'date', startDate, (e) => setStartDate(e.target.value))}
        </div>
        <div className="flex-1">
          {renderInput('endDate', 'date', endDate, (e) => setEndDate(e.target.value))}
        </div>
      </div>
      <div className="flex space-x-4">
        <div className="flex-1">
          <Label htmlFor="sortBy">Sort By</Label>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="due_date">Due Date</SelectItem>
              <SelectItem value="funding_amount">Funding Amount</SelectItem>
              <SelectItem value="title">Title</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1">
          <Label htmlFor="sortOrder">Sort Order</Label>
          <Select value={sortOrder} onValueChange={setSortOrder}>
            <SelectTrigger>
              <SelectValue placeholder="Sort order..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">Ascending</SelectItem>
              <SelectItem value="desc">Descending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button type="submit">Search</Button>
    </form>
  )
}