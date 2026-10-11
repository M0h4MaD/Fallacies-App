import { useEffect, useState } from 'react'
import { apiClient } from '../lib/apiClient'

interface AdminUser { id: string; displayName: string; email: string | null; isSuspended: boolean; isGuest: boolean; xp: number }
interface AdminReport { id: string; contentType: string; contentText: string; reason: string | null; createdAt: string; reporter: { displayName: string } }

export function useAdminData() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [reports, setReports] = useState<AdminReport[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([apiClient.get<AdminUser[]>('/api/admin/users'), apiClient.get<AdminReport[]>('/api/reports')])
      .then(([u, r]) => { setUsers(u.data); setReports(r.data) })
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false))
  }, [])

  async function toggleSuspend(userId: string, isSuspended: boolean) {
    const { data } = await apiClient.patch<AdminUser>(`/api/admin/users/${userId}/suspend`, { isSuspended })
    setUsers((prev) => prev.map((u) => (u.id === userId ? data : u)))
  }

  return { users, reports, isLoading, error, toggleSuspend }
}
