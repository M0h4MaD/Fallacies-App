// backend/src/controllers/quiz.controller.ts (ملف جديد)
import type { Response } from "express";
import type { Difficulty, QuizMode } from "@prisma/client";
import { prisma } from "../config/prisma.js";
import type { AuthedRequest } from "../middleware/auth.js";
import { xpForAnswer, levelForXp } from "../services/xp.js";
import { nextStreak } from "../services/streak.js";
import { evaluateBadges } from "../services/badges.js";
import { AppError } from "../middleware/errorHandler.js";

interface SubmittedAnswer {
  fallacyId: string;
  difficultyTier: Difficulty;
  wasCorrect: boolean;
  hintUsed: boolean;
}

export async function submitQuiz(req: AuthedRequest, res: Response) {
  const { mode, timeSpentSec, answers } = req.body as {
    mode: QuizMode;
    timeSpentSec: number;
    answers: SubmittedAnswer[];
  };
  const user = await prisma.user.findUnique({
    where: { firebaseUid: req.firebaseUser!.uid },
  });
  if (!user) throw new AppError("User not found", 404);

  // Server computes the score itself from the raw per-question answers — never trusts a client-sent total.
  const correctCount = answers.filter((a) => a.wasCorrect).length;
  const scorePercent = Math.round((correctCount / answers.length) * 100);
  const xpAwarded = answers.reduce(
    (sum, a) => sum + xpForAnswer(a.difficultyTier, mode, a.wasCorrect),
    0,
  );

  const today = new Date().toISOString().slice(0, 10);
  const streakCurrent = nextStreak(
    user.lastActiveDate,
    today,
    user.streakCurrent,
  );
  const newXp = user.xp + xpAwarded;
  const newLevel = levelForXp(newXp);

  const priorCorrect = await prisma.quizAnswer.count({
    where: { quiz: { userId: user.id }, wasCorrect: true },
  });
  const badgeIds = evaluateBadges(
    {
      totalCorrectAnswers: priorCorrect + correctCount,
      streakCurrent,
      level: newLevel,
    },
    user.badgeIds,
  );

  const [quiz] = await prisma.$transaction([
    prisma.quiz.create({
      data: {
        userId: user.id,
        mode,
        scorePercent,
        xpAwarded,
        timeSpentSec,
        answers: {
          create: answers.map((a) => ({
            fallacyId: a.fallacyId,
            difficultyTier: a.difficultyTier,
            wasCorrect: a.wasCorrect,
            hintUsed: a.hintUsed,
          })),
        },
      },
    }),
    prisma.user.update({
      where: { id: user.id },
      data: {
        xp: newXp,
        level: newLevel,
        streakCurrent,
        streakLongest: Math.max(user.streakLongest, streakCurrent),
        lastActiveDate: today,
        badgeIds,
      },
    }),
  ]);

  res
    .status(201)
    .json({ quiz, scorePercent, xpAwarded, newLevel, streakCurrent, badgeIds });
}
