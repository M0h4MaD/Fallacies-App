// backend/src/routes/auth.routes.ts (ملف جديد)
import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { asyncHandler } from '../middleware/asyncHandler.js'
import { validateBody } from '../middleware/validate.js'
import { guestSchema, registerSchema, updateNameSchema } from '../validation/auth.schema.js'
import { continueAsGuest, registerOrMerge, getMe, updateDisplayName } from '../controllers/auth.controller.js'
import { identifyUser } from '../middleware/identify.js' 
import { verifySupabaseAuth } from '../middleware/auth.js'

const router = Router()
router.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 20, standardHeaders: true, legacyHeaders: false })) // spec 5: stricter limit on auth

router.post('/guest', validateBody(guestSchema), asyncHandler(continueAsGuest))
router.post('/register', verifySupabaseAuth, validateBody(registerSchema), asyncHandler(registerOrMerge))
router.get('/me', identifyUser, asyncHandler(getMe))
router.patch('/me', identifyUser, validateBody(updateNameSchema), asyncHandler(updateDisplayName))

export default router