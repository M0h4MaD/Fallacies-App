// backend/src/routes/fallacies.routes.ts (ملف جديد)
import { Router } from 'express'
import { asyncHandler } from '../middleware/asyncHandler.js'
import { verifyFirebaseToken, requireAdmin } from '../middleware/auth.js'
import { listFallacies, getFallacy, createFallacy, updateFallacy, deleteFallacy, listUnlockedFallacies } from '../controllers/fallacies.controller.js'

const router = Router()
router.get('/', asyncHandler(listFallacies))
router.get('/unlocked', verifyFirebaseToken, asyncHandler(listUnlockedFallacies))
router.get('/:slug', asyncHandler(getFallacy))
router.post('/', verifyFirebaseToken, asyncHandler(requireAdmin), asyncHandler(createFallacy))
router.patch('/:slug', verifyFirebaseToken, asyncHandler(requireAdmin), asyncHandler(updateFallacy))
router.delete('/:slug', verifyFirebaseToken, asyncHandler(requireAdmin), asyncHandler(deleteFallacy))
export default router