// frontend/src/components/ExampleDisclaimer.tsx (ملف جديد)
import { useTranslation } from 'react-i18next'

export default function ExampleDisclaimer({ contextType }: { contextType?: string }) {
  const { i18n } = useTranslation()
  if (contextType !== 'religious' && contextType !== 'political') return null
  const lang = i18n.language === 'en' ? 'en' : 'ar'
  return (
    <p className="mt-2 text-xs text-text-muted">
      {lang === 'ar'
        ? 'مثال تعليمي خيالي لشرح نمط تفكير منطقي فقط — لا يمثل رأي الموقع ولا يخص أي دين أو جهة حقيقية.'
        : "A fictional educational example illustrating a reasoning pattern only — not the site's opinion, and not about any real religion or entity."}
    </p>
  )
}