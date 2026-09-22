// frontend/src/pages/LeaderboardPage.tsx (استبدله كامل)
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLeaderboard } from '../hooks/useLeaderboard'
import { useAuthStore } from '../store/authStore'
import LoadingTip from '../components/LoadingTip'

export default function LeaderboardPage() {
  const { i18n } = useTranslation()
  const lang = i18n.language === 'en' ? 'en' : 'ar'
  const [page, setPage] = useState(1)
  const { data, isLoading } = useLeaderboard(page)
  const currentUserId = useAuthStore((s) => s.appUser?.id)

  return (
    <div>
      <h1 className="mb-8 font-heading text-3xl font-bold text-text">{lang === 'ar' ? 'لوحة الصدارة' : 'Leaderboard'}</h1>
      {isLoading || !data ? (
        <LoadingTip />
      ) : (
        <>
          <div className="divide-y divide-border border-t border-border">
            {data.results.map((u, i) => (
              <div key={u.id} className={['flex items-center justify-between py-3', u.id === currentUserId ? 'text-brand' : 'text-text'].join(' ')}>
                <div className="flex items-center gap-4">
                  <span className="w-6 text-sm text-text-muted">{(page - 1) * data.pageSize + i + 1}</span>
                  <span className="font-medium">{u.displayName}</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-text-muted">
                  <span>{lang === 'ar' ? `مستوى ${u.level}` : `Lvl ${u.level}`}</span>
                  <span>{u.xp} XP</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex gap-3">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="rounded-lg border border-border px-4 py-2 text-sm text-text disabled:opacity-40">{lang === 'ar' ? 'السابق' : 'Prev'}</button>
            <button onClick={() => setPage((p) => p + 1)} disabled={page * data.pageSize >= data.total} className="rounded-lg border border-border px-4 py-2 text-sm text-text disabled:opacity-40">{lang === 'ar' ? 'التالي' : 'Next'}</button>
          </div>
        </>
      )}
    </div>
  )
}