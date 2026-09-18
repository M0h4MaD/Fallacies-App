// backend/src/routes/fallacies.routes.ts (ملف جديد)
import { Router } from 'express'
import { asyncHandler } from '../middleware/asyncHandler.js'
import { verifyFirebaseToken, requireAdmin } from '../middleware/auth.js'
import { listFallacies, getFallacy, createFallacy, updateFallacy, deleteFallacy, listUnlockedFallacies } from '../controllers/fallacies.controller.js'
import { identifyUser } from '../middleware/identify.js'

const router = Router()
router.get('/', asyncHandler(listFallacies))
router.get('/unlocked', verifyFirebaseToken, asyncHandler(listUnlockedFallacies))
router.get('/:slug', asyncHandler(getFallacy))
router.post('/', verifyFirebaseToken, asyncHandler(requireAdmin), asyncHandler(createFallacy))
router.patch('/:slug', verifyFirebaseToken, asyncHandler(requireAdmin), asyncHandler(updateFallacy))
router.delete('/:slug', verifyFirebaseToken, asyncHandler(requireAdmin), asyncHandler(deleteFallacy))
router.get('/unlocked', identifyUser, asyncHandler(listUnlockedFallacies))
export default router