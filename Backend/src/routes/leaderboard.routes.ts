// backend/src/routes/leaderboard.routes.ts (ملف جديد)
import { Router } from 'express'
import { asyncHandler } from '../middleware/asyncHandler.js'
import { getLeaderboard } from '../controllers/leaderboard.controller.js'

const router = Router()
router.get('/', asyncHandler(getLeaderboard))
export default router