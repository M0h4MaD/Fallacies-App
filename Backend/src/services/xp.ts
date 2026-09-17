// backend/src/services/xp.ts (ملف جديد)
// Pure functions — no I/O. This is literally what "XP/level always computed server-side"
// (spec Section 3) means in code: nothing about scoring trusts the client.
import type { Difficulty, QuizMode } from '@prisma/client'

const XP_PER_DIFFICULTY: Record<Difficulty, number> = { beginner: 10, intermediate: 15, advanced: 25 }
const MODE_MULTIPLIER: Record<QuizMode, number> = { scenario: 1, correction: 1.5 }

export function xpForAnswer(difficulty: Difficulty, mode: QuizMode, wasCorrect: boolean): number {
  if (!wasCorrect) return 0
  return Math.round(XP_PER_DIFFICULTY[difficulty] * MODE_MULTIPLIER[mode])
}

export function levelForXp(totalXp: number): number {
  let level = 1
  let threshold = 100
  let remaining = totalXp
  while (remaining >= threshold) {
    remaining -= threshold
    level += 1
    threshold = Math.round(threshold * 1.25)
  }
  return level
}