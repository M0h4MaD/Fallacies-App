const BASE_UNLOCKED = 5
const UNLOCK_EVERY_N_LEVELS = 2
const UNLOCK_PER_STEP = 2

function unlockedCountAtLevel(level: number, total: number): number {
  const steps = Math.floor((level - 1) / UNLOCK_EVERY_N_LEVELS)
  return Math.min(BASE_UNLOCKED + steps * UNLOCK_PER_STEP, total)
}

export function buildUnlockLevelMap(orderedSlugs: string[]): Map<string, number> {
  const map = new Map<string, number>()
  const total = orderedSlugs.length
  orderedSlugs.forEach((slug, index) => {
    let level = 1
    while (unlockedCountAtLevel(level, total) <= index) level++
    map.set(slug, level)
  })
  return map
}
