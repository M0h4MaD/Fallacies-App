import { useEffect, useState } from 'react'
import { apiClient } from '../lib/apiClient'
import type { Fallacy } from '../types'

export function useUnlockedFallacies() {
  const [fallacies, setFallacies] = useState<Fallacy[]>([])
  const [error, setError] = useState<string | null>(null)
  useEffect(() => {
    apiClient.get<Fallacy[]>('/api/fallacies/unlocked').then((r) => setFallacies(r.data)).catch((err) => setError(err.message))
  }, [])
  return { fallacies, error }
}
