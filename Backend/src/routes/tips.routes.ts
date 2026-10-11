import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { getDailyTip, getRandomTip } from "../controllers/tips.controller.js";

const router = Router();
router.get("/random", asyncHandler(getRandomTip));
router.get('/daily', asyncHandler(getDailyTip))

export default router;
