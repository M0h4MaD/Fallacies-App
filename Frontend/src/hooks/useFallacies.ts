// frontend/src/hooks/useFallacies.ts (استبدله كامل)
import { useEffect, useState } from 'react'
import { apiClient } from '../lib/apiClient'
import type { Fallacy } from '../types'

export function useFallacies() {
  const [fallacies, setFallacies] = useState<Fallacy[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    apiClient.get<Fallacy[]>('/api/fallacies')
      .then((res) => { if (!cancelled) setFallacies(res.data) })
      .catch((err) => { if (!cancelled) setError(err.message) })
      .finally(() => { if (!cancelled) setIsLoading(false) })
    return () => { cancelled = true }
  }, [])

  return { fallacies, isLoading, error }
}