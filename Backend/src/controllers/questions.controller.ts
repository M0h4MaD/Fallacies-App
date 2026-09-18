// backend/src/controllers/questions.controller.ts (استبدله كامل)
import type { Response } from 'express'
import { prisma } from '../config/prisma.js'
import type { IdentifiedRequest } from '../middleware/identify.js'
import { getPooledQuestion } from '../services/questionPool.js'
import { AppError } from '../middleware/errorHandler.js'
import type { Difficulty, QuizMode } from '@prisma/client'

export async function getNextQuestion(req: IdentifiedRequest, res: Response) {
  const { slug } = req.params
  const difficultyTier = (req.query.difficulty as Difficulty) ?? 'beginner'
  const mode = (req.query.mode as QuizMode) ?? 'scenario'
  const user = req.currentUser!

  const fallacy = await prisma.fallacy.findUnique({ where: { slug } })
  if (!fallacy) throw new AppError('Fallacy not found', 404)

  const question = await getPooledQuestion(user.id, fallacy.id, difficultyTier, mode)
  res.json({ text: { ar: question.textAr, en: question.textEn }, embeddedFallacyId: fallacy.id, difficultyTier, contextType: question.contextType, mode })
}