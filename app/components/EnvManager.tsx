'use client'

import { useState, useEffect } from 'react'

export function EnvManager() {
  const [envVars, setEnvVars] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchEnvVars()
  }, [])

  const fetchEnvVars = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/env')
      if (!response.ok) throw new Error('Failed to fetch environment variables')
      const data = await response.json()
      setEnvVars(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/env', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(envVars),
      })
      if (!response.ok) throw new Error('Failed to update environment variables')
      alert('Environment variables updated successfully')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  const handleChange = (key: string, value: string) => {
    setEnvVars(prev => ({ ...prev, [key]: value }))
  }

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {Object.entries(envVars).map(([key, value]) => (
        <div key={key} className="flex items-center space-x-2">
          <label htmlFor={key} className="w-1/3 text-right">{key}:</label>
          <input
            type="text"
            id={key}
            value={value}
            onChange={(e) => handleChange(key, e.target.value)}
            className="w-2/3 px-2 py-1 border rounded"
          />
        </div>
      ))}
      <div className="flex justify-end">
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Update Environment Variables
        </button>
      </div>
    </form>
  )
}

