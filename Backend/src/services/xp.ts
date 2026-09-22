// backend/src/services/xp.ts (استبدله كامل)
import type { Difficulty, QuizMode } from "@prisma/client";

const XP_PER_DIFFICULTY: Record<Difficulty, number> = {
  beginner: 10,
  intermediate: 15,
  advanced: 25,
};
const MODE_MULTIPLIER: Record<QuizMode, number> = {
  scenario: 1,
  correction: 1.5,
};

export function xpForAnswer(
  difficulty: Difficulty,
  mode: QuizMode,
  wasCorrect: boolean,
  hintUsed: boolean,
): number {
  if (!wasCorrect) return 0;
  const base = Math.round(
    XP_PER_DIFFICULTY[difficulty] * MODE_MULTIPLIER[mode],
  );
  return hintUsed ? Math.round(base * 0.5) : base;
}

interface LevelInfo {
  level: number;
  xpToNextLevel: number;
}

// مصدر واحد لمنحنى المستويات — levelForXp وxpToNextLevel تحت بيرجعوا لهون، ما فيهن يختلفوا عن بعض بالغلط.
function computeLevel(totalXp: number): LevelInfo {
  let level = 1,
    threshold = 100,
    remaining = totalXp;
  while (remaining >= threshold) {
    remaining -= threshold;
    level += 1;
    threshold = Math.round(threshold * 1.25);
  }
  return { level, xpToNextLevel: threshold - remaining };
}

export function levelForXp(totalXp: number): number {
  return computeLevel(totalXp).level;
}

export function xpToNextLevel(totalXp: number): number {
  return computeLevel(totalXp).xpToNextLevel;
}
