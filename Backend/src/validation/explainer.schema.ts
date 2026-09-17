// backend/src/validation/explainer.schema.ts (ملف جديد)
import { z } from 'zod'
export const explainerSchema = z.object({
  fallacySlug: z.string().min(1),
  question: z.string().min(1).max(500),
  lang: z.enum(['ar', 'en']).default('ar'),
})