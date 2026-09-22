// backend/src/routes/tips.routes.ts (ملف جديد) — عامة، مش محتوى حساس، ما بتحتاج auth
import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { getRandomTip } from "../controllers/tips.controller.js";

const router = Router();
router.get("/random", asyncHandler(getRandomTip));

export default router;
