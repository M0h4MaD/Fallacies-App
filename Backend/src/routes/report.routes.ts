// backend/src/routes/report.routes.ts (ملف جديد)
import { Router } from 'express'
import { asyncHandler } from '../middleware/asyncHandler.js'
import { identifyUser } from '../middleware/identify.js'
import { requireAdmin } from '../middleware/auth.js'
import { validateBody } from '../middleware/validate.js'
import { reportSchema } from '../validation/report.schema.js'
import { submitReport, listReports } from '../controllers/report.controller.js'

const router = Router()
router.post('/', identifyUser, validateBody(reportSchema), asyncHandler(submitReport))
router.get('/', identifyUser, asyncHandler(requireAdmin), asyncHandler(listReports))
export default router