'use client'

import React, { useState } from 'react'
import Input from './ui/input'
import Button from './Button' // Changed to default import
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

  return (
    <form onSubmit={handleSearch} className="space-y-4">
      <div>
        <Label htmlFor="query">Search</Label>
        <Input
          id="query"
          type="text"
          value={query}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
          placeholder="Search grants..."
        />
      </div>
      <div>
        <Label htmlFor="agency">Agency</Label>
        <Input
          id="agency"
          type="text"
          value={agency}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAgency(e.target.value)}
          placeholder="Filter by agency..."
        />
      </div>
      <div className="flex space-x-4">
        <div className="flex-1">
          <Label htmlFor="minAmount">Min Amount</Label>
          <Input
            id="minAmount"
            type="number"
            value={minAmount}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMinAmount(e.target.value)}
            placeholder="Min amount..."
          />
        </div>
        <div className="flex-1">
          <Label htmlFor="maxAmount">Max Amount</Label>
          <Input
            id="maxAmount"
            type="number"
            value={maxAmount}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMaxAmount(e.target.value)}
            placeholder="Max amount..."
          />
        </div>
      </div>
      <div className="flex space-x-4">
        <div className="flex-1">
          <Label htmlFor="startDate">Start Date</Label>
          <Input
            id="startDate"
            type="date"
            value={startDate}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStartDate(e.target.value)}
          />
        </div>
        <div className="flex-1">
          <Label htmlFor="endDate">End Date</Label>
          <Input
            id="endDate"
            type="date"
            value={endDate}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEndDate(e.target.value)}
          />
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