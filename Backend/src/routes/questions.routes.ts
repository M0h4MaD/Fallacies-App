import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { asyncHandler } from '../middleware/asyncHandler.js'

import { getNextQuestion } from '../controllers/questions.controller.js'
import { identifyUser } from '../middleware/identify.js'

const router = Router()
router.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 60, standardHeaders: true, legacyHeaders: false }))
router.get('/:slug/next', identifyUser, asyncHandler(getNextQuestion))

export default router
