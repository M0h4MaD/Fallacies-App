// backend/src/services/questionPool.ts (ملف جديد)
// Serves a pooled question the user hasn't seen recently; kicks off an async refill once a pool
// runs low. Never generates on the request path itself (spec 4-D-4).
import { prisma } from "../config/prisma.js";
import { generateQuestionBatch } from "./questionGenerator.js";
import { AppError } from "../middleware/errorHandler.js";
import type { Difficulty, QuizMode } from '@prisma/client'

const REFILL_THRESHOLD = 5;
const REFILL_BATCH_SIZE = 3;
const RECENT_WINDOW = 10;

export async function getPooledQuestion(
  userId: string,
  fallacyId: string,
  difficultyTier: Difficulty,
  mode: QuizMode,
) {
  const recentlyShownIds = (
    await prisma.shownQuestion.findMany({
      where: { userId, question: { fallacyId, difficultyTier, mode } },
      orderBy: { shownAt: "desc" },
      take: RECENT_WINDOW,
      select: { questionId: true },
    })
  ).map((s) => s.questionId);

  let candidates = await prisma.generatedQuestion.findMany({
    where: { fallacyId, difficultyTier, mode, id: { notIn: recentlyShownIds } },
  });
  if (candidates.length === 0)
    candidates = await prisma.generatedQuestion.findMany({
      where: { fallacyId, difficultyTier, mode },
    });
  if (candidates.length === 0)
    throw new AppError(
      "No questions available for this fallacy yet — try again shortly.",
      503,
    );

  const picked = candidates[Math.floor(Math.random() * candidates.length)];
  await prisma.shownQuestion.create({
    data: { userId, questionId: picked.id },
  });
  if (candidates.length <= REFILL_THRESHOLD)
    generateQuestionBatch(
      fallacyId,
      difficultyTier,
      mode,
      REFILL_BATCH_SIZE,
    ).catch((err) => console.error("Background pool refill failed:", err));
  return picked;
}
