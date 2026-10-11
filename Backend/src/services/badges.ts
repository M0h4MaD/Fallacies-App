interface BadgeContext { totalCorrectAnswers: number; streakCurrent: number; level: number }
interface BadgeRule { id: string; isEarned: (ctx: BadgeContext) => boolean }

const BADGE_RULES: BadgeRule[] = [
  { id: 'first-correct', isEarned: (ctx) => ctx.totalCorrectAnswers >= 1 },
  { id: 'streak-7', isEarned: (ctx) => ctx.streakCurrent >= 7 },
  { id: 'streak-30', isEarned: (ctx) => ctx.streakCurrent >= 30 },
  { id: 'level-5', isEarned: (ctx) => ctx.level >= 5 },
  { id: 'level-10', isEarned: (ctx) => ctx.level >= 10 },
]

export function evaluateBadges(ctx: BadgeContext, alreadyHeld: string[]): string[] {
  const newlyEarned = BADGE_RULES.filter((r) => !alreadyHeld.includes(r.id) && r.isEarned(ctx)).map((r) => r.id)
  return [...alreadyHeld, ...newlyEarned]
}
