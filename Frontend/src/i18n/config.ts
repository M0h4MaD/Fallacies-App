// frontend/src/i18n/config.ts 
// Language-driven side effects (dir, lang, title, persistence) live HERE via the
// languageChanged event — not in a component — so they fire no matter what triggers the change.
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import ar from './ar'
import en from './en'

export type AppLanguage = 'ar' | 'en'
const STORAGE_KEY = 'lang'

function detectInitialLanguage(): AppLanguage {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'ar' || stored === 'en') return stored
  // Browser-language fallback — first visit only, before any explicit choice exists.
  return navigator.language.toLowerCase().startsWith('en') ? 'en' : 'ar'
}

function applyLanguageSideEffects(lang: string) {
  document.documentElement.lang = lang
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
  document.title = lang === 'ar' ? ar.app.title : en.app.title
  localStorage.setItem(STORAGE_KEY, lang)
}

i18n.use(initReactI18next).init({
  resources: { ar: { translation: ar }, en: { translation: en } },
  lng: detectInitialLanguage(),
  fallbackLng: 'ar',
  interpolation: { escapeValue: false },
})

applyLanguageSideEffects(i18n.language)
i18n.on('languageChanged', applyLanguageSideEffects)

export default i18n