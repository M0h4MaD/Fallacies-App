// backend/src/routes/fallacies.routes.ts (استبدله كامل — تأكيد الاستيراد الصح)
import { Router } from 'express'
import { asyncHandler } from '../middleware/asyncHandler.js'
import { verifySupabaseAuth, requireAdmin } from '../middleware/auth.js'
import { identifyUser } from '../middleware/identify.js'
import { listFallacies, getFallacy, createFallacy, updateFallacy, deleteFallacy, listUnlockedFallacies } from '../controllers/fallacies.controller.js'

const router = Router()
router.get('/', asyncHandler(listFallacies))
router.get('/unlocked', identifyUser, asyncHandler(listUnlockedFallacies))
router.get('/:slug', asyncHandler(getFallacy))
router.post('/', verifySupabaseAuth, asyncHandler(requireAdmin), asyncHandler(createFallacy))
router.patch('/:slug', verifySupabaseAuth, asyncHandler(requireAdmin), asyncHandler(updateFallacy))
router.delete('/:slug', verifySupabaseAuth, asyncHandler(requireAdmin), asyncHandler(deleteFallacy))
export default router