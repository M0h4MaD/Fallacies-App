// backend/src/services/geminiQuota.ts (ملف جديد)
import { prisma } from '../config/prisma.js'
import { AppError } from '../middleware/errorHandler.js'

const DAILY_LIMIT = 50

export async function checkAndIncrementQuota(userId: string): Promise<void> {
  const date = new Date().toISOString().slice(0, 10)
  const quota = await prisma.dailyQuota.upsert({
    where: { userId_date: { userId, date } },
    update: {},
    create: { userId, date, callCount: 0 },
  })
  if (quota.callCount >= DAILY_LIMIT) throw new AppError('Daily AI usage limit reached — try again tomorrow.', 429)
  await prisma.dailyQuota.update({ where: { userId_date: { userId, date } }, data: { callCount: { increment: 1 } } })
}