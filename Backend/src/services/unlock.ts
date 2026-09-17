// backend/src/services/unlock.ts (ملف جديد)
// Pure function — how many fallacies are unlocked at a given level. Nothing else in Phase 5
// (Question Generator) needs to know the formula, just the resulting unlocked set.
const BASE_UNLOCKED = 5 // matches the 5 beginner-tier fallacies in the seed set
const UNLOCK_EVERY_N_LEVELS = 2
const UNLOCK_PER_STEP = 2

export function unlockedFallacyCount(level: number, totalFallacies: number): number {
  const steps = Math.floor((level - 1) / UNLOCK_EVERY_N_LEVELS)
  return Math.min(BASE_UNLOCKED + steps * UNLOCK_PER_STEP, totalFallacies)
}