// frontend/src/pages/HomePage.tsx (استبدله كامل)
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import FallacySpotter from '../components/home/FallacySpotter'

export default function HomePage() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language === 'en' ? 'en' : 'ar'

  return (
    <div>
      <section className="py-10">
        <h1 className="mb-4 font-heading text-4xl font-bold leading-tight text-text sm:text-5xl">
          {t('app.title')}
        </h1>
        <p className="max-w-prose text-lg text-text-muted">
          {lang === 'ar'
            ? 'تعلّم تكتشف المغالطات المنطقية يلي بتنسمعها بالسياسة والدين والإعلام كل يوم — بمنطق، مش بجدل.'
            : 'Learn to spot the logical fallacies you hear in politics, religion, and media every day — with logic, not arguments.'}
        </p>
        <Link to="/library" className="mt-8 inline-block rounded-lg bg-brand px-6 py-3 font-medium text-white transition-colors hover:bg-brand-hover">
          {lang === 'ar' ? 'ابدأ التعلم' : 'Start learning'}
        </Link>
      </section>

      <FallacySpotter />
    </div>
  )
}