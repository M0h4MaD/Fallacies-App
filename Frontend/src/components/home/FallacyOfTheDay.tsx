// frontend/src/components/home/FallacyOfTheDay.tsx (ملف جديد)
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Calendar } from 'lucide-react'
import { apiClient } from '../../lib/apiClient'

interface Tip { textAr: string; textEn: string }

export default function FallacyOfTheDay() {
  const { i18n } = useTranslation()
  const lang = i18n.language === 'en' ? 'en' : 'ar'
  const [tip, setTip] = useState<Tip | null>(null)

  useEffect(() => { apiClient.get<Tip | null>('/api/tips/daily').then((r) => setTip(r.data)) }, [])
  if (!tip) return null

  return (
    <section className="rounded-2xl border border-brand/30 bg-brand/5 p-6 shadow-[var(--shadow-brand)]">
      <div className="mb-2 flex items-center gap-2 text-sm font-medium text-brand"><Calendar size={16} /> {lang === 'ar' ? 'مغالطة اليوم' : 'Fallacy of the Day'}</div>
      <p className="text-text">{lang === 'ar' ? tip.textAr : tip.textEn}</p>
    </section>
  )
}