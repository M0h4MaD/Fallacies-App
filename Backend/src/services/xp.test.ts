// backend/src/services/xp.test.ts (ملف جديد)
import { describe, it, expect } from 'vitest'
import { xpForAnswer, levelForXp, xpToNextLevel } from './xp.js'

describe('xpForAnswer', () => {
  it('awards 0 for a wrong answer regardless of difficulty', () => {
    expect(xpForAnswer('advanced', 'scenario', false, false)).toBe(0)
  })
  it('awards more XP for harder difficulty', () => {
    expect(xpForAnswer('advanced', 'scenario', true, false)).toBeGreaterThan(xpForAnswer('beginner', 'scenario', true, false))

  })
  it('awards more XP for correction mode than scenario mode', () => {
    expect(xpForAnswer('beginner', 'correction', true, false)).toBeGreaterThan(xpForAnswer('beginner', 'scenario', true, false))
  })
})

describe('levelForXp', () => {
  it('starts at level 1 with 0 xp', () => { expect(levelForXp(0)).toBe(1) })
  it('increases as xp grows', () => { expect(levelForXp(1000)).toBeGreaterThan(levelForXp(100)) })
})

it('halves XP when a hint was used', () => {
  expect(xpForAnswer('beginner', 'scenario', true, true)).toBeLessThan(xpForAnswer('beginner', 'scenario', true, false))
})

describe('xpToNextLevel', () => {
  it('decreases as xp approaches the next level', () => {
    expect(xpToNextLevel(90)).toBeLessThan(xpToNextLevel(10))
  })
})