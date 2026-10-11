import { useEffect, useState } from 'react'
import { apiClient } from '../lib/apiClient'

interface LeaderboardEntry { id: string; displayName: string; xp: number; level: number }
interface LeaderboardResponse { page: number; pageSize: number; total: number; results: LeaderboardEntry[] }

export function useLeaderboard(page: number) {
  const [data, setData] = useState<LeaderboardResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    setIsLoading(true)
    apiClient.get<LeaderboardResponse>('/api/leaderboard', { params: { page } }).then((r) => setData(r.data)).finally(() => setIsLoading(false))
  }, [page])
  return { data, isLoading }
}
