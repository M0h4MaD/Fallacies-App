// backend/src/routes/admin.routes.ts (ملف جديد)
import { Router } from 'express'
import { z } from 'zod'
import { asyncHandler } from '../middleware/asyncHandler.js'
import { identifyUser } from '../middleware/identify.js'
import { requireAdmin } from '../middleware/auth.js'
import { validateBody } from '../middleware/validate.js'
import { listUsers, setUserSuspension } from '../controllers/admin.controller.js'

const router = Router()
router.use(identifyUser, asyncHandler(requireAdmin))
router.get('/users', asyncHandler(listUsers))
router.patch('/users/:userId/suspend', validateBody(z.object({ isSuspended: z.boolean() })), asyncHandler(setUserSuspension))
export default router