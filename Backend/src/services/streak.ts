// backend/src/services/streak.ts (ملف جديد)
export function nextStreak(lastActiveDate: string | null, today: string, currentStreak: number): number {
  if (!lastActiveDate) return 1
  const dayDiff = Math.round((new Date(today).getTime() - new Date(lastActiveDate).getTime()) / 86_400_000)
  if (dayDiff === 0) return currentStreak
  if (dayDiff === 1) return currentStreak + 1
  return 1
}