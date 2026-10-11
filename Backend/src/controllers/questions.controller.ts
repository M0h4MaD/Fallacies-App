import type { Response } from 'express'
import { prisma } from '../config/prisma.js'
import type { IdentifiedRequest } from '../middleware/identify.js'
import { getPooledQuestion } from '../services/questionPool.js'
import { AppError } from '../middleware/errorHandler.js'
import { asOptionalString } from '../lib/params.js'
import type { Difficulty, QuizMode, ExampleContext } from '@prisma/client'

export async function getNextQuestion(req: IdentifiedRequest, res: Response) {
  const { slug } = req.params
  const difficultyTier = (req.query.difficulty as Difficulty) ?? 'beginner'
  const mode = (req.query.mode as QuizMode) ?? 'scenario'
  const contextType = asOptionalString(req.query.context) as ExampleContext | undefined
  const user = req.currentUser!

  const fallacy = await prisma.fallacy.findUnique({ where: { slug: asOptionalString(slug) } })
  if (!fallacy) throw new AppError('Fallacy not found', 404)

  const question = await getPooledQuestion(user.id, fallacy.id, difficultyTier, mode, contextType)
res.json({
  text: { ar: question.textAr, en: question.textEn }, embeddedFallacyId: fallacy.id, difficultyTier, contextType: question.contextType, mode,
  explanation: question.explanationAr ? { ar: question.explanationAr, en: question.explanationEn } : null,
})}
