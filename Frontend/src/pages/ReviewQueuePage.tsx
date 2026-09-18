// frontend/src/pages/ReviewQueuePage.tsx (استبدله كامل)
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useReviewQueue } from '../hooks/useReviewQueue'

export default function ReviewQueuePage() {
  const { i18n } = useTranslation()
  const lang = i18n.language === 'en' ? 'en' : 'ar'
  const { items, isLoading } = useReviewQueue()

  return (
    <div>
      <h1 className="mb-1 font-heading text-3xl font-bold text-text">{lang === 'ar' ? 'قائمة المراجعة' : 'Review Queue'}</h1>
      <p className="mb-8 text-text-muted">{lang === 'ar' ? 'مغالطات حان وقت مراجعتها' : 'Fallacies due for review'}</p>
      {isLoading ? (
        <p className="text-text-muted">{lang === 'ar' ? 'عم نحمّل...' : 'Loading...'}</p>
      ) : items.length === 0 ? (
        <p className="text-text-muted">{lang === 'ar' ? 'ولا شي بانتظار المراجعة هلق 🎉' : 'Nothing due for review right now 🎉'}</p>
      ) : (
        <div className="divide-y divide-border border-t border-border">
          {items.map(({ fallacy }) => (
            <div key={fallacy.slug} className="flex items-center justify-between py-4">
              <span className="font-heading font-bold text-text">{lang === 'ar' ? fallacy.nameAr : fallacy.nameEn}</span>
              <Link to={`/quiz/${fallacy.slug}`} className="text-sm font-medium text-brand hover:text-brand-hover">{lang === 'ar' ? 'راجع الآن' : 'Review now'}</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}