import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { asyncHandler } from '../middleware/asyncHandler.js'
import { identifyUser } from '../middleware/identify.js'
import { validateBody } from '../middleware/validate.js'
import { detectorSchema } from '../validation/detector.schema.js'
import { analyzeText } from '../controllers/detector.controller.js'

const router = Router()
router.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 20, standardHeaders: true, legacyHeaders: false }))
router.post('/', identifyUser, validateBody(detectorSchema), asyncHandler(analyzeText))
export default router
