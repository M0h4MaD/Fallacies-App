// backend/src/validation/report.schema.ts (ملف جديد)
import { z } from 'zod'
export const reportSchema = z.object({
  contentType: z.enum(['question', 'debater_message', 'evaluator_feedback']),
  contentText: z.string().min(1).max(2000),
  reason: z.string().max(500).optional(),
})