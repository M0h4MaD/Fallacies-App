const NAMES: Record<'ar' | 'en', { adjectives: string[]; nouns: string[] }> = {
  ar: { adjectives: ['سريع', 'ذكي', 'فضولي', 'يقظ', 'منطقي'], nouns: ['المفكر', 'الباحث', 'المراقب', 'الناقد', 'المحلّل'] },
  en: { adjectives: ['Quick', 'Sharp', 'Curious', 'Keen', 'Logical'], nouns: ['Thinker', 'Seeker', 'Observer', 'Critic', 'Analyst'] },
}
export function randomGuestName(lang: 'ar' | 'en' = 'ar'): string {
  const { adjectives, nouns } = NAMES[lang]
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)]
  const noun = nouns[Math.floor(Math.random() * nouns.length)]
  return lang === 'ar' ? `${noun} ${adj} ${Math.floor(Math.random() * 900 + 100)}` : `${adj} ${noun} ${Math.floor(Math.random() * 900 + 100)}`
}
