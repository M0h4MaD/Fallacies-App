import { z } from 'zod'
export const detectorSchema = z.object({ text: z.string().min(3).max(2000), lang: z.enum(['ar', 'en']).default('ar') })
