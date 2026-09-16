// frontend/src/components/home/FallacySpotter.tsx (ملف جديد)
// Landing-page teaser: a taste of the real quiz loop before sign-up. Static example for now —
// Phase 5 swaps this for a live Gemini-generated one via the same component shape.
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

const STATEMENT_AR = 'كل أصدقائي مقتنعين بهاي الفكرة، فلازم تكون صحيحة.'
const STATEMENT_EN = 'All my friends believe this, so it must be true.'
const CORRECT_SLUG = 'bandwagon'

const OPTIONS = [
  { slug: 'bandwagon', labelAr: 'مغالطة الشعبية', labelEn: 'Bandwagon' },
  { slug: 'appeal-to-authority', labelAr: 'الاحتكام إلى السلطة', labelEn: 'Appeal to Authority' },
  { slug: 'hasty-generalization', labelAr: 'التعميم المتسرع', labelEn: 'Hasty Generalization' },
]

export default function FallacySpotter() {
  const { i18n } = useTranslation()
  const lang = i18n.language === 'en' ? 'en' : 'ar'
  const [picked, setPicked] = useState<string | null>(null)

  return (
    <div className="border-y border-border py-8">
      <p className="mb-5 text-sm text-text-muted">
        {lang === 'ar' ? 'جرّب: شو المغالطة هون؟' : 'Try it: what fallacy is this?'}
      </p>
      <p className="mb-6 font-heading text-2xl font-bold text-text">
        “{lang === 'ar' ? STATEMENT_AR : STATEMENT_EN}”
      </p>
      <div className="flex flex-wrap gap-3">
        {OPTIONS.map((opt) => {
          const isCorrect = opt.slug === CORRECT_SLUG
          const isPicked = picked === opt.slug
          const revealed = picked !== null
          return (
            <button
              key={opt.slug}
              onClick={() => setPicked(opt.slug)}
              disabled={revealed}
              className={[
                'rounded-lg border px-4 py-2 text-sm transition-colors',
                revealed && isCorrect && 'border-brand bg-brand/10 text-brand',
                revealed && isPicked && !isCorrect && 'border-flag bg-flag/10 text-flag',
                revealed && !isPicked && !isCorrect && 'border-border text-text-muted',
                !revealed && 'border-border text-text hover:bg-surface',
              ].filter(Boolean).join(' ')}
            >
              {lang === 'ar' ? opt.labelAr : opt.labelEn}
            </button>
          )
        })}
      </div>
      {picked && (
        <p className="mt-5 text-text-muted">
          {picked === CORRECT_SLUG
            ? (lang === 'ar' ? 'بالضبط — الشعبية مش دليل على الصحة.' : "Exactly — popularity isn't evidence of truth.")
            : (lang === 'ar' ? 'قريب! الجواب الصح هو "مغالطة الشعبية".' : 'Close! The right answer is "Bandwagon."')}
        </p>
      )}
    </div>
  )
}