// backend/src/scripts/seedFallacies.ts (استبدله كامل)
import "dotenv/config";
import { prisma } from "../config/prisma.js";
import { fallaciesDraft } from "../data/fallacies.seed-data.js";

async function seed() {
  for (const draft of fallaciesDraft) {
    await prisma.fallacy.upsert({
      where: { slug: draft.slug },
      update: {},
      create: draft,
    });
  }
  console.log(`Seeded ${fallaciesDraft.length} fallacies.`);
}

seed()
  .catch((err) => {
    console.error("Seeding failed:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
