// backend/src/validation/auth.schema.ts (ملف جديد)
import { z } from 'zod'

export const guestSchema = z.object({
  guestId: z.string().min(1),
  displayName: z.string().min(1).max(60).optional(),
})

export const registerSchema = z.object({ guestId: z.string().min(1).optional() })