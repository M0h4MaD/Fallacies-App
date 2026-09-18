// backend/src/workers/poolRefillWorker.ts (استبدله كامل)
import cron from 'node-cron'
import { prisma } from '../config/prisma.js'
import { generateQuestionBatch } from '../services/questionGenerator.js'

const REFILL_THRESHOLD = 5
const REFILL_BATCH_SIZE = 3
const DIFFICULTIES = ['beginner', 'intermediate', 'advanced'] as const
const MODES = ['scenario', 'correction'] as const

export function startPoolRefillWorker() {
  cron.schedule('*/30 * * * *', async () => {
    const fallacies = await prisma.fallacy.findMany({ select: { id: true } })
    for (const { id: fallacyId } of fallacies) {
      for (const difficultyTier of DIFFICULTIES) {
        for (const mode of MODES) {
          const count = await prisma.generatedQuestion.count({ where: { fallacyId, difficultyTier, mode } })
          if (count < REFILL_THRESHOLD) {
            await generateQuestionBatch(fallacyId, difficultyTier, mode, REFILL_BATCH_SIZE).catch((err) =>
              console.error(`Pool refill failed for ${fallacyId}/${difficultyTier}/${mode}:`, err),
            )
          }
        }
      }
    }
  })
}