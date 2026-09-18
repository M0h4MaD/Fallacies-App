// frontend/src/pages/ProfilePage.tsx (استبدله كامل)
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '../store/authStore'

const BADGE_LABELS: Record<string, { ar: string; en: string }> = {
  'first-correct': { ar: 'أول إجابة صح', en: 'First Correct Answer' },
  'streak-7': { ar: '7 أيام متتالية', en: '7-Day Streak' },
  'streak-30': { ar: '30 يوم متتالي', en: '30-Day Streak' },
  'level-5': { ar: 'وصلت مستوى 5', en: 'Reached Level 5' },
  'level-10': { ar: 'وصلت مستوى 10', en: 'Reached Level 10' },
}

export default function ProfilePage() {
  const { i18n } = useTranslation()
  const lang = i18n.language === 'en' ? 'en' : 'ar'
  const appUser = useAuthStore((s) => s.appUser)

  if (!appUser) return <p className="text-text-muted">{lang === 'ar' ? 'سجّل دخول لتشوف ملفك.' : 'Sign in to see your profile.'}</p>

  return (
    <div>
      <h1 className="mb-1 font-heading text-3xl font-bold text-text">{appUser.displayName}</h1>
      <p className="mb-8 text-text-muted">{lang === 'ar' ? `مستوى ${appUser.level}` : `Level ${appUser.level}`}</p>

      <div className="mb-8 grid grid-cols-3 gap-4">
        <Stat label={lang === 'ar' ? 'نقاط الخبرة' : 'XP'} value={appUser.xp} />
        <Stat label={lang === 'ar' ? 'أيام متتالية' : 'Streak'} value={appUser.streak} />
        <Stat label={lang === 'ar' ? 'الشارات' : 'Badges'} value={appUser.badgeIds.length} />
      </div>

      <h2 className="mb-3 font-heading text-lg font-bold text-text">{lang === 'ar' ? 'الشارات' : 'Badges'}</h2>
      {appUser.badgeIds.length === 0 ? (
        <p className="text-text-muted">{lang === 'ar' ? 'ولا شارة لسا — كمّل تتمرن!' : 'No badges yet — keep practicing!'}</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {appUser.badgeIds.map((id) => (
            <span key={id} className="rounded-lg border border-border bg-surface px-3 py-1.5 text-sm text-text">{BADGE_LABELS[id]?.[lang] ?? id}</span>
          ))}
        </div>
      )}
    </div>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-border bg-surface p-4 text-center">
      <p className="font-heading text-2xl font-bold text-brand">{value}</p>
      <p className="mt-1 text-sm text-text-muted">{label}</p>
    </div>
  )
}