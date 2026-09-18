// backend/src/scripts/primeQuestionPool.ts (استبدله كامل)
import "dotenv/config";
import { prisma } from "../config/prisma.js";
import { generateQuestionBatch } from "../services/questionGenerator.js";

const DIFFICULTIES = ["beginner", "intermediate", "advanced"] as const;
const MODES = ["scenario", "correction"] as const;

async function prime() {
  const fallacies = await prisma.fallacy.findMany({
    select: { id: true, nameEn: true },
  });
  for (const fallacy of fallacies) {
    for (const difficulty of DIFFICULTIES) {
      for (const mode of MODES) {
        console.log(
          `Generating for ${fallacy.nameEn} / ${difficulty} / ${mode}...`,
        );
        await generateQuestionBatch(fallacy.id, difficulty, mode, 3);
      }
    }
  }
  console.log("Pool primed.");
}

prime()
  .catch((err) => {
    console.error("Priming failed:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
