// backend/src/validation/debater.schema.ts (ملف جديد)
import { z } from 'zod'
export const debaterTurnSchema = z.object({
  history: z.array(z.object({ speaker: z.enum(['user', 'opponent']), text: z.string().min(1).max(1000) })).max(20),
  lang: z.enum(['ar', 'en']).default('ar'),
})