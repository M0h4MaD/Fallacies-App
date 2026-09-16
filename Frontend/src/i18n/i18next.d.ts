// frontend/src/i18n/i18next.d.ts 
// Type-checks t('some.key') against the real resource shape — a typo becomes a
// compile error instead of a silently-empty string in production.
import 'i18next'
import ar from './ar'

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation'
    resources: { translation: typeof ar }
  }
}