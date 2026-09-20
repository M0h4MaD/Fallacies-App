// frontend/src/types/index.ts
// Domain types mirroring the backend Mongoose schemas (spec Section 4-A/4-B/4-C).
// Single source of truth on the frontend — keep in sync with the backend models.

export type FallacyCategory = 'formal' | 'informal'
export type FallacySubCategory = 'relevance' | 'ambiguity' | 'presumption' | 'weak_induction'
export type Difficulty = 'beginner' | 'intermediate' | 'advanced'
export type ExampleContext = 'political' | 'religious' | 'media' | 'everyday'

export interface FallacyExample {
  context: ExampleContext
  text: string
  isFictionalComposite: boolean
  sourceCitation?: string
}

export interface Fallacy {
  id: string
  slug: string
  nameAr: string
  nameEn: string
  category: FallacyCategory
  subCategory: FallacySubCategory
  difficulty: Difficulty
  commonness: number
  definitionAr: string
  definitionEn: string
  historicalBackgroundAr?: string
  historicalBackgroundEn?: string
  relatedFallacyIds?: string[]
  examples?: FallacyExample[]
}

export interface AppUser {
  id: string
  displayName: string
  isGuest: boolean
  xp: number
  level: number
  streak: number
  badgeIds: string[]
  role: 'user' | 'admin'
}

export type QuizMode = 'scenario' | 'correction'

export interface QuizQuestion {
  text: string
  embeddedFallacyId: string
  difficultyTier: Difficulty
  contextType: ExampleContext
}

export interface QuizReport {
  scorePercent: number
  perFallacyBreakdown: Record<string, { correct: number; total: number }>
  timeSpentSec: number
  reviewQueueAdditions: string[]
}