// frontend/src/lib/pickGuessOptions.ts (ملف جديد — يستخدم بالمناظرة وصحّح معاً)
export function pickGuessOptions<T extends { slug: string }>(pool: T[], correctSlug: string, count = 6): T[] {
  const correct = pool.find((f) => f.slug === correctSlug)
  const distractors = pool.filter((f) => f.slug !== correctSlug)
  const shuffled = [...distractors].sort(() => Math.random() - 0.5).slice(0, Math.max(0, count - (correct ? 1 : 0)))
  const combined = correct ? [correct, ...shuffled] : shuffled.slice(0, count)
  return combined.sort(() => Math.random() - 0.5)
}