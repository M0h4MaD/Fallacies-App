// backend/src/lib/guestNames.ts (ملف جديد)
const ADJECTIVES = ['سريع', 'ذكي', 'فضولي', 'يقظ', 'منطقي']
const NOUNS = ['المفكر', 'الباحث', 'المراقب', 'الناقد', 'المحلّل']
export function randomGuestName(): string {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)]
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)]
  return `${noun} ${adj} ${Math.floor(Math.random() * 900 + 100)}`
}