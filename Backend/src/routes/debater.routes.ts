// backend/src/routes/debater.routes.ts (ملف جديد)
import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { asyncHandler } from '../middleware/asyncHandler.js'
import { identifyUser } from '../middleware/identify.js'
import { validateBody } from '../middleware/validate.js'
import { debaterTurnSchema } from '../validation/debater.schema.js'
import { debaterTurn } from '../controllers/debater.controller.js'

const router = Router()
router.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 40, standardHeaders: true, legacyHeaders: false }))
router.post('/turn', identifyUser, validateBody(debaterTurnSchema), asyncHandler(debaterTurn))
export default router