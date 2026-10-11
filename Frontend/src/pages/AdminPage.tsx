import { useTranslation } from 'react-i18next'
import { useAdminData } from '../hooks/useAdminData'

export default function AdminPage() {
  const { i18n } = useTranslation()
  const lang = i18n.language === 'en' ? 'en' : 'ar'
  const { users, reports, isLoading, error, toggleSuspend } = useAdminData()

  if (isLoading) return <p className="text-text-muted">{lang === 'ar' ? 'عم نحمّل...' : 'Loading...'}</p>
  if (error) return <p className="text-flag">{error}</p>

  return (
    <div>
      <h1 className="mb-8 font-heading text-3xl font-bold text-text">{lang === 'ar' ? 'لوحة الإدارة' : 'Admin'}</h1>

      <h2 className="mb-3 font-heading text-lg font-bold text-text">{lang === 'ar' ? 'المستخدمون' : 'Users'}</h2>
      <div className="mb-10 divide-y divide-border border-t border-border">
        {users.map((u) => (
          <div key={u.id} className="flex items-center justify-between py-3">
            <div>
              <p className="text-text">{u.displayName}</p>
              <p className="text-sm text-text-muted">{u.email ?? (lang === 'ar' ? 'ضيف' : 'Guest')} · {u.xp} XP</p>
            </div>
            <button
              onClick={() => toggleSuspend(u.id, !u.isSuspended)}
              className={['rounded-lg border px-3 py-1.5 text-sm', u.isSuspended ? 'border-flag text-flag' : 'border-border text-text hover:bg-surface'].join(' ')}
            >
              {u.isSuspended ? (lang === 'ar' ? 'إلغاء التعليق' : 'Unsuspend') : (lang === 'ar' ? 'تعليق' : 'Suspend')}
            </button>
          </div>
        ))}
      </div>

      <h2 className="mb-3 font-heading text-lg font-bold text-text">{lang === 'ar' ? 'البلاغات' : 'Reports'}</h2>
      {reports.length === 0 ? (
        <p className="text-text-muted">{lang === 'ar' ? 'ولا بلاغ لهلق.' : 'No reports yet.'}</p>
      ) : (
        <div className="divide-y divide-border border-t border-border">
          {reports.map((r) => (
            <div key={r.id} className="py-3">
              <p className="text-sm text-text-muted">{r.reporter.displayName} · {r.contentType}</p>
              <p className="mt-1 text-text">{r.contentText}</p>
              {r.reason && <p className="mt-1 text-sm text-text-muted">{r.reason}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
