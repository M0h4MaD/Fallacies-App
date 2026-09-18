// frontend/src/hooks/useUnlockedFallacies.ts (ملف جديد)
import { useEffect, useState } from 'react'
import { apiClient } from '../lib/apiClient'
import type { Fallacy } from '../types'

export function useUnlockedFallacies() {
  const [fallacies, setFallacies] = useState<Fallacy[]>([])
  useEffect(() => { apiClient.get<Fallacy[]>('/api/fallacies/unlocked').then((r) => setFallacies(r.data)) }, [])
  return { fallacies }
}