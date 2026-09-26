// frontend/src/components/layout/Header.tsx (استبدله كامل)
import { useEffect, useRef, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Moon, Sun, Languages, ChevronDown } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'
import { useAuthStore } from '../../store/authStore'
import StreakFlame from '../StreakFlame'

const NAV_LINKS = [
  { to: '/library', ar: 'المكتبة', en: 'Library' },
  { to: '/review', ar: 'المراجعة', en: 'Review' },
  { to: '/quiz', ar: 'كويز', en: 'Quiz' },
  { to: '/correct', ar: 'صحّح', en: 'Correct' },
  { to: '/chat/debater', ar: 'ناظرني', en: 'Debate' },
  { to: '/chat/ai', ar: 'محادثة AI', en: 'AI Chat' },
  { to: '/leaderboard', ar: 'الصدارة', en: 'Leaderboard' },
]
const navLinkClass = ({ isActive }: { isActive: boolean }) => ['whitespace-nowrap text-sm transition-colors', isActive ? 'font-medium text-brand' : 'text-text hover:text-brand'].join(' ')

export default function Header() {
  const { t, i18n } = useTranslation()
  const { theme, toggleTheme } = useTheme()
  const { appUser, isLoading, signOut } = useAuthStore()
  const lang = i18n.language === 'en' ? 'en' : 'ar'
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  return (
    <header className="border-b border-border bg-surface">
      <div className="relative mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link to="/" className="shrink-0 font-heading text-2xl font-bold text-brand">{t('app.title')}</Link>

        {/* left-1/2 + translateX(-50%) فيزيائي، مش logical — التوسيط بيصير صحيح
            بغض النظر عن فرق عرض اللوغو عن أزرار اليمين، وبغض النظر عن RTL/LTR. */}
        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-5 sm:flex lg:gap-6">
          {NAV_LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} className={navLinkClass}>{lang === 'ar' ? link.ar : link.en}</NavLink>
          ))}
          {appUser?.role === 'admin' && <NavLink to="/admin" className={navLinkClass}>{lang === 'ar' ? 'الإدارة' : 'Admin'}</NavLink>}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <button onClick={toggleTheme} aria-label="theme" className="rounded-lg border border-border p-2 text-text hover:bg-bg">
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
          </button>
          <button onClick={() => i18n.changeLanguage(lang === 'ar' ? 'en' : 'ar')} aria-label="language" className="rounded-lg border border-border p-2 text-text hover:bg-bg">
            <Languages size={16} />
          </button>

          {!isLoading && (
            appUser && !appUser.isGuest ? (
              <div className="flex items-center gap-3">
                <StreakFlame streak={appUser.streak} />
                <div ref={menuRef} className="relative">
                  <button onClick={() => setMenuOpen((o) => !o)} className="flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-sm font-medium text-text hover:bg-bg">
                    {appUser.displayName}
                    <ChevronDown size={14} className={menuOpen ? 'rotate-180 transition-transform' : 'transition-transform'} />
                  </button>
                  {menuOpen && (
                    <div className="absolute end-0 top-full z-10 mt-2 w-44 overflow-hidden rounded-lg border border-border bg-surface shadow-lg">
                      <Link to="/profile" onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 text-sm text-text hover:bg-bg">{lang === 'ar' ? 'ملفي الشخصي' : 'My Profile'}</Link>
                      <button onClick={() => { setMenuOpen(false); signOut() }} className="block w-full px-4 py-2.5 text-start text-sm text-flag hover:bg-bg">{lang === 'ar' ? 'تسجيل خروج' : 'Sign out'}</button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <Link to="/sign-in" className="rounded-lg bg-brand px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-hover">{lang === 'ar' ? 'تسجيل دخول' : 'Sign in'}</Link>
            )
          )}
        </div>
      </div>
    </header>
  )
}