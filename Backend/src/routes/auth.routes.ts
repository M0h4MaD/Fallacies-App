// backend/src/routes/auth.routes.ts (ملف جديد)
import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { asyncHandler } from '../middleware/asyncHandler.js'
import { validateBody } from '../middleware/validate.js'
import { verifyFirebaseToken } from '../middleware/auth.js'
import { guestSchema, registerSchema } from '../validation/auth.schema.js'
import { continueAsGuest, registerOrMerge, getMe } from '../controllers/auth.controller.js'

const router = Router()
router.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 20, standardHeaders: true, legacyHeaders: false })) // spec 5: stricter limit on auth

router.post('/guest', validateBody(guestSchema), asyncHandler(continueAsGuest))
router.post('/register', verifyFirebaseToken, validateBody(registerSchema), asyncHandler(registerOrMerge))
router.get('/me', verifyFirebaseToken, asyncHandler(getMe))

export default router