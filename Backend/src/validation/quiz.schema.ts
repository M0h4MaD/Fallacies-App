import { z } from 'zod'

export const submitQuizSchema = z.object({
  mode: z.enum(['scenario', 'correction']),
  timeSpentSec: z.number().int().min(0),
  answers: z.array(z.object({
    fallacyId: z.string().min(1),
    difficultyTier: z.enum(['beginner', 'intermediate', 'advanced']),
    wasCorrect: z.boolean(),
    hintUsed: z.boolean().default(false),
  })).min(1),
})
