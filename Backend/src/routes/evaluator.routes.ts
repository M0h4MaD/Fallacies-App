import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { asyncHandler } from '../middleware/asyncHandler.js'
import { identifyUser } from '../middleware/identify.js'
import { validateBody } from '../middleware/validate.js'
import { evaluatorSchema } from '../validation/evaluator.schema.js'
import { submitCorrection } from '../controllers/evaluator.controller.js'

const router = Router()
router.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 30, standardHeaders: true, legacyHeaders: false }))
router.post('/', identifyUser, validateBody(evaluatorSchema), asyncHandler(submitCorrection))
export default router
