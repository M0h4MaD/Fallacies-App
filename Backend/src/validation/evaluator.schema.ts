// backend/src/validation/evaluator.schema.ts (ملف جديد)
import { z } from 'zod'
export const evaluatorSchema = z.object({
  fallacySlug: z.string().min(1),
  originalText: z.string().min(1).max(1000),
  identifiedFallacySlug: z.string().min(1),
  rewrittenText: z.string().min(1).max(1000),
  lang: z.enum(['ar', 'en']).default('ar'),
})