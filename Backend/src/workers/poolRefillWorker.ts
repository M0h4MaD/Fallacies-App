import cron from "node-cron";
import { prisma } from "../config/prisma.js";
import { generateQuestionBatch } from "../services/questionGenerator.js";
import { generateTipBatch } from "../services/tipGenerator.js";

const REFILL_THRESHOLD = 5;
const REFILL_BATCH_SIZE = 3;
const DIFFICULTIES = ["beginner", "intermediate", "advanced"] as const;
const MODES = ["scenario", "correction"] as const;
const MAX_GEMINI_CALLS_PER_RUN = 20;
const CRON_SCHEDULE = "0 */2 * * *";
const TIP_REFILL_THRESHOLD = 8;
const TIP_BATCH_SIZE = 4;
const GENERATABLE_TIP_TYPES = ["pro_tip", "mini_challenge", "spot_it"] as const;

async function runRefillCycle() {
  let callsUsed = 0;
  const fallacies = await prisma.fallacy.findMany({ select: { id: true } });
  outer: for (const { id: fallacyId } of fallacies) {
    for (const difficultyTier of DIFFICULTIES) {
      for (const mode of MODES) {
        if (callsUsed >= MAX_GEMINI_CALLS_PER_RUN) break outer;
        const count = await prisma.generatedQuestion.count({
          where: { fallacyId, difficultyTier, mode },
        });
        if (count < REFILL_THRESHOLD) {
          const batchSize = Math.min(
            REFILL_BATCH_SIZE,
            MAX_GEMINI_CALLS_PER_RUN - callsUsed,
          );
          if (batchSize <= 0) break outer;
          await generateQuestionBatch(
            fallacyId,
            difficultyTier,
            mode,
            batchSize,
          ).catch((err) =>
            console.error(
              `Pool refill failed for ${fallacyId}/${difficultyTier}/${mode}:`,
              err,
            ),
          );
          callsUsed += batchSize;
        }
      }
    }
  }
  for (const type of GENERATABLE_TIP_TYPES) {
    if (callsUsed >= MAX_GEMINI_CALLS_PER_RUN) break;
    const count = await prisma.tip.count({
      where: { type, isGenerated: true },
    });
    if (count < TIP_REFILL_THRESHOLD) {
      const batchSize = Math.min(
        TIP_BATCH_SIZE,
        MAX_GEMINI_CALLS_PER_RUN - callsUsed,
      );
      if (batchSize <= 0) break;
      await generateTipBatch(type, batchSize).catch((err) =>
        console.error(`Tip refill failed for ${type}:`, err),
      );
      callsUsed += batchSize;
    }
  }
  console.log(
    callsUsed > 0
      ? `Content refill run: ${callsUsed} Gemini calls used.`
      : "Content refill run: nothing below threshold.",
  );
}

export function startPoolRefillWorker() {
  runRefillCycle().catch((err) =>
    console.error("Initial content refill failed:", err),
  );
  cron.schedule(CRON_SCHEDULE, () => {
    runRefillCycle().catch((err) =>
      console.error("Scheduled content refill failed:", err),
    );
  });
}
