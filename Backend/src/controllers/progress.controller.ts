// backend/src/controllers/progress.controller.ts (ملف جديد)
import type { Response } from 'express'
import { prisma } from '../config/prisma.js'
import type { IdentifiedRequest } from '../middleware/identify.js'

export async function getReviewQueue(req: IdentifiedRequest, res: Response) {
  const items = await prisma.progress.findMany({
    where: { userId: req.currentUser!.id, nextReviewDue: { lte: new Date() } },
    include: { fallacy: true },
    orderBy: { nextReviewDue: 'asc' },
  })
  res.json(items.map((p) => ({ fallacy: p.fallacy, timesCorrect: p.timesCorrect, timesIncorrect: p.timesIncorrect })))
}