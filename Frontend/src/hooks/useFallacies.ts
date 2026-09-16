// frontend/src/hooks/useFallacies.ts (ملف جديد)
import { mockFallacies } from '../data/fallacies.mock'
import type { Fallacy } from '../types'

export function useFallacies(): { fallacies: Fallacy[]; isLoading: boolean } {
  return { fallacies: mockFallacies, isLoading: false }
}