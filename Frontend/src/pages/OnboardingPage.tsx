// frontend/src/pages/OnboardingPage.tsx (استبدله كامل)
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { markOnboardingSeen } from '../lib/onboarding'

interface Slide { titleAr: string; titleEn: string; bodyAr: string; bodyEn: string }
const SLIDES: Slide[] = [
  { titleAr: 'اكتشف المغالطات المنطقية', titleEn: 'Spot logical fallacies', bodyAr: 'بالسياسة، الدين، الإعلام — تعلّم تميّز الاستدلال الضعيف بمنطق، مش بجدل.', bodyEn: 'In politics, religion, media — learn to recognize weak reasoning with logic, not arguments.' },
  { titleAr: 'تمرّن بأمثلة حقيقية', titleEn: 'Practice with real examples', bodyAr: 'كل مرة بتتمرن، جملة أو حوار جديد — مولّد إلك، مش بنك أسئلة ثابت.', bodyEn: 'Every time you practice, a fresh sentence or dialogue — generated for you, not a fixed bank.' },
  { titleAr: 'اكسب خبرة وارتقِ بالمستوى', titleEn: 'Earn XP and level up', bodyAr: 'كل ما تتقن أكتر، بتتفتح مغالطات أصعب، وبتصير بالمقدمة على لوحة الصدارة.', bodyEn: 'As you master more, harder fallacies unlock — and you climb the leaderboard.' },
]

export default function OnboardingPage() {
  const navigate = useNavigate()
  const { i18n } = useTranslation()
  const lang = i18n.language === 'en' ? 'en' : 'ar'
  const [step, setStep] = useState(0)
  const isLast = step === SLIDES.length - 1
  const slide = SLIDES[step]

  function finish() { markOnboardingSeen(); navigate('/library') }

  return (
    <div className="flex min-h-[70vh] flex-col justify-between">
      <div className="flex-1 py-10">
        <h1 className="mb-4 font-heading text-3xl font-bold text-text">{lang === 'ar' ? slide.titleAr : slide.titleEn}</h1>
        <p className="max-w-prose text-lg text-text-muted">{lang === 'ar' ? slide.bodyAr : slide.bodyEn}</p>
      </div>
      <div>
        <div className="mb-6 flex gap-1.5">
          {SLIDES.map((_, i) => <span key={i} className={['h-1 flex-1 rounded-full', i <= step ? 'bg-brand' : 'bg-border'].join(' ')} />)}
        </div>
        <div className="flex justify-between">
          <button onClick={finish} className="px-4 py-2 text-sm text-text-muted hover:text-text">{lang === 'ar' ? 'تخطّي' : 'Skip'}</button>
          <button onClick={() => (isLast ? finish() : setStep((s) => s + 1))} className="rounded-lg bg-brand px-6 py-3 font-medium text-white transition-colors hover:bg-brand-hover">
            {isLast ? (lang === 'ar' ? 'يلا نبلش' : "Let's start") : (lang === 'ar' ? 'التالي' : 'Next')}
          </button>
        </div>
      </div>
    </div>
  )
}