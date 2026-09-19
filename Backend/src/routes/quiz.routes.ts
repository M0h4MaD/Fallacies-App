// backend/src/routes/quiz.routes.ts (ملف جديد)
import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { asyncHandler } from '../middleware/asyncHandler.js'
import { validateBody } from '../middleware/validate.js'
import { submitQuizSchema } from '../validation/quiz.schema.js'
import { submitQuiz } from '../controllers/quiz.controller.js'
import { identifyUser } from '../middleware/identify.js'

const router = Router()
router.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 60, standardHeaders: true, legacyHeaders: false }))
router.post('/submit', identifyUser, validateBody(submitQuizSchema), asyncHandler(submitQuiz))


export default router