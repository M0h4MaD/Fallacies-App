import { useTranslation } from 'react-i18next'

export default function AboutPage() {
  const { i18n } = useTranslation()
  const lang = i18n.language === 'en' ? 'en' : 'ar'
  return (
    <div className="max-w-prose">
      <h1 className="mb-6 font-heading text-3xl font-bold text-text">{lang === 'ar' ? 'عن الموقع' : 'About'}</h1>
      <div className="space-y-4 text-text">
        <p>{lang === 'ar' ? 'مغالطة موقع تعليمي محايد بيعلّم مهارة التفكير النقدي — كيف تكتشف أخطاء الاستدلال بالخطاب اليومي، سواء بالسياسة، الدين، الإعلام، أو الحياة العادية.' : 'Mughalata is a neutral educational site teaching critical-thinking skills — how to spot reasoning errors in everyday speech, whether in politics, religion, media, or daily life.'}</p>
        <p>{lang === 'ar' ? 'الموقع لا ينتمي لأي دين أو طائفة أو تيار سياسي. الأمثلة كلها خيالية ومركّبة بالكامل، ما بتشير لأشخاص حقيقيين، وما بتحكم على صحة أي معتقد ديني أو موقف سياسي — هدفها الوحيد إظهار نمط الاستدلال بغض النظر عن الموضوع المطروح فيه.' : "The site doesn't belong to any religion, sect, or political stream. Every example is entirely fictional and composite, never referring to real people, and never judging the truth of any religious belief or political position — the only goal is showing the reasoning pattern, regardless of the topic it appears in."}</p>

        <h2 className="pt-4 font-heading text-lg font-bold text-text">{lang === 'ar' ? 'الخصوصية' : 'Privacy'}</h2>
        <p>{lang === 'ar' ? 'بنخزن اسمك وبريدك (لو سجّلت دخول بجوجل أو إيميل)، ونقاط خبرتك وتقدّمك بالتعلّم، عشان نحافظ على حسابك بين الجلسات.' : 'We store your name and email (if you sign in with Google or email), plus your XP and learning progress, to keep your account consistent across sessions.'}</p>
        <p>{lang === 'ar' ? 'المحتوى يلي بيولّده الذكاء الاصطناعي (الأمثلة، الشرح، المحادثات) للتدريب التعليمي بس — مش مصدر يُستشهد فيه، وممكن يحتوي أخطاء.' : 'AI-generated content (examples, explanations, conversations) is for educational practice only — not a citation-grade source, and may contain mistakes.'}</p>
        <p>{lang === 'ar' ? 'فيك تمسح حسابك أو تطلب حذف بياناتك بالتواصل معنا.' : 'You can delete your account or request your data be removed by contacting us.'}</p>

        <p className="pt-2">{lang === 'ar' ? 'شايف مثال حاسّه غير مناسب أو منحاز؟ استخدم زر الإبلاغ 🚩 تحت أي مثال.' : 'See an example that feels off or biased? Use the 🚩 report button under any example.'}</p>
      </div>
    </div>
  )
}
