import { useTranslation } from 'react-i18next'

export default function FallacyPrimer() {
  const { i18n } = useTranslation()
  const lang = i18n.language === 'en' ? 'en' : 'ar'
  return (
    <section className="grid gap-8 border-y border-border py-10 sm:grid-cols-3">
      <div>
        <h2 className="mb-2 font-heading text-lg font-bold text-text">{lang === 'ar' ? 'شو هي المغالطة المنطقية؟' : 'What is a logical fallacy?'}</h2>
        <p className="text-sm text-text-muted">{lang === 'ar' ? 'خطأ بطريقة الاستدلال بخلّي الحجة تبدو مقنعة أكتر مما تستحق فعلياً — حتى لو طلعت نتيجتها صحيحة بالصدفة، فالطريق يلي وصلوا فيها إلها مش سليم.' : 'A flaw in reasoning that makes an argument look more convincing than it actually is — even if the conclusion happens to be true, the path to it is not sound.'}</p>
      </div>
      <div>
        <h2 className="mb-2 font-heading text-lg font-bold text-text">{lang === 'ar' ? 'من أرسطو لليوم' : 'From Aristotle to today'}</h2>
        <p className="text-sm text-text-muted">{lang === 'ar' ? 'أول تصنيف منهجي كان لأرسطو قبل حوالي 2400 سنة. اليوم صارت أكتر انتشاراً بسبب سرعة التواصل الاجتماعي، يلي بتشجّع رد الفعل السريع عالتفكير العميق.' : "The first systematic classification was Aristotle's, roughly 2,400 years ago. Today they spread faster than ever, thanks to social media's push toward quick reactions over deep thinking."}</p>
      </div>
      <div>
        <h2 className="mb-2 font-heading text-lg font-bold text-text">{lang === 'ar' ? 'كيف بتصير؟' : 'How does it happen?'}</h2>
        <p className="text-sm text-text-muted">{lang === 'ar' ? 'الدماغ بيحب الاختصارات: بنصدّق يلي بيتكرر، بنثق بمين قريب منا، بنخاف من التغيير. المغالطات بتستغل هالميول — أحياناً بقصد، وأحياناً بدون ما يحس حتى مين قالها.' : 'The brain loves shortcuts: we trust what repeats, who feels close, and fear change. Fallacies exploit these tendencies — sometimes on purpose, sometimes without the speaker even noticing.'}</p>
      </div>
    </section>
  )
}
