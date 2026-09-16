// frontend/src/components/layout/Header.tsx (ملف جديد)
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useTheme } from '../../contexts/ThemeContext'

export default function Header() {
  const { t, i18n } = useTranslation()
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex max-w-3xl items-center justify-between p-4">
        <Link to="/" className="font-heading text-xl font-bold text-brand">{t('app.title')}</Link>
        <div className="flex gap-2">
          <button onClick={toggleTheme} className="rounded-lg border border-border px-3 py-1.5 text-sm text-text hover:bg-bg">
            {theme === 'light' ? t('theme.toDark') : t('theme.toLight')}
          </button>
          <button onClick={() => i18n.changeLanguage(i18n.language === 'ar' ? 'en' : 'ar')} className="rounded-lg border border-border px-3 py-1.5 text-sm text-text hover:bg-bg">
            {i18n.language === 'ar' ? 'English' : 'العربية'}
          </button>
        </div>
      </div>
    </header>
  )
}