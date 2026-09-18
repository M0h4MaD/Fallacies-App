// frontend/src/components/layout/Footer.tsx (ملف جديد)
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function Footer() {
  const { i18n } = useTranslation()
  const lang = i18n.language === 'en' ? 'en' : 'ar'
  return (
    <footer className="border-t border-border py-6 text-center text-sm text-text-muted">
      <Link to="/privacy" className="hover:text-text">{lang === 'ar' ? 'الخصوصية والاستخدام' : 'Privacy & Terms'}</Link>
    </footer>
  )
}