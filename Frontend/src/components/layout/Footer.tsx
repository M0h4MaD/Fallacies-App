// frontend/src/components/layout/Footer.tsx (استبدله كامل)
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function Footer() {
  const { i18n } = useTranslation()
  const lang = i18n.language === 'en' ? 'en' : 'ar'
  
  return (
    <footer className="border-t border-border py-6 text-center text-sm text-text-muted">
      <div className="flex flex-wrap items-center justify-center gap-6">
        <Link to="/about" className="hover:text-text">{lang === 'ar' ? 'عن الموقع والخصوصية' : 'About & Privacy'}</Link>
        <Link to="/support" className="hover:text-text">{lang === 'ar' ? 'ادعم الموقع' : 'Support'}</Link>
        <a 
          href="https://github.com/M0h4MaD" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="flex items-center gap-1.5 hover:text-text"
        >
          {/* GitHub SVG Icon */}
          <svg 
            width="14" 
            height="14" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="lucide lucide-github"
          >
            <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
            <path d="M9 18c-4.51 2-5-2-7-2"></path>
          </svg>
          M0h4MaD
        </a>
      </div>
      <p className="mt-4 text-xs">© {new Date().getFullYear()} {lang === 'ar' ? 'مغالطة. كل الحقوق محفوظة.' : 'Mughalata. All rights reserved.'}</p>
    </footer>
  )
}