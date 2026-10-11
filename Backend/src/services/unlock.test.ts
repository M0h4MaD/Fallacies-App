import { describe, it, expect } from 'vitest'
import { unlockedFallacyCount } from './unlock.js'

describe('unlockedFallacyCount', () => {
  it('unlocks the base beginner set at level 1', () => { expect(unlockedFallacyCount(1, 18)).toBe(5) })
  it('unlocks more every couple levels', () => { expect(unlockedFallacyCount(5, 18)).toBeGreaterThan(unlockedFallacyCount(1, 18)) })
  it('never exceeds the total library size', () => { expect(unlockedFallacyCount(100, 18)).toBe(18) })
})
