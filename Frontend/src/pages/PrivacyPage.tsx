// frontend/src/pages/PrivacyPage.tsx (استبدله كامل)
import { useTranslation } from 'react-i18next'

export default function PrivacyPage() {
  const { i18n } = useTranslation()
  const lang = i18n.language === 'en' ? 'en' : 'ar'
  return (
    <div className="max-w-prose">
      <h1 className="mb-6 font-heading text-3xl font-bold text-text">{lang === 'ar' ? 'الخصوصية والاستخدام' : 'Privacy & Terms'}</h1>
      <div className="space-y-4 text-text">
        <p>{lang === 'ar' ? 'بنخزن اسمك وبريدك (لو سجّلت دخول بجوجل)، ونقاط خبرتك وتقدّمك بالتعلّم، عشان نحافظ على حسابك بين الجلسات.' : "We store your name and email (if you sign in with Google), plus your XP and learning progress, to keep your account consistent across sessions."}</p>
        <p>{lang === 'ar' ? 'المحتوى يلي بيولّده الذكاء الاصطناعي (الأمثلة، الشرح، المحادثات) للتدريب التعليمي بس — مش مصدر يُستشهد فيه، وممكن يحتوي أخطاء.' : "AI-generated content (examples, explanations, conversations) is for educational practice only — not a citation-grade source, and may contain mistakes."}</p>
        <p>{lang === 'ar' ? 'فيك تمسح حسابك أو تطلب حذف بياناتك بالتواصل معنا.' : 'You can delete your account or request your data be removed by contacting us.'}</p>
      </div>
    </div>
  )
}