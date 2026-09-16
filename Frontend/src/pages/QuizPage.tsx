// frontend/src/pages/QuizPage.tsx (استبدله كامل)
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useQuizSession } from '../hooks/useQuizSession'
import { mockFallacies } from '../data/fallacies.mock'

function fallacyName(slug: string, lang: 'ar' | 'en') {
  const f = mockFallacies.find((f) => f.slug === slug)
  return f ? (lang === 'ar' ? f.nameAr : f.nameEn) : slug
}

export default function QuizPage() {
  const { i18n } = useTranslation()
  const lang = i18n.language === 'en' ? 'en' : 'ar'
  const { question, options, selectedSlug, selectAnswer, next, isLastQuestion, isFinished, report, totalQuestions, currentNumber } = useQuizSession()

  if (isFinished && report) {
    return (
      <div>
        <h1 className="mb-6 font-heading text-3xl font-bold text-text">{lang === 'ar' ? 'نتيجة الاختبار' : 'Quiz Result'}</h1>
        <p className="mb-8 font-heading text-5xl font-bold text-brand">{report.scorePercent}%</p>
        <div className="divide-y divide-border border-t border-border">
          {Object.entries(report.perFallacyBreakdown).map(([slug, stat]) => (
            <div key={slug} className="flex items-center justify-between py-3">
              <span className="text-text">{fallacyName(slug, lang)}</span>
              <span className="text-sm text-text-muted">{stat.correct}/{stat.total}</span>
            </div>
          ))}
        </div>
        <Link to="/library" className="mt-8 inline-block rounded-lg bg-brand px-6 py-3 font-medium text-white transition-colors hover:bg-brand-hover">
          {lang === 'ar' ? 'رجوع للمكتبة' : 'Back to Library'}
        </Link>
      </div>
    )
  }

  if (!question) return null

  return (
    <div>
      <p className="mb-6 text-sm text-text-muted">{lang === 'ar' ? `سؤال ${currentNumber} من ${totalQuestions}` : `Question ${currentNumber} of ${totalQuestions}`}</p>
      <p className="mb-8 font-heading text-2xl font-bold text-text">“{lang === 'ar' ? question.textAr : question.textEn}”</p>
      <div className="flex flex-col gap-3">
        {options.map((slug) => {
          const isCorrect = slug === question.correctSlug
          const isPicked = slug === selectedSlug
          const revealed = selectedSlug !== null
          return (
            <button
              key={slug}
              onClick={() => selectAnswer(slug)}
              disabled={revealed}
              className={[
                'rounded-lg border px-4 py-3 text-start transition-colors',
                revealed && isCorrect && 'border-brand bg-brand/10 text-brand',
                revealed && isPicked && !isCorrect && 'border-flag bg-flag/10 text-flag',
                revealed && !isPicked && !isCorrect && 'border-border text-text-muted',
                !revealed && 'border-border text-text hover:bg-surface',
              ].filter(Boolean).join(' ')}
            >
              {fallacyName(slug, lang)}
            </button>
          )
        })}
      </div>
      {selectedSlug && (
        <button onClick={next} className="mt-6 rounded-lg bg-brand px-6 py-3 font-medium text-white transition-colors hover:bg-brand-hover">
          {isLastQuestion ? (lang === 'ar' ? 'شوف النتيجة' : 'See result') : (lang === 'ar' ? 'التالي' : 'Next')}
        </button>
      )}
    </div>
  )
}