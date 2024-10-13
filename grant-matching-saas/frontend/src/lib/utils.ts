interface FetchOptions {
  method?: string
  headers?: Record<string, string>
  body?: string
}

async function fetchData<T>(url: string, options: FetchOptions = {}): Promise<T> {
  const response = await fetch(url, options)
  if (!response.ok) {
    throw new Error(`Failed to fetch data from ${url}`)
  }
  return response.json()
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

function formatDate(dateString: string): string {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateString).toLocaleDateString(undefined, options)
}

function calculateMatchScore(score: number): string {
  return `${score}%`
}

function cn(...classes: (string | undefined)[]): string {
  return classes.filter(Boolean).join(' ')
}

export { fetchData, formatCurrency, formatDate, calculateMatchScore, cn }
