import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowUp, Share2, Check } from 'lucide-react'
import BrandMark from '../BrandMark'
import { Github } from '../GithubIcon'

const EXPLORE = [
  { to: '/library', ar: 'المكتبة', en: 'Library' },
  { to: '/quiz', ar: 'كويز', en: 'Quiz' },
  { to: '/correct', ar: 'صحّح', en: 'Correct' },
  { to: '/chat/debater', ar: 'ناظرني', en: 'Debate' },
  { to: '/chat/ai', ar: 'محادثة AI', en: 'AI Chat' },
]
const MORE = [
  { to: '/about', ar: 'عن الموقع والخصوصية', en: 'About & Privacy' },
]
const linkBase = 'py-1 text-sm text-text-muted transition-colors hover:text-text'
const pillBase = 'flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs text-text-muted transition-colors hover:bg-bg hover:text-text'

export default function Footer() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language === 'en' ? 'en' : 'ar'
  const [copied, setCopied] = useState(false)

  function scrollToTop() {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })
  }

  async function share() {
    const data = {
      title: t('app.title'),
      text: lang === 'ar' ? 'تعلّم تكتشف المغالطات المنطقية — بمنطق، مش بجدل.' : 'Learn to spot logical fallacies — with logic, not arguments.',
      url: window.location.origin,
    }
    if (navigator.share) {
      try { await navigator.share(data) } catch { /* المستخدم سكّر النافذة */ }
      return
    }
    await navigator.clipboard.writeText(data.url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <footer className="border-t border-border bg-surface pb-[calc(5rem_+_env(safe-area-inset-bottom))] sm:pb-0">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-[1.4fr_1fr_1fr] sm:gap-10">
          <div className="col-span-2 sm:col-span-1">
            <Link to="/" className="inline-flex items-center gap-2 font-heading text-xl font-bold text-brand">
              <BrandMark size={26} /> {t('app.title')}
            </Link>
            <p className="mt-3 max-w-xs text-sm text-text-muted">
              {lang === 'ar' ? 'تعلّم تكتشف المغالطات المنطقية بالسياسة والدين والإعلام — بمنطق، مش بجدل.' : 'Learn to spot logical fallacies in politics, religion, and media — with logic, not arguments.'}
            </p>
          </div>

          <nav aria-label={lang === 'ar' ? 'استكشف' : 'Explore'}>
            <h2 className="mb-2 text-sm font-semibold text-text">{lang === 'ar' ? 'استكشف' : 'Explore'}</h2>
            <ul>
              {EXPLORE.map((l) => (
                <li key={l.to}><Link to={l.to} className={`inline-block ${linkBase}`}>{lang === 'ar' ? l.ar : l.en}</Link></li>
              ))}
            </ul>
          </nav>

          <nav aria-label={lang === 'ar' ? 'المزيد' : 'More'}>
            <h2 className="mb-2 text-sm font-semibold text-text">{lang === 'ar' ? 'المزيد' : 'More'}</h2>
            <ul>
              {MORE.map((l) => (
                <li key={l.to}><Link to={l.to} className={`inline-block ${linkBase}`}>{lang === 'ar' ? l.ar : l.en}</Link></li>
              ))}
              <li>
                <a href="https://github.com/M0h4MaD" target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-1.5 ${linkBase}`}>
                  <Github  /> M0h4MaD
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-8 flex flex-col items-center gap-4 border-t border-border pt-6 text-center sm:flex-row sm:justify-between sm:text-start">
          <div className="space-y-1 text-xs text-text-muted">
            <p>© {new Date().getFullYear()} {lang === 'ar' ? 'مغالطة. كل الحقوق محفوظة.' : 'Mughalata. All rights reserved.'}</p>
            <p>{lang === 'ar' ? 'الأمثلة المولّدة بالذكاء الاصطناعي للتدريب التعليمي فقط.' : 'AI-generated examples are for educational practice only.'}</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={share} className={pillBase}>
              {copied ? <Check size={13} className="text-brand" /> : <Share2 size={13} />}
              {copied ? (lang === 'ar' ? 'اننسخ الرابط' : 'Link copied') : (lang === 'ar' ? 'شارك الموقع' : 'Share')}
            </button>
            <button onClick={scrollToTop} className={pillBase}>
              <ArrowUp size={13} /> {lang === 'ar' ? 'للأعلى' : 'Top'}
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
