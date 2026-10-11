import type { Response } from "express";
import type { Difficulty, QuizMode } from "@prisma/client";
import { prisma } from "../config/prisma.js";
import type { IdentifiedRequest } from "../middleware/identify.js";
import { xpForAnswer, levelForXp, xpToNextLevel } from "../services/xp.js";
import { nextStreak } from "../services/streak.js";
import { evaluateBadges } from "../services/badges.js";
import { asOptionalString } from "../lib/params.js";

interface SubmittedAnswer {
  fallacyId: string;
  difficultyTier: Difficulty;
  wasCorrect: boolean;
  hintUsed: boolean;
}
const REVIEW_INTERVALS_DAYS = [1, 3, 7];

export async function submitQuiz(req: IdentifiedRequest, res: Response) {
  const { mode, timeSpentSec, answers } = req.body as {
    mode: QuizMode;
    timeSpentSec: number;
    answers: SubmittedAnswer[];
  };
  const user = req.currentUser!;
  const idempotencyKey = asOptionalString(req.headers["idempotency-key"]);

  if (idempotencyKey) {
    const existing = await prisma.quiz.findUnique({
      where: { idempotencyKey },
    });
    if (existing) {
      res
        .status(200)
        .json({
          alreadyProcessed: true,
          quiz: existing,
          scorePercent: existing.scorePercent,
          xpAwarded: existing.xpAwarded,
        });
      return;
    }
  }

  const correctCount = answers.filter((a) => a.wasCorrect).length;
  const scorePercent = Math.round((correctCount / answers.length) * 100);
  const xpAwarded = answers.reduce(
    (sum, a) =>
      sum + xpForAnswer(a.difficultyTier, mode, a.wasCorrect, a.hintUsed),
    0,
  );

  const today = new Date().toISOString().slice(0, 10);
  const streakCurrent = nextStreak(
    user.lastActiveDate,
    today,
    user.streakCurrent,
  );
  const previousLevel = user.level;
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
  const newlyUnlockedBadgeIds = badgeIds.filter(
    (b) => !user.badgeIds.includes(b),
  );

  const perFallacyBreakdown: Record<
    string,
    { correct: number; total: number }
  > = {};
  for (const a of answers) {
    perFallacyBreakdown[a.fallacyId] ??= { correct: 0, total: 0 };
    perFallacyBreakdown[a.fallacyId].total += 1;
    if (a.wasCorrect) perFallacyBreakdown[a.fallacyId].correct += 1;
  }
  const withRate = Object.entries(perFallacyBreakdown).map(([id, s]) => ({
    id,
    rate: s.correct / s.total,
  }));
  const weakestFallacyId = withRate.length
    ? withRate.reduce((a, b) => (a.rate <= b.rate ? a : b)).id
    : null;
  const strongestFallacyId = withRate.length
    ? withRate.reduce((a, b) => (a.rate >= b.rate ? a : b)).id
    : null;

  const existingProgress = await prisma.progress.findMany({
    where: {
      userId: user.id,
      fallacyId: { in: answers.map((a) => a.fallacyId) },
    },
  });
  const progressByFallacy = new Map(
    existingProgress.map((p) => [p.fallacyId, p]),
  );
  const progressUpserts = answers.map((a) => {
    const existing = progressByFallacy.get(a.fallacyId);
    const intervalIndex = a.wasCorrect
      ? Math.min(
          (existing?.reviewIntervalIndex ?? -1) + 1,
          REVIEW_INTERVALS_DAYS.length - 1,
        )
      : 0;
    const nextReviewDue = new Date();
    nextReviewDue.setDate(
      nextReviewDue.getDate() + REVIEW_INTERVALS_DAYS[intervalIndex],
    );
    return prisma.progress.upsert({
      where: { userId_fallacyId: { userId: user.id, fallacyId: a.fallacyId } },
      update: {
        timesCorrect: { increment: a.wasCorrect ? 1 : 0 },
        timesIncorrect: { increment: a.wasCorrect ? 0 : 1 },
        lastReviewedAt: new Date(),
        nextReviewDue,
        reviewIntervalIndex: intervalIndex,
      },
      create: {
        userId: user.id,
        fallacyId: a.fallacyId,
        timesCorrect: a.wasCorrect ? 1 : 0,
        timesIncorrect: a.wasCorrect ? 0 : 1,
        lastReviewedAt: new Date(),
        nextReviewDue,
        reviewIntervalIndex: intervalIndex,
      },
    });
  });

  const [quiz] = await prisma.$transaction([
    prisma.quiz.create({
      data: {
        userId: user.id,
        mode,
        scorePercent,
        xpAwarded,
        timeSpentSec,
        idempotencyKey,
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
    ...progressUpserts,
  ]);

  res.status(201).json({
    quiz,
    scorePercent,
    xpAwarded,
    newLevel,
    previousLevel,
    streakCurrent,
    badgeIds,
    newlyUnlockedBadgeIds,
    xpToNextLevel: xpToNextLevel(newXp),
    weakestFallacyId,
    strongestFallacyId,
    perFallacyBreakdown,
  });
}
