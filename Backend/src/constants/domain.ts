// backend/src/constants/domain.ts (ملف جديد)
// Shared enum lists so category/difficulty/etc. can't drift out of sync across schemas.
export const DIFFICULTIES = ['beginner', 'intermediate', 'advanced'] as const
export const FALLACY_CATEGORIES = ['formal', 'informal'] as const
export const FALLACY_SUBCATEGORIES = ['relevance', 'ambiguity', 'presumption', 'weak-induction'] as const
export const EXAMPLE_CONTEXTS = ['political', 'religious', 'media', 'everyday'] as const
export const QUIZ_MODES = ['scenario', 'correction'] as const