import { prisma } from '../config/prisma.js'
import { AppError } from '../middleware/errorHandler.js'

const DAILY_LIMIT = 50

export async function checkAndIncrementQuota(userId: string): Promise<void> {
  const date = new Date().toISOString().slice(0, 10)
  const existing = await prisma.dailyQuota.findUnique({ where: { userId_date: { userId, date } } })
  if (existing && existing.callCount >= DAILY_LIMIT) throw new AppError('Daily AI usage limit reached — try again tomorrow.', 429)

  await prisma.dailyQuota.upsert({
    where: { userId_date: { userId, date } },
    create: { userId, date, callCount: 1 },
    update: { callCount: { increment: 1 } },
  })
}
