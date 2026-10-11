import { useEffect, useState } from 'react'
import { apiClient } from '../lib/apiClient'
import type { Fallacy } from '../types'

interface ReviewItem { fallacy: Fallacy; timesCorrect: number; timesIncorrect: number }

export function useReviewQueue() {
  const [items, setItems] = useState<ReviewItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => { apiClient.get<ReviewItem[]>('/api/progress/review-queue').then((r) => setItems(r.data)).finally(() => setIsLoading(false)) }, [])
  return { items, isLoading }
}
