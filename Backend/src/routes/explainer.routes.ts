// backend/src/routes/explainer.routes.ts (ملف جديد)
import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { asyncHandler } from '../middleware/asyncHandler.js'
import { identifyUser } from '../middleware/identify.js'
import { validateBody } from '../middleware/validate.js'
import { explainerSchema } from '../validation/explainer.schema.js'
import { askExplainer } from '../controllers/explainer.controller.js'

const router = Router()
router.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 30, standardHeaders: true, legacyHeaders: false }))
router.post('/', identifyUser, validateBody(explainerSchema), asyncHandler(askExplainer))
export default router