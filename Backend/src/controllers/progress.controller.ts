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

export async function getDailyGoal(req: IdentifiedRequest, res: Response) {
  const user = req.currentUser!
  const startOfDay = new Date(); startOfDay.setHours(0, 0, 0, 0)
  const completedToday = await prisma.quiz.count({ where: { userId: user.id, createdAt: { gte: startOfDay } } })
  res.json({ target: user.dailyGoalTarget, completedToday })
}

export async function setDailyGoal(req: IdentifiedRequest, res: Response) {
  const { target } = req.body as { target: number }
  const user = await prisma.user.update({ where: { id: req.currentUser!.id }, data: { dailyGoalTarget: target } })
  res.json({ target: user.dailyGoalTarget })
}
