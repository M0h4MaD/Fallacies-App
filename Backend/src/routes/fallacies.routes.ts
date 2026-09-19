// backend/src/routes/fallacies.routes.ts (ملف جديد)
import { Router } from 'express'
import { asyncHandler } from '../middleware/asyncHandler.js'
import { requireAdmin, verifySupabaseAuth } from '../middleware/auth.js'
import { listFallacies, getFallacy, createFallacy, updateFallacy, deleteFallacy, listUnlockedFallacies } from '../controllers/fallacies.controller.js'
import { identifyUser } from '../middleware/identify.js'

const router = Router()
router.get('/', asyncHandler(listFallacies))
router.get('/unlocked', verifySupabaseAuth, asyncHandler(listUnlockedFallacies))
router.get('/:slug', asyncHandler(getFallacy))
router.post('/', verifySupabaseAuth, asyncHandler(requireAdmin), asyncHandler(createFallacy))
router.patch('/:slug', verifySupabaseAuth, asyncHandler(requireAdmin), asyncHandler(updateFallacy))
router.delete('/:slug', verifySupabaseAuth, asyncHandler(requireAdmin), asyncHandler(deleteFallacy))
router.get('/unlocked', identifyUser, asyncHandler(listUnlockedFallacies))
export default router