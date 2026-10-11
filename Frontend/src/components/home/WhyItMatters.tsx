import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { ShieldCheck, Scale, MessageCircle } from 'lucide-react'

const REASONS = [
  { Icon: ShieldCheck, ar: { title: 'تحصّن نفسك', body: 'من الإقناع الرخيص — الخوف، الضغط الجماعي، الشعارات — قبل ما يأثر فيك.' }, en: { title: 'Protect yourself', body: 'From cheap persuasion — fear, peer pressure, slogans — before it works on you.' } },
  { Icon: Scale, ar: { title: 'قرارات أوضح', body: 'تفرّق بين حجة فعلاً قوية وحجة بس شكلها قوي.' }, en: { title: 'Clearer decisions', body: 'Tell a genuinely strong argument from one that only sounds strong.' } },
  { Icon: MessageCircle, ar: { title: 'نقاش أنزه', body: 'تختلف مع حدا بدون ما تحتاج تكسبه — بس توصلوا لفهم أوضح سوا.' }, en: { title: 'Fairer disagreement', body: 'Disagree with someone without needing to win — just reach clearer understanding together.' } },
]

export default function WhyItMatters() {
  const { i18n } = useTranslation()
  const lang = i18n.language === 'en' ? 'en' : 'ar'
  return (
    <section className="border-y border-border py-12">
      <h2 className="mb-8 font-heading text-3xl font-bold text-text">{lang === 'ar' ? 'ليش لازم تتعلّمها؟' : 'Why does this matter?'}</h2>
      <div className="grid gap-6 sm:grid-cols-3">
        {REASONS.map(({ Icon, ar, en }, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
            className="rounded-xl border border-border bg-surface p-5 shadow-[var(--shadow-elevated)]">
            <Icon size={22} className="mb-3 text-brand" strokeWidth={1.75} />
            <h3 className="mb-1 font-heading text-base font-bold text-text">{lang === 'ar' ? ar.title : en.title}</h3>
            <p className="text-sm text-text-muted">{lang === 'ar' ? ar.body : en.body}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
