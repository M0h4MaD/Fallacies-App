// frontend/src/components/layout/BottomNav.tsx (ملف جديد)
import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { BookOpen, PenLine, Swords, Trophy, User } from 'lucide-react'

const TABS = [
  { to: '/library', Icon: BookOpen, labelAr: 'المكتبة', labelEn: 'Library' },
  { to: '/correct', Icon: PenLine, labelAr: 'صحّح', labelEn: 'Correct' },
  { to: '/chat/debater', Icon: Swords, labelAr: 'ناظرني', labelEn: 'Debate' },
  { to: '/leaderboard', Icon: Trophy, labelAr: 'الصدارة', labelEn: 'Top' },
  { to: '/profile', Icon: User, labelAr: 'ملفي', labelEn: 'Profile' },
]

export default function BottomNav() {
  const { i18n } = useTranslation()
  const lang = i18n.language === 'en' ? 'en' : 'ar'

  return (
    <nav className="fixed inset-x-0 bottom-0 z-10 flex border-t border-border bg-surface sm:hidden">
      {TABS.map(({ to, Icon, labelAr, labelEn }) => (
        <NavLink key={to} to={to} className={({ isActive }) => ['flex flex-1 flex-col items-center gap-1 py-2.5 text-xs', isActive ? 'text-brand' : 'text-text-muted'].join(' ')}>
          <Icon size={20} strokeWidth={2} />
          {lang === 'ar' ? labelAr : labelEn}
        </NavLink>
      ))}
    </nav>
  )
}