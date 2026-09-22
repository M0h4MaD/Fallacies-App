// frontend/src/lib/badgeLabels.ts (ملف جديد — مصدر وحيد، ProfilePage.tsx كانت عندها نسخة محلية، بدّلها لاستيراد من هون)
export const BADGE_LABELS: Record<string, { ar: string; en: string }> = {
  'first-correct': { ar: 'أول إجابة صح', en: 'First Correct Answer' },
  'streak-7': { ar: '7 أيام متتالية', en: '7-Day Streak' },
  'streak-30': { ar: '30 يوم متتالي', en: '30-Day Streak' },
  'level-5': { ar: 'وصلت مستوى 5', en: 'Reached Level 5' },
  'level-10': { ar: 'وصلت مستوى 10', en: 'Reached Level 10' },
}