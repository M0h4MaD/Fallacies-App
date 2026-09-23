// frontend/src/components/layout/Footer.tsx — استبدله كامل
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function Footer() {
  const { i18n } = useTranslation()
  const lang = i18n.language === 'en' ? 'en' : 'ar'
  return (
    <footer className="border-t border-border py-6 text-center text-sm text-text-muted">
      <div className="flex justify-center gap-6">
        <Link to="/about" className="hover:text-text">{lang === 'ar' ? 'عن الموقع والخصوصية' : 'About & Privacy'}</Link>
        <Link to="/support" className="hover:text-text">{lang === 'ar' ? 'ادعم الموقع' : 'Support'}</Link>
      </div>
    </footer>
  )
}