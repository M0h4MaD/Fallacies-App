const BASE_UNLOCKED = 5
const UNLOCK_EVERY_N_LEVELS = 2
const UNLOCK_PER_STEP = 2

export function unlockedFallacyCount(level: number, totalFallacies: number): number {
  const steps = Math.floor((level - 1) / UNLOCK_EVERY_N_LEVELS)
  return Math.min(BASE_UNLOCKED + steps * UNLOCK_PER_STEP, totalFallacies)
}
