// backend/src/routes/progress.routes.ts (ملف جديد)
import { Router } from 'express'
import { asyncHandler } from '../middleware/asyncHandler.js'
import { identifyUser } from '../middleware/identify.js'
import { getReviewQueue } from '../controllers/progress.controller.js'


const router = Router()
router.get('/review-queue', identifyUser, asyncHandler(getReviewQueue))
export default router