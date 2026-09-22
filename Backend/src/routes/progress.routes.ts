// backend/src/routes/progress.routes.ts (استبدله كامل)
import { Router } from 'express'
import { asyncHandler } from '../middleware/asyncHandler.js'
import { identifyUser } from '../middleware/identify.js'
import { validateBody } from '../middleware/validate.js'
import { dailyGoalSchema } from '../validation/progress.schema.js'
import { getReviewQueue, getDailyGoal, setDailyGoal } from '../controllers/progress.controller.js'

const router = Router()
router.get('/review-queue', identifyUser, asyncHandler(getReviewQueue))
router.get('/daily-goal', identifyUser, asyncHandler(getDailyGoal))
router.patch('/daily-goal', identifyUser, validateBody(dailyGoalSchema), asyncHandler(setDailyGoal))
export default router