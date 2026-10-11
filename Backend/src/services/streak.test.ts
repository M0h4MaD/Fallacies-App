import { describe, it, expect } from 'vitest'
import { nextStreak } from './streak.js'

describe('nextStreak', () => {
  it('starts a new streak with no prior activity', () => { expect(nextStreak(null, '2026-01-02', 0)).toBe(1) })
  it('increments on a consecutive day', () => { expect(nextStreak('2026-01-01', '2026-01-02', 5)).toBe(6) })
  it('resets after a missed day', () => { expect(nextStreak('2026-01-01', '2026-01-05', 5)).toBe(1) })
  it('holds steady on a same-day repeat', () => { expect(nextStreak('2026-01-01', '2026-01-01', 5)).toBe(5) })
})
