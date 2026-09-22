// backend/src/validation/progress.schema.ts (ملف جديد)
import { z } from 'zod'
export const dailyGoalSchema = z.object({ target: z.number().int().min(1).max(5) })